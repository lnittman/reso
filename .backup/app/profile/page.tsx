"use client";

import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PencilSimple, PlayCircle, Heart, UsersThree, Playlist } from '@phosphor-icons/react';
import { useProfileStore } from '@/lib/store';

export default function ProfilePage() {
  // Use the Zustand store instead of local state or context
  const { 
    profile, 
    favoriteTracks, 
    playlists, 
    activeTab, 
    setActiveTab 
  } = useProfileStore();
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === 'favorites' || value === 'playlists' || value === 'stats') {
      setActiveTab(value);
    }
  };
  
  // If profile is not loaded, show loading state
  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>{profile.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-muted-foreground">@{profile.username}</p>
              </div>
              <p>{profile.bio}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="text-center">
                  <p className="font-semibold">{profile.stats.followers}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{profile.stats.following}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{profile.stats.tracks}</p>
                  <p className="text-sm text-muted-foreground">Tracks</p>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              {React.createElement(PencilSimple, { className: "h-4 w-4", weight: "duotone" })}
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Content */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="favorites" className="space-y-6">
          <h2 className="text-xl font-semibold">Top Tracks</h2>
          <div className="space-y-2">
            {favoriteTracks.map((track, index) => (
              <Card key={track.id} className="overflow-hidden">
                <div className="flex items-center gap-4 p-3">
                  <div className="font-medium text-muted-foreground w-6 text-center">
                    {index + 1}
                  </div>
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <img 
                      src={track.coverImage} 
                      alt={track.title} 
                      className="object-cover h-full w-full rounded-md"
                    />
                    <button className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md">
                      {React.createElement(PlayCircle, { className: "h-6 w-6 text-white", weight: "duotone" })}
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{track.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground">
                      {track.playCount} plays
                    </div>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      {React.createElement(Heart, { className: "h-4 w-4", weight: "duotone" })}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="playlists" className="space-y-6">
          <h2 className="text-xl font-semibold">My Playlists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <Card key={playlist.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square relative">
                  <img 
                    src={playlist.coverImage} 
                    alt={playlist.name}
                    className="object-cover h-full w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <div>
                      <h3 className="font-semibold text-white">{playlist.name}</h3>
                      <p className="text-xs text-white/80">{playlist.trackCount} tracks</p>
                    </div>
                  </div>
                  <button className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                    {React.createElement(PlayCircle, { className: "h-6 w-6", weight: "duotone" })}
                  </button>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{playlist.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Genres</CardTitle>
                <CardDescription>Your most listened to music categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.stats.favGenres.map((genre, index) => (
                    <div key={genre} className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                        <span className="font-medium">{index + 1}</span>
                      </div>
                      <div className="font-medium">{genre}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Music Connections</CardTitle>
                <CardDescription>People with similar music taste</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-primary/10 p-6 rounded-full flex items-center justify-center">
                    {React.createElement(UsersThree, { className: "h-12 w-12 text-primary", weight: "duotone" })}
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p>You have 15 close music connections</p>
                  <Button variant="outline" size="sm" className="gap-2">
                    {React.createElement(UsersThree, { className: "h-4 w-4", weight: "duotone" })}
                    View Connections
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Listening Overview</CardTitle>
                <CardDescription>Your music activity over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center space-y-2 text-muted-foreground">
                  <p>Listening statistics visualization will appear here</p>
                  <p className="text-sm">Coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 