"use client";

import React, { useState } from 'react';
import { DailyRecommendations } from '@/components/music/DailyRecommendations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Robot, Users, Plus, MusicNotes, Shuffle, CaretDown, CaretUp } from "@phosphor-icons/react";
import { toast } from "sonner";

// Mock data for friend activity
const friendActivity = [
  {
    id: "1",
    user: {
      name: "Alex Chen",
      avatar: "https://place-hold.it/40x40/333/fff&text=AC",
    },
    action: "created a playlist",
    content: "Workout Beats 2023",
    timestamp: "2 hours ago"
  },
  {
    id: "2",
    user: {
      name: "Maya Johnson",
      avatar: "https://place-hold.it/40x40/333/fff&text=MJ",
    },
    action: "shared a track",
    content: "AURORA - Runaway",
    timestamp: "5 hours ago"
  },
  {
    id: "3",
    user: {
      name: "Jordan Smith",
      avatar: "https://place-hold.it/40x40/333/fff&text=JS",
    },
    action: "likes your playlist",
    content: "Indie Discoveries",
    timestamp: "Yesterday"
  }
];

// Mock collaborative opportunities
const collaborativeOpportunities = [
  {
    id: "1",
    title: "Road Trip Mix",
    creator: "Alex Chen",
    description: "Building the ultimate road trip playlist. Looking for upbeat tracks!",
    contributors: 3,
    tracks: 24
  },
  {
    id: "2",
    title: "Study Session",
    creator: "You",
    description: "Focusing music for productive study sessions",
    contributors: 1,
    tracks: 12
  }
];

// Mock AI playlist ideas
const aiPlaylistIdeas = [
  {
    id: "1",
    title: "90s Nostalgia with Modern Twists",
    description: "Classic 90s hits paired with modern songs that share similar vibes",
    mood: "Nostalgic",
    genres: ["Pop", "Rock", "Hip-Hop"]
  },
  {
    id: "2",
    title: "Acoustic Covers of Electronic Hits",
    description: "Stripped-down versions of your favorite electronic tracks",
    mood: "Chill",
    genres: ["Acoustic", "Electronic", "Cover"]
  },
  {
    id: "3",
    title: "Genre-Blending Workout Mix",
    description: "High-energy tracks that cross genre boundaries to keep your workout fresh",
    mood: "Energetic",
    genres: ["EDM", "Hip-Hop", "Rock"]
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("for-you");
  const [isCollaborativeCollapsed, setIsCollaborativeCollapsed] = useState(false);
  
  const handleGeneratePlaylist = () => {
    toast.success("Opening AI playlist generator...");
    // In a real implementation, this would navigate to the playlist generator
  };
  
  const handleJoinCollaboration = (id: string) => {
    toast.success("Joined collaborative playlist!");
    // In a real implementation, this would connect the user to the collaborative playlist
  };
  
  const handleCreateCollaboration = () => {
    toast.success("Creating new collaborative playlist...");
    // In a real implementation, this would open a dialog to create a collaborative playlist
  };

  const toggleCollaborativeSection = () => {
    setIsCollaborativeCollapsed(!isCollaborativeCollapsed);
  };

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome to reso</h1>
        <p className="text-muted-foreground">
          Your social-first, AI-native music discovery platform
        </p>
      </section>
      
      {/* Collaborative Opportunities Section - Always visible at the top */}
      <section className="space-y-4 border rounded-lg p-4 bg-background/50">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Collaborative Playlists</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCreateCollaboration}>
              {React.createElement(Plus, { size: 16, weight: "duotone" })} New
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleCollaborativeSection}
              aria-label={isCollaborativeCollapsed ? "Expand" : "Collapse"}
            >
              {React.createElement(isCollaborativeCollapsed ? CaretDown : CaretUp, { size: 16, weight: "duotone" })}
            </Button>
          </div>
        </div>
        
        {!isCollaborativeCollapsed && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collaborativeOpportunities.map(opportunity => (
              <Card key={opportunity.id}>
                <CardHeader>
                  <CardTitle>{opportunity.title}</CardTitle>
                  <CardDescription>Created by {opportunity.creator}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{opportunity.description}</p>
                  <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                    <span>{opportunity.contributors} contributors</span>
                    <span>{opportunity.tracks} tracks</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="default" className="w-full" onClick={() => handleJoinCollaboration(opportunity.id)}>
                    {opportunity.creator === "You" ? "Continue Building" : "Join Collaboration"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
      
      <Tabs defaultValue="for-you" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="for-you" className="flex items-center gap-2">
            {React.createElement(Robot, { size: 16, weight: "duotone" })} For You
          </TabsTrigger>
          <TabsTrigger value="friends" className="flex items-center gap-2">
            {React.createElement(Users, { size: 16, weight: "duotone" })} Friends
          </TabsTrigger>
          <TabsTrigger value="discover" className="flex items-center gap-2">
            {React.createElement(Shuffle, { size: 16, weight: "duotone" })} Discover
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="for-you" className="mt-6 space-y-8">
          {/* Daily AI Recommendations */}
          <DailyRecommendations />
        </TabsContent>
        
        <TabsContent value="friends" className="mt-6 space-y-6">
          {/* Friend Activity Feed */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Friend Activity</h2>
            <div className="space-y-4">
              {friendActivity.map(activity => (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                        <AvatarFallback>{activity.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p><span className="font-medium">{activity.user.name}</span> {activity.action}</p>
                        <p className="text-sm font-medium">{activity.content}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Respond
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="discover" className="mt-6 space-y-8">
          {/* AI Playlist Generator */}
          <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {React.createElement(Robot, { size: 20, weight: "duotone" })}
                AI Playlist Generator
              </CardTitle>
              <CardDescription>
                Let AI create the perfect playlist based on your mood, favorite genres, or a specific theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input placeholder="Describe your perfect playlist..." className="flex-1" />
                <Button onClick={handleGeneratePlaylist}>Generate</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* AI Playlist Ideas */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Playlist Ideas for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiPlaylistIdeas.map(idea => (
                <Card key={idea.id} className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{idea.title}</CardTitle>
                    <CardDescription>{idea.mood}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{idea.description}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {idea.genres.map(genre => (
                        <span key={genre} className="text-xs bg-secondary px-2 py-1 rounded-full">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="default" className="w-full" onClick={handleGeneratePlaylist}>
                      {React.createElement(MusicNotes, { size: 16, weight: "duotone" })} Create Playlist
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
} 