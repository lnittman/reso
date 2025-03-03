# Implementation Guide

This document provides implementation details and coding standards for the reso project.

## Table of Contents
- [Technology Stack Overview](#technology-stack-overview)
- [Project Structure](#project-structure)
- [Core Features Implementation](#core-features-implementation)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Data Management](#data-management)
- [Performance Optimization](#performance-optimization)
- [Testing Strategy](#testing-strategy)
- [Deployment Pipeline](#deployment-pipeline)
- [Coding Standards](#coding-standards)

## Technology Stack Overview

reso is built using a modern React-based stack with Next.js as the foundation. Here's an overview of our technology choices:

- **Frontend Framework**: Next.js with App Router for optimized client and server rendering
- **UI Library**: React with TypeScript for type-safe component development
- **Styling**: TailwindCSS for utility-based styling with shadcn/ui components
- **Animations**: Framer Motion for fluid UI transitions and interactions
- **State Management**: React Query for server state and data fetching
- **API Communication**: RESTful APIs and GraphQL for flexible data fetching
- **Database**: Relational database with Prisma ORM for type-safe queries
- **Authentication**: OAuth integration with music streaming services

## Project Structure

The project follows the Next.js App Router convention with a focus on modularity:

```
reso/
├── app/                      # App Router pages and layouts
│   ├── (auth)/               # Authentication routes
│   ├── (dashboard)/          # Main application routes
│   ├── api/                  # API routes
│   └── layout.tsx            # Root layout
├── components/               # Reusable UI components
│   ├── ui/                   # Base UI components (shadcn)
│   ├── music/                # Music-specific components
│   ├── profiles/             # User profile components
│   └── shared/               # Shared utility components
├── lib/                      # Utility functions and helpers
│   ├── api/                  # API client utilities
│   ├── auth/                 # Authentication utilities
│   ├── db/                   # Database utilities
│   └── utils/                # General utilities
├── prisma/                   # Prisma schema and migrations
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── public/                   # Static assets
├── styles/                   # Global styles
├── types/                    # TypeScript type definitions
└── next.config.js            # Next.js configuration
```

## Core Features Implementation

### Daily AI-Curated Recommendations

The recommendation system uses a combination of collaborative filtering and content-based approaches:

```typescript
// app/api/recommendations/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { generateRecommendations } from '@/lib/ai/recommendation-engine';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Fetch user's listening history
    const listeningHistory = await prisma.userActivity.findMany({
      where: { userId: user.id },
      include: { track: true },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    
    // Generate personalized recommendations
    const recommendations = await generateRecommendations({
      userId: user.id,
      listeningHistory,
      limit: 10
    });
    
    // Record that recommendations were generated
    await prisma.recommendationBatch.create({
      data: {
        userId: user.id,
        recommendations: {
          create: recommendations.map(rec => ({
            trackId: rec.trackId,
            score: rec.score,
            explanation: rec.explanation
          }))
        }
      }
    });
    
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
```

Implementation for the recommendation component:

```tsx
// components/music/DailyRecommendations.tsx
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrackCard } from '@/components/music/TrackCard';

export function DailyRecommendations() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recommendations', 'daily'],
    queryFn: async () => {
      const response = await fetch('/api/recommendations');
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Today's Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[300px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Oops!</CardTitle>
          <CardDescription>
            We couldn't load your recommendations. Please try again later.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Today's Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((recommendation) => (
          <TrackCard
            key={recommendation.trackId}
            track={recommendation.track}
            explanation={recommendation.explanation}
          />
        ))}
      </div>
    </div>
  );
}
```

### Social Music Profiles

User profiles are implemented using Prisma schema:

```prisma
// prisma/schema.prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  image         String?
  bio           String?
  favoriteTracks Track[]   @relation("UserFavorites")
  topGenres     String[]
  listeningStats ListeningStats?
  followers     Follow[]  @relation("Following")
  following     Follow[]  @relation("Follower")
  playlists     Playlist[]
  activities    UserActivity[]
  recommendations RecommendationBatch[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model ListeningStats {
  id            String    @id @default(cuid())
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  totalMinutes  Int       @default(0)
  trackCount    Int       @default(0)
  artistCount   Int       @default(0)
  genreDistribution Json?
  weeklyActivity Json?
  updatedAt     DateTime  @updatedAt
}

model Follow {
  id            String    @id @default(cuid())
  followerId    String
  follower      User      @relation("Follower", fields: [followerId], references: [id], onDelete: Cascade)
  followingId   String
  following     User      @relation("Following", fields: [followingId], references: [id], onDelete: Cascade)
  createdAt     DateTime  @default(now())

  @@unique([followerId, followingId])
}
```

Profile component implementation:

```tsx
// components/profiles/UserProfile.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MusicGenreChart } from '@/components/music/MusicGenreChart';
import { TrackList } from '@/components/music/TrackList';
import { PlaylistGrid } from '@/components/music/PlaylistGrid';
import { UserActivityFeed } from '@/components/profiles/UserActivityFeed';

export function UserProfile({ userId }) {
  const [activeTab, setActiveTab] = useState('overview');
  const queryClient = useQueryClient();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch profile');
      return res.json();
    }
  });
  
  const followMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to follow user');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    }
  });
  
  if (isLoading) {
    return <div>Loading profile...</div>;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.image} alt={profile.name} />
            <AvatarFallback>{profile.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl">{profile.name}</CardTitle>
            <CardDescription>{profile.bio}</CardDescription>
            <div className="flex items-center gap-4 mt-2">
              <span>{profile.followers.length} followers</span>
              <span>{profile.following.length} following</span>
            </div>
          </div>
          {!profile.isCurrentUser && (
            <Button 
              onClick={() => followMutation.mutate()}
              disabled={followMutation.isPending}
            >
              {profile.isFollowedByUser ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Genres</CardTitle>
              </CardHeader>
              <CardContent>
                <MusicGenreChart data={profile.listeningStats.genreDistribution} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Listening Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt>Total Listening Time</dt>
                    <dd>{Math.round(profile.listeningStats.totalMinutes / 60)} hours</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Tracks Played</dt>
                    <dd>{profile.listeningStats.trackCount}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Artists Explored</dt>
                    <dd>{profile.listeningStats.artistCount}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="favorites">
          <TrackList tracks={profile.favoriteTracks} />
        </TabsContent>
        
        <TabsContent value="playlists">
          <PlaylistGrid playlists={profile.playlists} />
        </TabsContent>
        
        <TabsContent value="activity">
          <UserActivityFeed userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### Music Sharing & Reactions

Implementing the music sharing feature:

```typescript
// app/api/share/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { trackId, recipientId, message, reaction } = await request.json();
    
    // Validate input
    if (!trackId || !recipientId) {
      return NextResponse.json(
        { error: 'Track ID and recipient ID are required' }, 
        { status: 400 }
      );
    }
    
    // Check if recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId }
    });
    
    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' }, 
        { status: 404 }
      );
    }
    
    // Create share record
    const share = await prisma.musicShare.create({
      data: {
        senderId: user.id,
        recipientId,
        trackId,
        message,
        reaction,
      },
      include: {
        sender: {
          select: { id: true, name: true, image: true }
        },
        track: true
      }
    });
    
    // Create notification for recipient
    await prisma.notification.create({
      data: {
        userId: recipientId,
        type: 'MUSIC_SHARE',
        content: `${user.name} shared a track with you`,
        resourceId: share.id,
        resourceType: 'MUSIC_SHARE'
      }
    });
    
    return NextResponse.json(share);
  } catch (error) {
    console.error('Error sharing music:', error);
    return NextResponse.json(
      { error: 'Failed to share music' },
      { status: 500 }
    );
  }
}
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs/pages/api-reference/config/typescript) - Official documentation for Next.js framework with TypeScript integration guides
- [TypeScript Documentation](https://www.typescriptlang.org/docs/handbook/intro.html) - Core TypeScript language documentation for type system implementation
- [React Query Documentation](https://tanstack.com/query/v5) - Official React Query docs for server state management
- [Tailwind CSS Documentation](https://tailwindcss.com/docs/guides/nextjs-guide) - Utility-first CSS framework integration with Next.js
- [LogRocket Next.js TypeScript Tutorial](https://blog.logrocket.com/using-next-js-with-typescript/) - Step-by-step guide for building Next.js apps with TypeScript
- [Prismic App Router TypeScript Guide](https://prismic.io/blog/nextjs-typescript) - Implementing TypeScript in Next.js 13+ App Router
- [Refine.dev TypeScript Integration](https://refine.dev/blog/next-js-with-typescript/) - Adding TypeScript to Next.js apps with data fetching examples
- [Linode Next.js TypeScript Setup](https://www.linode.com/docs/guides/next-js-with-typescript/) - Creating new/existing projects with TypeScript support