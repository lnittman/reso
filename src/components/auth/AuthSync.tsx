"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/lib/store';

/**
 * AuthSync is a component that syncs NextAuth session state
 * with our Zustand store, without using React Context.
 * 
 * Place this component near the root of your app.
 */
export function AuthSync() {
  const { data: session, status } = useSession();
  const { setUser, setAuthenticated, setLoading } = useAuthStore();
  
  useEffect(() => {
    // Update loading state based on NextAuth status
    setLoading(status === 'loading');
    
    // Update auth state when session changes
    if (status === 'authenticated' && session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name || undefined,
        email: session.user.email || undefined,
        image: session.user.image || undefined,
      });
      setAuthenticated(true);
    } else if (status === 'unauthenticated') {
      setUser(null);
      setAuthenticated(false);
    }
  }, [session, status, setUser, setAuthenticated, setLoading]);
  
  // This component doesn't render anything
  return null;
} 