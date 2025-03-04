# Reso - Music Discovery Platform 💿

A modern web application for discovering, sharing, and collaborating on music playlists. Powered by Next.js, Prisma, and NextAuth.js.

**Live demo:** [https://reso-luke-labs.vercel.app](https://reso-luke-labs.vercel.app)

## Features

- 🎧 Discover new music with AI-powered recommendations
- 📝 Create and share playlists with friends
- 🔎 Search for tracks, artists, and albums
- 👥 Follow friends and see what they're listening to
- 🧠 Get personalized recommendations based on your taste
- 🌒 Dark and light mode support

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM, PostgreSQL (via Neon)
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **Deployment**: Vercel

## Project Structure

The project follows a clean `src/` directory structure:

```
reso/
├── src/                      # Main source directory
│   ├── app/                  # Next.js App Router pages
│   │   ├── api/              # API routes
│   │   ├── auth/             # Authentication pages
│   │   ├── playlists/        # Playlist-related pages
│   │   ├── profile/          # User profile pages
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   │   ├── auth/             # Authentication components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── layout/           # Layout components
│   │   ├── marketing/        # Marketing/landing page components
│   │   ├── music/            # Music-related components
│   │   ├── playlist/         # Playlist components
│   │   ├── ui/               # UI components (from shadcn/ui)
│   │   └── ...
│   ├── lib/                  # Utilities and helpers
│   │   ├── ai/               # AI-related utilities
│   │   ├── auth/             # Authentication utilities
│   │   ├── db/               # Database utilities
│   │   ├── music/            # Music service integration
│   │   ├── store/            # Zustand stores
│   │   └── ...
│   └── middleware.ts         # Next.js middleware
├── prisma/                   # Prisma schema and migrations
├── public/                   # Static assets
├── docs/                     # Documentation
└── ... (config files)
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- PostgreSQL database (local or remote)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/lnittman/reso.git
   cd reso
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in the required environment variables (see Configuration section)

4. Set up the database:
   ```
   pnpm prisma migrate dev
   ```

5. Run the development server:
   ```
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) to see the app

## Authentication Setup

This project uses NextAuth.js for authentication with OAuth providers:

### Spotify OAuth Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Create a new application
3. Add redirect URIs:
   - `http://localhost:3000/api/auth/callback/spotify` (development)
   - `https://your-production-url.com/api/auth/callback/spotify` (production)
4. Copy your Client ID and Client Secret to `.env.local`:
   ```
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   ```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to "APIs & Services" > "Credentials"
4. Create an OAuth client ID
5. Add redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-production-url.com/api/auth/callback/google` (production)
6. Copy your Client ID and Client Secret to `.env.local`:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

### NextAuth Setup

Ensure your `.env.local` includes:

```
NEXTAUTH_URL=http://localhost:3000  # Change to your production URL in production
NEXTAUTH_SECRET=your_random_secret  # Generate with `openssl rand -base64 32`
```

## Database Setup

This project uses Prisma with PostgreSQL. You can use a local PostgreSQL instance or a cloud provider like Neon:

1. Set your database URL in `.env.local`:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/reso_db"
   ```

2. Run migrations:
   ```
   pnpm prisma migrate dev
   ```

## Deployment

The easiest way to deploy is with Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Set up the required environment variables
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from various music streaming platforms
- Documentation and best practices from Next.js, Prisma, and shadcn/ui
