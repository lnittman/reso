# reso Deployment Guide

## Overview

This document provides instructions for deploying the reso application to Vercel with external services for database, storage, and caching.

## Required Services

1. **Vercel** - Hosting platform for the Next.js application
2. **Neon** - PostgreSQL database for storing application data
3. **Upstash KV** - Key-value store for caching and session management
4. **Upstash Redis** - For rate limiting and real-time features
5. **Vercel Blob** - For storing user-uploaded images

## Step 1: Set Up Neon Database

1. Create an account at [Neon](https://neon.tech/)
2. Create a new project
3. Create a new database named `reso_db`
4. Get the connection string from the dashboard
5. Set it as the `DATABASE_URL` environment variable in Vercel

## Step 2: Set Up Upstash Services

### Upstash KV
1. Create an account at [Upstash](https://upstash.com/)
2. Create a new KV database
3. Get the REST API credentials
4. Set the following environment variables in Vercel:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

### Upstash Redis
1. Create a new Redis database in Upstash
2. Get the Redis connection string
3. Set it as the `UPSTASH_REDIS_REST_URL` environment variable in Vercel

## Step 3: Set Up Vercel Blob Storage

1. Enable Vercel Blob storage in your Vercel project settings
2. Set the `BLOB_READ_WRITE_TOKEN` environment variable in Vercel

## Step 4: Set Up OAuth Providers

### Spotify API
1. Create a Spotify Developer account at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Create a new application
3. Set the redirect URI to `https://your-vercel-domain.vercel.app/api/auth/callback/spotify`
4. Get the Client ID and Client Secret
5. Set them as environment variables in Vercel:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`

### Google API
1. Create a Google Cloud project at [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Google OAuth2 API
3. Create OAuth credentials
4. Set the redirect URI to `https://your-vercel-domain.vercel.app/api/auth/callback/google`
5. Get the Client ID and Client Secret
6. Set them as environment variables in Vercel:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

## Step 5: Set Up NextAuth.js

1. Generate a secure random string for the NextAuth secret
   ```bash
   openssl rand -base64 32
   ```
2. Set the following environment variables in Vercel:
   - `NEXTAUTH_URL` (set to your Vercel deployment URL)
   - `NEXTAUTH_SECRET` (set to the generated secure string)

## Step 6: Deploy to Vercel

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure the build settings:
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`
4. Add all environment variables from the previous steps
5. Deploy the application

## Step 7: Run Initial Database Migrations

1. After deployment, run the Prisma migration using Vercel CLI or via the Vercel dashboard:
   ```bash
   npx prisma migrate deploy
   ```

## Additional Configuration

### Custom Domain
1. In your Vercel project settings, go to "Domains"
2. Add your custom domain and follow the instructions to configure DNS

### Analytics
1. Enable Vercel Analytics in your project settings
2. Optionally, integrate with other analytics platforms like Google Analytics

## Monitoring and Maintenance

- Set up Vercel monitoring to receive alerts for deployment failures
- Configure logging to track errors and performance issues
- Regularly check for database and dependency updates

## Legal Considerations

When deploying a music discovery platform, ensure compliance with:

1. **Terms of Service** for music streaming APIs:
   - Spotify API Usage Terms
   - Apple Music API Terms
   - Other integrated services

2. **Privacy Regulations**:
   - GDPR for European users
   - CCPA for California users
   - Other applicable privacy laws

3. **Copyright Considerations**:
   - Ensure you're not hosting copyrighted content directly
   - Use only official APIs for playback and integration

## Conclusion

This deployment configuration creates a scalable, production-ready setup for the reso application. The combination of Vercel for hosting, Neon for database, and Upstash for caching provides a reliable infrastructure that can scale with your user base. 