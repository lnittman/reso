"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { ArrowRight, SpotifyLogo, GoogleLogo, Robot, Waveform, ChatCircle, MagicWand, Users, PlayCircle } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 md:py-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="text-primary">Sonic alchemy</span> for the digital age
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-8">
          Whisper your desires to our AI. Watch as it weaves the perfect sonic tapestry, connecting souls through shared musical dimensions.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
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
      
      {/* Features Section - Creative Layout */}
      <section className="py-20 bg-gradient-to-b from-muted/20 to-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            The future of music discovery is <span className="text-primary">conversational</span>
          </h2>
          
          <div className="relative">
            {/* Creative zigzag layout with alternating alignment */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/10 hidden md:block"></div>
            
            {/* Feature 1 */}
            <div className="md:grid md:grid-cols-2 gap-8 mb-16 md:mb-24 items-center">
              <div className="p-6 md:p-8 order-2">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-6">
                  {React.createElement(ChatCircle, { size: 32, weight: "duotone", className: "text-primary" })}
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold mb-4">Conversational Playlist Creation</h3>
                <p className="text-lg text-muted-foreground">
                  Craft the perfect playlist through natural conversation. Describe a feeling, scene, or memory — our AI understands context, emotion, and musical connections that traditional algorithms miss.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/20 p-8 rounded-xl flex flex-col items-center shadow-md mt-6 md:mt-0 mx-auto md:mx-0 max-w-md">
                <div className="flex flex-col space-y-4 w-full">
                  <div className="bg-background p-4 rounded-lg w-full">
                    <p className="text-sm mb-2">"Create a playlist for a late night coding session with atmospheric electronic music that helps focus"</p>
                    <div className="h-2 w-1/2 animate-pulse bg-primary/20 rounded-full"></div>
                  </div>
                  <div className="bg-background/60 p-4 rounded-lg w-full ml-auto">
                    <p className="text-sm mb-2 font-semibold">Crafting "Deep Focus" playlist with 14 tracks...</p>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      <div className="aspect-square rounded-md overflow-hidden">
                        <img src="https://i.scdn.co/image/ab67616d00001e02f761398c28c1a48e5beeec01" alt="Album cover" className="w-full h-full object-cover" />
                      </div>
                      <div className="aspect-square rounded-md overflow-hidden">
                        <img src="https://i.scdn.co/image/ab67616d00001e02802686d91a1f88039d6e5b87" alt="Album cover" className="w-full h-full object-cover" />
                      </div>
                      <div className="aspect-square rounded-md overflow-hidden">
                        <img src="https://i.scdn.co/image/ab67616d00001e02e8b066f70c206551210d902b" alt="Album cover" className="w-full h-full object-cover" />
                      </div>
                      <div className="aspect-square rounded-md overflow-hidden">
                        <img src="https://i.scdn.co/image/ab67616d00001e02d5a587c7de8efc3c5db2b76f" alt="Album cover" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="md:grid md:grid-cols-2 gap-8 mb-16 md:mb-24 items-center">
              <div className="bg-gradient-to-tr from-blue-500/10 to-purple-500/20 p-8 rounded-xl shadow-md mt-6 md:mt-0">
                <div className="relative">
                  {/* Collaborative session visualization */}
                  <div className="bg-background/80 p-4 rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img src="https://i.pravatar.cc/150?img=1" alt="User avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-sm font-medium">Alex added "Midnight City" by M83</div>
                    </div>
                    <div className="flex items-center gap-2 mb-3 ml-6">
                      <div className="w-12 h-12 rounded-md overflow-hidden">
                        <img src="https://i.scdn.co/image/ab67616d00001e02562a8f9f6eb1808e2d4e5eeb" alt="Album cover" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Midnight City</div>
                        <div className="text-xs text-muted-foreground">M83 • Hurry Up, We're Dreaming</div>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs">+3</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-background/80 p-4 rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img src="https://i.pravatar.cc/150?img=2" alt="User avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-sm font-medium">Maya suggested "Innerbloom" by RÜFÜS DU SOL</div>
                    </div>
                    <div className="flex items-center gap-2 ml-6">
                      <div className="w-12 h-12 rounded-md overflow-hidden">
                        <img src="https://i.scdn.co/image/ab67616d00001e02ec3c8ed46388f0055e3e765d" alt="Album cover" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Innerbloom</div>
                        <div className="text-xs text-muted-foreground">RÜFÜS DU SOL • Bloom</div>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs">+2</div>
                        <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-xs">-1</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-xl"></div>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-6">
                  {React.createElement(Users, { size: 32, weight: "duotone", className: "text-primary" })}
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold mb-4">Collaborative Music Spaces</h3>
                <p className="text-lg text-muted-foreground">
                  Create shared music spaces where friends can collaborate in real-time. Vote on tracks, suggest additions, and let AI harmonize everyone's taste into perfectly balanced playlists.
                </p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="md:grid md:grid-cols-2 gap-8 items-center">
              <div className="p-6 md:p-8 order-2">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-6">
                  {React.createElement(MagicWand, { size: 32, weight: "duotone", className: "text-primary" })}
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold mb-4">AI-Enhanced Music Discovery</h3>
                <p className="text-lg text-muted-foreground">
                  Discover music that resonates with you on a deeper level. Our AI understands the emotional qualities of music, introducing you to tracks you'll love with personalized explanations of why they match your unique taste.
                </p>
              </div>
              <div className="bg-gradient-to-bl from-pink-500/10 to-orange-500/20 p-8 rounded-xl shadow-md mt-6 md:mt-0 mx-auto md:mx-0 max-w-md">
                <div className="flex flex-col space-y-4">
                  <div className="bg-background/60 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden">
                        <img src="https://i.scdn.co/image/ab67616d00001e02b0db36f4f93ebe129dda44a6" alt="Album cover" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Midnight Echoes</p>
                        <p className="text-xs text-muted-foreground">Ethereal Dynamics</p>
                      </div>
                      {React.createElement(PlayCircle, { size: 20, className: "ml-auto" })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recommended because it shares the atmospheric textures you love from Boards of Canada, with the rhythmic patterns that appear in your most played tracks.
                    </p>
                  </div>
                  <div className="bg-background/60 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden">
                        <img src="https://i.scdn.co/image/ab67616d00001e02f46b9d202509a8f7384b90de" alt="Album cover" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Dreamstate</p>
                        <p className="text-xs text-muted-foreground">Tycho</p>
                      </div>
                      {React.createElement(PlayCircle, { size: 20, className: "ml-auto" })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      The layered synths and melodic progression match your affinity for immersive soundscapes that evolve gradually.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-muted/40 to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Start your musical journey today</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join a community of music enthusiasts who are redefining how we discover, share, and experience music together.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => signIn(undefined, { callbackUrl: '/' })}
            className="gap-2 px-8 py-6 text-lg"
          >
            Begin Your Experience <ArrowRight weight="bold" className="ml-2" />
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="font-bold text-xl">reso</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} reso. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 