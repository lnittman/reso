"use client";

import React from 'react';
import { AIPlaylistGenerator } from '@/components/music/AIPlaylistGenerator';

export default function GeneratePlaylistPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Create AI Playlist</h1>
        <p className="text-muted-foreground">
          Let our AI help you create the perfect playlist based on your preferences
        </p>
      </div>
      
      <AIPlaylistGenerator />
    </div>
  );
} 