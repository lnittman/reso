"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { ArrowRight, SpotifyLogo, GoogleLogo } from '@phosphor-icons/react';

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="animate-float mb-8">
          <span className="text-8xl md:text-9xl">💿</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">reso</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10">
          Your social-first, AI-native music discovery platform connecting people through shared musical interests
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Button 
            size="lg" 
            className="gap-2 px-8 font-medium"
            onClick={() => signIn('spotify', { callbackUrl: '/' })}
          >
            <SpotifyLogo size={24} weight="fill" />
            Sign in with Spotify
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="gap-2 px-8"
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            <GoogleLogo size={24} weight="fill" />
            Sign in with Google
          </Button>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Discover. Connect. Create.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Recommendations</h3>
              <p className="text-muted-foreground">Get personalized music suggestions based on your taste, mood, and listening habits.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Social Connections</h3>
              <p className="text-muted-foreground">Connect with friends and discover new music through shared interests and collaborative playlists.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold mb-2">Collaborative Playlists</h3>
              <p className="text-muted-foreground">Create and contribute to playlists with friends, with AI assistance to suggest tracks.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to discover new music?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join reso today and connect with people who share your musical tastes.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => signIn(undefined, { callbackUrl: '/' })}
            className="gap-2"
          >
            Get Started <ArrowRight weight="bold" />
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="text-2xl">💿</span>
            <span className="font-bold">reso</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} reso. All rights reserved.
          </div>
        </div>
      </footer>
      
      {/* Add floating animation */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 