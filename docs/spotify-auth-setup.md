# Setting Up Spotify OAuth for Reso

This guide will walk you through the process of setting up Spotify OAuth credentials for your Reso application.

## Prerequisites

- A Spotify account (free or premium)
- A Reso application (running locally or deployed)

## Step 1: Create a Spotify Developer Account

1. Visit the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Log in with your Spotify account
3. Accept the terms of service if prompted

## Step 2: Create a New Application

1. Click on the "Create an App" button
2. Fill in the required information:
   - **App name**: Reso Music (or any name you prefer)
   - **App description**: A music discovery platform for finding and sharing music
   - **Website**: Your application URL (e.g., `http://localhost:3000` for development)
   - **Redirect URI**: This is crucial for OAuth to work correctly
3. Click "Create"

## Step 3: Add Redirect URIs

1. Once your app is created, click on "Edit Settings"
2. Under "Redirect URIs", add the following:
   - For local development: `http://localhost:3000/api/auth/callback/spotify`
   - For production: `https://your-production-domain.com/api/auth/callback/spotify`
3. Click "Save"

## Step 4: Get Your Credentials

On your app's dashboard, you'll see:

- **Client ID**: A public identifier for your app
- **Client Secret**: A private key (keep this secure!)

Copy both of these values. You'll need them for your `.env.local` file.

## Step 5: Configure Reso

Add the following to your `.env.local` file:

```
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

## Step 6: Using Spotify API Scopes

Reso uses the following Spotify scopes:

- `user-read-email`: To get the user's email address
- `user-read-private`: To get the user's country and account details
- `user-top-read`: To access the user's top tracks and artists
- `user-read-recently-played`: To get the user's recently played tracks
- `playlist-read-private`: To access the user's private playlists
- `playlist-read-collaborative`: To access the user's collaborative playlists

These scopes are already configured in the Reso authentication setup.

## Troubleshooting

### Invalid Redirect URI Error

If you receive an "Invalid Redirect URI" error when trying to sign in:

1. Double-check that the exact URI is added to your Spotify app settings
2. Ensure there are no trailing slashes or typos
3. Verify that your `NEXTAUTH_URL` is set correctly in `.env.local`

### Rate Limiting

Spotify has API rate limits. If you encounter rate limiting issues:

1. Implement proper caching strategies
2. Consider upgrading to a premium Spotify account
3. Add delays between consecutive API calls

## Next Steps

Once you have Spotify authentication working, you can:

1. Access the user's profile information
2. Fetch their playlists and favorite tracks
3. Get recommendations based on their music taste
4. Search for tracks, artists, and albums

For more information, refer to the [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api/). 