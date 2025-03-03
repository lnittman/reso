# reso

A social-first, AI-native music discovery platform that connects users through shared musical interests and personalized recommendations.

![reso](https://place-hold.it/300x300/333/fff&text=reso)

## Features

- **Daily AI-Curated Recommendations** - Personalized music suggestions with AI-generated explanations
- **Social Music Profiles** - User profiles showcasing music taste, favorite genres, and listening statistics
- **Music Sharing & Reactions** - Dedicated music messaging channel for sharing songs with context
- **Collaborative Playlists** - AI-assisted shared playlists that fit the vibe and appeal to all contributors

## Tech Stack

- **Next.js** - React framework for both frontend and backend
- **TypeScript** - Type-safe programming language
- **TailwindCSS** - Utility-first CSS framework for styling
- **shadcn/ui** - Reusable UI component system
- **Prisma** - ORM for database operations
- **React Query** - Data fetching and state management
- **Phosphor Icons** - Beautiful and consistent icons with duotone weight

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or pnpm
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/reso.git
   cd reso
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/reso"
   ```

4. Set up the database:
   ```bash
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
reso/
├── src/                      # Source files
│   ├── app/                  # App Router pages and layouts
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Layout components
│   │   ├── music/            # Music-specific components
│   │   └── profiles/         # User profile components
│   └── lib/                  # Utility functions and helpers
├── prisma/                   # Prisma schema and migrations
│   └── schema.prisma         # Database schema
├── public/                   # Static assets
└── docs/                     # Documentation
```

## Development Workflow

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "Add your feature"
   ```

3. Push your branch to the remote repository:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a pull request from your branch to the main branch.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from various music streaming platforms
- Documentation and best practices from Next.js, Prisma, and shadcn/ui
