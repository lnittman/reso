"use client";

import React from 'react';
import { AIPlaylistGenerator } from '@/components/playlist/AIPlaylistGenerator';

export default function CreatePlaylistPage() {
  return (
    <div className="container max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Create Playlist</h1>
      <AIPlaylistGenerator />
    </div>
  );
} 