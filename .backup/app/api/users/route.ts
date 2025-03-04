import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Fetch users with optional search
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        profiles: {
          select: {
            favoriteGenres: true,
          }
        },
        _count: {
          select: {
            followers: true,
            following: true,
            playlists: true,
          }
        }
      },
      take: limit,
      skip: offset,
      orderBy: {
        name: 'asc',
      },
    });
    
    const totalUsers = await prisma.user.count({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      },
    });
    
    return NextResponse.json({
      users,
      pagination: {
        total: totalUsers,
        limit,
        offset,
        hasMore: offset + limit < totalUsers,
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { name, bio, favoriteGenres } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }
    
    // Check if user has a profile
    const profile = await prisma.musicProfile.findFirst({
      where: {
        userId: user.id
      }
    });
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { 
        id: user.id 
      },
      data: { 
        name,
        bio
      },
      include: {
        profiles: true
      }
    });
    
    // If profile exists, update it; otherwise create one
    if (profile) {
      await prisma.musicProfile.update({
        where: {
          id: profile.id
        },
        data: {
          favoriteGenres: favoriteGenres || []
        }
      });
    } else {
      await prisma.musicProfile.create({
        data: {
          userId: user.id,
          favoriteGenres: favoriteGenres || []
        }
      });
    }
    
    // Fetch the updated user with profile
    const finalUser = await prisma.user.findUnique({
      where: {
        id: user.id
      },
      include: {
        profiles: true
      }
    });
    
    return NextResponse.json(finalUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
} 