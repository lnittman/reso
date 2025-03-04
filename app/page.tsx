"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { LandingPage } from '@/components/marketing/LandingPage';
import { AppDashboard } from '@/components/dashboard/AppDashboard';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  
  // If authenticated, show the app dashboard, otherwise show the landing page
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl animate-pulse">💿</div>
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <AppDashboard /> : <LandingPage />;
} 