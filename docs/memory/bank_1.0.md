# reso Memory Bank - v1.0

## Project Overview

reso is a social-first, AI-native music discovery platform that connects users through shared musical interests and personalized recommendations. The application leverages AI algorithms to analyze listening patterns and suggest music that bridges users' preferences, expanding their musical horizons. It creates a dedicated space for musical connection between users, serving as both a discovery tool and a social platform for music enthusiasts.

## Core Features

1. **Daily AI-Curated Recommendations** - Personalized music suggestions with AI-generated explanations based on listening history
2. **Social Music Profiles** - User profiles showcasing music taste, favorite genres, and listening statistics
3. **Music Sharing & Reactions** - Dedicated music messaging channel for sending songs with context or reactions
4. **Collaborative Playlists** - AI-assisted shared playlists that fit the vibe and appeal to all contributors

## Technical Architecture

reso is built as a Next.js application with the following architecture components:

- **Frontend**: Next.js with React for UI components and client-side rendering
- **Backend**: Next.js API routes for server-side functionality
- **Database**: Prisma ORM with a relational database for data storage
- **API Integration**: RESTful and GraphQL APIs for music streaming service integration
- **State Management**: React Query for data fetching, caching, and state management

## Technology Stack

The project utilizes the following technologies:

- **Next.js**: Core framework for both frontend and backend
- **React**: UI component library
- **TailwindCSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for smooth UI transitions
- **shadcn/ui**: Reusable UI component system
- **React Query**: Data fetching and state management
- **RESTful APIs & GraphQL**: API integration strategies
- **TypeScript**: Type-safe programming language
- **ESLint**: Code quality and style enforcement
- **Prisma**: ORM for database operations

## Implementation Strategy

### Phase 1: Project Setup

1. **Initialize Next.js Project**
   ```bash
   npx create-next-app@latest reso --typescript --tailwind --eslint
   cd reso
   ```

2. **Install Dependencies**
   ```bash
   npm install @tanstack/react-query framer-motion @prisma/client
   npm install -D prisma
   ```

3. **Set Up Prisma**
   ```bash
   npx prisma init
   ```

4. **Configure shadcn/ui**
   ```bash
   npx shadcn-ui@latest init
   ```

### Phase 2: Database Schema Design

Create a Prisma schema that includes the following models:

```prisma
// schema.prisma
model User {
  id             String           @id @default(cuid())
  name           String
  email          String           @unique
  image          String?
  profiles       MusicProfile[]
  playlists      Playlist[]
  recommendations Recommendation[]
  sharedSongs    SharedSong[]
  receivedSongs  SharedSong[]     @relation("ReceivedSongs")
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
}

model MusicProfile {
  id             String           @id @default(cuid())
  user           User             @relation(fields: [userId], references: [id])
  userId         String
  favoriteGenres String[]
  listeningStats Json?
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
}

model Playlist {
  id             String           @id @default(cuid())
  name           String
  description    String?
  creator        User             @relation(fields: [creatorId], references: [id])
  creatorId      String
  collaborators  PlaylistCollaborator[]
  songs          PlaylistSong[]
  isPublic       Boolean          @default(false)
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
}

model PlaylistCollaborator {
  id             String           @id @default(cuid())
  playlist       Playlist         @relation(fields: [playlistId], references: [id])
  playlistId     String
  user           User             @relation(fields: [userId], references: [id])
  userId         String
  addedAt        DateTime         @default(now())

  @@unique([playlistId, userId])
}

model Song {
  id             String           @id @default(cuid())
  title          String
  artist         String
  album          String?
  coverImage     String?
  duration       Int?
  externalId     String?          // ID from external music service
  externalUrl    String?          // URL to the song on external service
  playlists      PlaylistSong[]
  recommendations Recommendation[]
  sharedInstances SharedSong[]
  createdAt      DateTime         @default(now())
}

model PlaylistSong {
  id             String           @id @default(cuid())
  playlist       Playlist         @relation(fields: [playlistId], references: [id])
  playlistId     String
  song           Song             @relation(fields: [songId], references: [id])
  songId         String
  addedBy        User             @relation(fields: [addedById], references: [id])
  addedById      String
  addedAt        DateTime         @default(now())
  order          Int

  @@unique([playlistId, songId])
}

model Recommendation {
  id             String           @id @default(cuid())
  user           User             @relation(fields: [userId], references: [id])
  userId         String
  song           Song             @relation(fields: [songId], references: [id])
  songId         String
  explanation    String?
  isLiked        Boolean?
  createdAt      DateTime         @default(now())
}

model SharedSong {
  id             String           @id @default(cuid())
  song           Song             @relation(fields: [songId], references: [id])
  songId         String
  sender         User             @relation(fields: [senderId], references: [id])
  senderId       String
  recipient      User             @relation("ReceivedSongs", fields: [recipientId], references: [id])
  recipientId    String
  message        String?
  reaction       String?
  isRead         Boolean          @default(false)
  createdAt      DateTime         @default(now())
}
```

### Phase 3: API Routes Implementation

Create the following API routes for core functionality:

1. **Authentication**
   - `/api/auth/[...nextauth].js` - NextAuth.js setup for authentication

2. **User Management**
   - `/api/users` - User creation and listing
   - `/api/users/[id]` - User profile retrieval and updates
   - `/api/users/[id]/profile` - Music profile management

3. **Recommendations**
   - `/api/recommendations` - Get daily recommendations
   - `/api/recommendations/[id]/feedback` - Submit feedback on recommendations

4. **Playlists**
   - `/api/playlists` - Create and list playlists
   - `/api/playlists/[id]` - Manage specific playlist
   - `/api/playlists/[id]/collaborators` - Manage playlist collaborators
   - `/api/playlists/[id]/songs` - Add/remove songs from playlist

5. **Sharing**
   - `/api/share` - Share a song with another user
   - `/api/share/[id]/reaction` - React to a shared song

6. **Music Service Integration**
   - `/api/music/search` - Search for songs across connected services
   - `/api/music/services/connect` - Connect to external music services

### Phase 4: Frontend Implementation

Implement the following key pages and components:

1. **Layout Components**
   - `components/layout/MainLayout.tsx` - Main application layout
   - `components/layout/Sidebar.tsx` - Navigation sidebar
   - `components/layout/Player.tsx` - Music player component

2. **Pages**
   - `app/page.tsx` - Homepage with daily recommendations
   - `app/discover/page.tsx` - Discovery page
   - `app/profile/page.tsx` - User profile page
   - `app/playlists/page.tsx` - Playlists overview
   - `app/playlists/[id]/page.tsx` - Individual playlist page
   - `app/messages/page.tsx` - Shared songs inbox

3. **Feature Components**
   - `components/recommendations/RecommendationCard.tsx` - Display recommendation with explanation
   - `components/playlists/PlaylistCreator.tsx` - Create new playlists
   - `components/sharing/ShareSongModal.tsx` - Modal for sharing songs

### Phase 5: AI Integration

Implement AI recommendation algorithms:

1. **Data Collection**
   - Track user listening patterns
   - Store song metadata and features

2. **Recommendation Engine**
   - Collaborative filtering for similar user recommendations
   - Content-based filtering using song features
   - Hybrid approach combining both methods

3. **Explanation Generation**
   - Natural language generation for recommendation explanations
   - Contextual reasoning based on user history and preferences

## Project Structure

The project follows the Next.js App Router convention with a focus on modularity:

```
reso/
├── app/                      # App Router pages and layouts
│   ├── (auth)/               # Authentication routes
│   ├── (dashboard)/          # Main application routes
│   ├── api/                  # API routes
│   └── layout.tsx            # Root layout
├── components/               # Reusable UI components
│   ├── ui/                   # Base UI components (shadcn)
│   ├── music/                # Music-specific components
│   ├── profiles/             # User profile components
│   └── shared/               # Shared utility components
├── lib/                      # Utility functions and helpers
│   ├── api/                  # API client utilities
│   ├── auth/                 # Authentication utilities
│   ├── db/                   # Database utilities
│   └── utils/                # General utilities
├── prisma/                   # Prisma schema and migrations
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── public/                   # Static assets
├── styles/                   # Global styles
├── types/                    # TypeScript type definitions
└── next.config.js            # Next.js configuration
```

## Design System

reso follows a cohesive design system focusing on:

1. **Connection-Focused**: Design elements that facilitate and highlight connections between users and their music preferences.
2. **Intelligent Simplicity**: An interface that presents sophisticated AI features in an intuitive and approachable manner.
3. **Musical Expression**: Visual elements, animations, and interactive components that reflect the emotional nature of music.
4. **Responsive Engagement**: Interface elements that provide meaningful feedback and adapt to user behavior.
5. **Accessible Discovery**: Music discovery features that are easily accessible throughout the application.

### Color System
- Primary palette including Sonic Blue (#3A5CCC), Resonance Purple (#7B42F6), Melody Green (#22D07A), and Rhythm Red (#F24E4E)
- Dark theme-focused for enhancing visual experience of album artwork and music visualizations

### Typography
- Primary Font: Inter for all UI elements, navigation, and content
- Display Font: Manrope for headlines, featured content, and branding elements

## Best Practices

### Code Organization
- Follow a feature-based folder structure
- Use consistent naming conventions
- Implement proper TypeScript typing
- Document complex functions and components

### Performance Optimization
- Implement proper caching with React Query
- Use Next.js Image component for optimized images
- Lazy load non-critical components
- Implement proper pagination for large datasets

### Security Considerations
- Implement proper authentication and authorization
- Validate all user inputs
- Use environment variables for sensitive information
- Follow OWASP security guidelines

### Testing Strategy
- Write unit tests for critical functions
- Implement integration tests for API routes
- Use end-to-end testing for core user flows
- Test for accessibility compliance

## Development Workflow

1. **Feature Development**
   - Create a new branch for each feature
   - Implement the feature with proper tests
   - Submit a pull request for review

2. **Code Review Process**
   - Ensure code meets style guidelines
   - Verify all tests pass
   - Check for potential security issues
   - Review for performance considerations

3. **Deployment Pipeline**
   - Build and test in CI environment
   - Deploy to staging for manual testing
   - Promote to production after approval

## Resources

- [Music Recommendation System Guide](https://stratoflow.com/music-recommendation-system-guide/) - Comprehensive guide covering methods like collaborative filtering and audio models, with a 5-step implementation framework.
- [Music Recommendation Engine Project](https://github.com/Music-Recommendation-Engine-Project/Music-Recommendation-Engine) - GitHub repository demonstrating practical implementation using collaborative filtering and kNN algorithms.
- [Spotify Authentication API](https://accounts.spotify.com/api/token) - Official documentation for Spotify's token API, crucial for integrating music services.
- [AI Music Recommendation Best Practices](https://www.restack.io/p/ai-enhanced-music-recommendation-systems-answer-best-practices-ai-music-recommendation-algorithms-cat-ai) - Explains hybrid approaches, A/B testing, and balancing exploration/exploitation in recommendation systems.
- [Next.js Learn](https://nextjs.org/learn) - Interactive tutorial for building server-rendered and statically generated applications with Next.js. 