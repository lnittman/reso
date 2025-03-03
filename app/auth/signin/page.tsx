"use client";

import React from 'react';
import { signIn } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SpotifyLogo, GoogleLogo } from '@phosphor-icons/react';

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome to reso</CardTitle>
          <CardDescription>
            Sign in to discover music that resonates with you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full py-6 border-green-500 hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-950 justify-start space-x-4"
            onClick={() => signIn('spotify', { callbackUrl: '/' })}
          >
            {React.createElement(SpotifyLogo, { size: 24, weight: "duotone", className: "text-green-500" })}
            <span>Continue with Spotify</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full py-6 border-blue-500 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 justify-start space-x-4"
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            {React.createElement(GoogleLogo, { size: 24, weight: "duotone", className: "text-blue-500" })}
            <span>Continue with Google</span>
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
          <p>
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
          <p>
            reso is not affiliated with Spotify or Google.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 