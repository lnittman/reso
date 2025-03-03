"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";

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
    // Update auth store based on NextAuth session
    if (status === 'loading') {
      setLoading(true);
    } else {
      setLoading(false);
      setAuthenticated(status === 'authenticated');
      
      if (session?.user) {
        setUser({
          id: session.user.id || session.user.email || 'unknown',
          name: session.user.name || undefined,
          email: session.user.email || undefined,
          image: session.user.image || undefined
        });
      } else {
        setUser(null);
      }
    }
  }, [session, status, setUser, setAuthenticated, setLoading]);
  
  // This component doesn't render anything
  return null;
} 