import React from 'react';
import { DailyRecommendations } from '@/components/music/DailyRecommendations';

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome to reso</h1>
        <p className="text-muted-foreground">
          Your social-first, AI-native music discovery platform
        </p>
      </section>
      
      <section>
        <DailyRecommendations />
      </section>
    </div>
  );
} 