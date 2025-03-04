"use client";

import { AIPlaylistGenerator } from '@/components/music/AIPlaylistGenerator';

export default function GeneratePlaylistPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Create AI-Generated Playlist</h1>
      <p className="text-muted-foreground mb-8">
        Let our AI create a personalized playlist based on your preferences. 
        Select genres, mood, and era to get started.
      </p>
      
      <AIPlaylistGenerator />
    </div>
  );
} 