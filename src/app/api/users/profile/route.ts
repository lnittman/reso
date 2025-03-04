import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser, withAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Schema for profile creation/update
const profileSchema = z.object({
  username: z.string().min(3).max(30),
  bio: z.string().max(500).optional(),
  favoriteGenres: z.array(z.string()).min(1).max(10),
});

// GET /api/users/profile - Get current user's profile
export async function GET(request: NextRequest) {
  return withAuth(async (req, user) => {
    try {
      const profile = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          preferredGenres: true,
          preferredMoods: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      
      if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }
      
      return NextResponse.json(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }
  }, request);
}

// POST /api/users/profile - Create or update user profile
export async function POST(request: NextRequest) {
  return withAuth(async (req, user) => {
    try {
      const body = await request.json();
      
      // Validate request body
      const validatedData = profileSchema.parse(body);
      
      // Check if username is already taken
      if (validatedData.username) {
        const existingUser = await prisma.user.findFirst({
          where: {
            name: validatedData.username,
            id: { not: user.id },
          },
        });
        
        if (existingUser) {
          return NextResponse.json(
            { error: 'Username is already taken' },
            { status: 400 }
          );
        }
      }
      
      // Update user with profile information
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: validatedData.username,
          preferredGenres: validatedData.favoriteGenres,
        },
      });
      
      return NextResponse.json(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid data', details: error.errors },
          { status: 400 }
        );
      }
      
      console.error('Error updating profile:', error);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }
  }, request);
} 