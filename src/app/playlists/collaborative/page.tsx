"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Users, Plus, Share } from "@phosphor-icons/react";
import { toast } from "sonner";

// Mock collaborative playlists
const collaborativePlaylists = [
  {
    id: "1",
    title: "Road Trip Mix",
    description: "Building the ultimate road trip playlist. Looking for upbeat tracks!",
    coverImage: "https://place-hold.it/300x300/333/fff&text=Road+Trip",
    creator: {
      name: "Alex Chen",
      avatar: "https://place-hold.it/40x40/333/fff&text=AC"
    },
    contributors: [
      { name: "Maya Johnson", avatar: "https://place-hold.it/40x40/333/fff&text=MJ" },
      { name: "Jordan Smith", avatar: "https://place-hold.it/40x40/333/fff&text=JS" },
      { name: "Taylor Kim", avatar: "https://place-hold.it/40x40/333/fff&text=TK" }
    ],
    trackCount: 24,
    lastUpdated: "2 hours ago"
  },
  {
    id: "2",
    title: "Study Session",
    description: "Focusing music for productive study sessions",
    coverImage: "https://place-hold.it/300x300/333/fff&text=Study",
    creator: {
      name: "You",
      avatar: "https://place-hold.it/40x40/333/fff&text=You"
    },
    contributors: [],
    trackCount: 12,
    lastUpdated: "Yesterday"
  },
  {
    id: "3",
    title: "Indie Discoveries",
    description: "A collaborative collection of fresh indie finds",
    coverImage: "https://place-hold.it/300x300/333/fff&text=Indie",
    creator: {
      name: "Jordan Smith",
      avatar: "https://place-hold.it/40x40/333/fff&text=JS"
    },
    contributors: [
      { name: "You", avatar: "https://place-hold.it/40x40/333/fff&text=You" },
      { name: "Taylor Kim", avatar: "https://place-hold.it/40x40/333/fff&text=TK" }
    ],
    trackCount: 37,
    lastUpdated: "3 days ago"
  }
];

export default function CollaborativePlaylistsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredPlaylists = collaborativePlaylists.filter(playlist => 
    playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleJoinPlaylist = (id: string) => {
    toast.success("Joined collaborative playlist!");
    // In a real implementation, this would connect the user to the playlist
  };
  
  const handleCreatePlaylist = () => {
    toast.success("Creating new collaborative playlist...");
    // In a real implementation, this would navigate to a playlist creation form
  };
  
  const handleSharePlaylist = (id: string) => {
    toast.success("Playlist share link copied to clipboard!");
    // In a real implementation, this would copy a share link to clipboard
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Collaborative Playlists</h1>
          <p className="text-muted-foreground">
            Create and contribute to playlists with friends
          </p>
        </div>
        <Button onClick={handleCreatePlaylist} className="shrink-0">
          {React.createElement(Plus, { size: 16, className: "mr-2" })}
          New Playlist
        </Button>
      </div>
      
      <div className="relative">
        <Input
          placeholder="Search collaborative playlists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaylists.map(playlist => (
          <Card key={playlist.id} className="overflow-hidden flex flex-col">
            <div className="aspect-square w-full relative">
              <img 
                src={playlist.coverImage} 
                alt={playlist.title}
                className="h-full w-full object-cover"
              />
            </div>
            
            <CardHeader>
              <CardTitle>{playlist.title}</CardTitle>
              <CardDescription>Created by {playlist.creator.name}</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1">
              <p className="text-sm">{playlist.description}</p>
              
              <div className="mt-6">
                <div className="text-sm text-muted-foreground mb-2">
                  {playlist.trackCount} tracks • Last updated {playlist.lastUpdated}
                </div>
                
                <div className="flex items-center gap-1">
                  {playlist.contributors.length > 0 ? (
                    <>
                      <div className="flex -space-x-2">
                        {playlist.contributors.map((contributor, index) => (
                          <Avatar key={index} className="border-2 border-background h-6 w-6">
                            <AvatarImage src={contributor.avatar} alt={contributor.name} />
                            <AvatarFallback>{contributor.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground ml-1">
                        {playlist.contributors.length} contributor{playlist.contributors.length !== 1 ? 's' : ''}
                      </span>
                    </>
                  ) : (
                    <div className="flex items-center gap-1">
                      {React.createElement(Users, { size: 14, className: "text-muted-foreground" })}
                      <span className="text-xs text-muted-foreground">No contributors yet</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex gap-2">
              {playlist.creator.name === "You" || playlist.contributors.some(c => c.name === "You") ? (
                <Button variant="default" className="flex-1">
                  Continue Editing
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  className="flex-1"
                  onClick={() => handleJoinPlaylist(playlist.id)}
                >
                  Join Collaboration
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleSharePlaylist(playlist.id)}
              >
                {React.createElement(Share, { size: 16 })}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 