import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import type { NextRequest } from 'next/server';
import type { NextAuthOptions } from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID || '',
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: 'user-read-email user-read-private user-top-read user-read-recently-played playlist-read-private playlist-read-collaborative',
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/profile/setup',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === 'spotify' && profile) {
        // Add Spotify specific data to token
        token.spotifyAccessToken = account.access_token;
        token.spotifyRefreshToken = account.refresh_token;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
};

// Helper function to get the current session
export async function getCurrentSession() {
  return getServerSession(authOptions);
}

// Helper function to get the current user
export async function getCurrentUser() {
  const session = await getCurrentSession();
  
  if (!session?.user?.id) {
    return null;
  }
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profiles: true,
    },
  });
  
  return user;
}

// Middleware to protect API routes
export async function withAuth(
  handler: (req: NextRequest, user: any) => Promise<NextResponse>,
  req: NextRequest
) {
  const session = await getCurrentSession();
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  return handler(req, user);
} 