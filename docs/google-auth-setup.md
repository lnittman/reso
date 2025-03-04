# Setting Up Google OAuth for Reso

This guide will walk you through the process of setting up Google OAuth credentials for your Reso application.

## Prerequisites

- A Google account
- A Reso application (running locally or deployed)

## Step 1: Go to Google Cloud Console

1. Visit the [Google Cloud Console](https://console.cloud.google.com/)
2. Log in with your Google account
3. Create a new project or select an existing one

## Step 2: Configure OAuth Consent Screen

1. In the left sidebar, navigate to "APIs & Services" > "OAuth consent screen"
2. Select the user type (External or Internal)
   - For testing, "External" is fine
   - For production with limited users, "Internal" might be more appropriate
3. Click "Create"
4. Fill in the required information:
   - **App name**: Reso Music (or any name you prefer)
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
5. Click "Save and Continue"
6. Add scopes:
   - `userinfo.email`
   - `userinfo.profile`
   - `openid`
7. Click "Save and Continue"
8. Add test users if you selected "External" (you can add your own email)
9. Click "Save and Continue"
10. Review your settings and click "Back to Dashboard"

## Step 3: Create OAuth Credentials

1. In the left sidebar, navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Name your OAuth client
5. Add authorized JavaScript origins:
   - For local development: `http://localhost:3000`
   - For production: `https://your-production-domain.com`
6. Add authorized redirect URIs:
   - For local development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://your-production-domain.com/api/auth/callback/google`
7. Click "Create"

## Step 4: Get Your Credentials

After creating the OAuth client ID, you'll see a modal with your credentials:

- **Client ID**: A public identifier for your app
- **Client Secret**: A private key (keep this secure!)

Copy both of these values. You'll need them for your `.env.local` file.

## Step 5: Configure Reso

Add the following to your `.env.local` file:

```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

## Step 6: Enable the People API

Google OAuth for basic profile information requires the People API:

1. In the left sidebar, navigate to "APIs & Services" > "Library"
2. Search for "People API"
3. Click on the People API and click "Enable"

## Troubleshooting

### Redirect URI Mismatch

If you receive a "redirect_uri_mismatch" error:

1. Double-check that the exact URI is added to your Google Cloud Console
2. Ensure there are no trailing slashes or typos
3. Verify that your `NEXTAUTH_URL` is set correctly in `.env.local`

### API Not Enabled

If you receive an error about the API not being enabled:

1. Go to the Google Cloud Console
2. Navigate to "APIs & Services" > "Library"
3. Search for the required API (usually "People API")
4. Enable it

### Consent Screen Not Configured

If the OAuth consent screen is not showing up:

1. Make sure you completed all steps in the OAuth consent screen setup
2. Verify you added the necessary scopes
3. If using "External" user type, ensure your test users are added

## Next Steps

Once you have Google authentication working, you can:

1. Access the user's basic profile information
2. Implement account linking with Spotify
3. Create a personalized experience based on the user's Google account

For more information, refer to the [Google Identity Developer Documentation](https://developers.google.com/identity/protocols/oauth2). 