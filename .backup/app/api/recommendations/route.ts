import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// Mock recommendation generation function
// In a real implementation, this would be replaced with a proper recommendation engine
async function generateRecommendations(userId: string, limit: number = 10) {
  // Get user's favorite genres from their profile
  const userProfile = await prisma.musicProfile.findFirst({
    where: { userId },
    select: { favoriteGenres: true }
  });
  
  const favoriteGenres = userProfile?.favoriteGenres || [];
  
  // Get user's existing recommendations to avoid duplicates
  const existingRecommendations = await prisma.recommendation.findMany({
    where: { userId },
    select: { songId: true }
  });
  
  const existingSongIds = existingRecommendations.map(rec => rec.songId);
  
  // Find songs that match the user's favorite genres and haven't been recommended before
  const songs = await prisma.song.findMany({
    where: {
      genres: {
        hasSome: favoriteGenres.length > 0 ? favoriteGenres : undefined
      },
      id: {
        notIn: existingSongIds.length > 0 ? existingSongIds : undefined
      }
    },
    take: limit
  });
  
  // If not enough songs found, get additional popular songs
  if (songs.length < limit) {
    const additionalSongs = await prisma.song.findMany({
      where: {
        id: {
          notIn: [...existingSongIds, ...songs.map(s => s.id)]
        }
      },
      orderBy: {
        playCount: 'desc'
      },
      take: limit - songs.length
    });
    
    songs.push(...additionalSongs);
  }
  
  // Generate explanations for the recommendations
  const explanations = [
    "Based on your interest in {genre}",
    "Similar to artists you enjoy",
    "Popular in genres you like",
    "Trending in {genre}",
    "Featured in our {genre} collection",
    "Matches your listening patterns",
    "Recommended by listeners with similar taste"
  ];
  
  // Create recommendation objects
  return songs.map(song => {
    const genreForExplanation = song.genres.length > 0 
      ? song.genres[Math.floor(Math.random() * song.genres.length)]
      : "music";
    
    const explanationTemplate = explanations[Math.floor(Math.random() * explanations.length)];
    const explanation = explanationTemplate.replace('{genre}', genreForExplanation);
    
    return {
      song,
      explanation
    };
  });
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = user.id;
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const refresh = searchParams.get('refresh') === 'true';
    
    // Check if we have recommendations from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let existingRecommendations: any[] = [];
    
    if (!refresh) {
      existingRecommendations = await prisma.recommendation.findMany({
        where: {
          userId,
          createdAt: {
            gte: today
          }
        },
        include: {
          song: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }
    
    // If we have recommendations and don't want a refresh, return them
    if (existingRecommendations.length > 0 && !refresh) {
      return NextResponse.json(
        existingRecommendations.map(rec => ({
          id: rec.id,
          track: rec.song,
          explanation: rec.explanation,
          isLiked: rec.isLiked
        }))
      );
    }
    
    // Otherwise, generate new recommendations
    const recommendations = await generateRecommendations(userId, limit);
    
    // Store the new recommendations in the database
    const savedRecommendations = await Promise.all(
      recommendations.map(async (rec) => {
        return prisma.recommendation.create({
          data: {
            userId,
            songId: rec.song.id,
            explanation: rec.explanation,
            isLiked: false
          },
          include: {
            song: true
          }
        });
      })
    );
    
    // Format the response
    return NextResponse.json(
      savedRecommendations.map(rec => ({
        id: rec.id,
        track: rec.song,
        explanation: rec.explanation,
        isLiked: rec.isLiked
      }))
    );
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

// Allow users to provide feedback on recommendations
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = user.id;
    const body = await request.json();
    const { recommendationId, isLiked } = body;
    
    if (!recommendationId) {
      return NextResponse.json(
        { error: 'Recommendation ID is required' },
        { status: 400 }
      );
    }
    
    // Find the recommendation
    const recommendation = await prisma.recommendation.findUnique({
      where: {
        id: recommendationId
      }
    });
    
    if (!recommendation) {
      return NextResponse.json(
        { error: 'Recommendation not found' },
        { status: 404 }
      );
    }
    
    if (recommendation.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Update the recommendation with feedback
    const updatedRecommendation = await prisma.recommendation.update({
      where: {
        id: recommendationId
      },
      data: {
        isLiked
      },
      include: {
        song: true
      }
    });
    
    return NextResponse.json({
      id: updatedRecommendation.id,
      track: updatedRecommendation.song,
      explanation: updatedRecommendation.explanation,
      isLiked: updatedRecommendation.isLiked
    });
  } catch (error) {
    console.error('Error updating recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to update recommendation' },
      { status: 500 }
    );
  }
} 