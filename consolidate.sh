#!/bin/bash

# Script to consolidate directory structure to src/

echo "🔍 Starting directory structure consolidation..."

# Create all necessary directories
echo "📂 Creating directories in src/ structure..."
mkdir -p src/app/api/auth/[...nextauth] \
         src/app/auth/signin \
         src/app/discover \
         src/app/playlists/collaborative \
         src/app/playlists/create \
         src/app/playlists/generate \
         src/app/profile \
         src/app/profile/setup \
         src/components/auth \
         src/components/dashboard \
         src/components/layout \
         src/components/marketing \
         src/components/music \
         src/components/playlist \
         src/components/profiles \
         src/components/shared \
         src/components/ui \
         src/lib/ai \
         src/lib/auth \
         src/lib/data \
         src/lib/db \
         src/lib/logging \
         src/lib/music \
         src/lib/storage \
         src/lib/store

# Copy app directory with rsync (preserves directory structure)
echo "🔄 Copying app/ to src/app/..."
rsync -av app/ src/app/ --ignore-existing

# Copy components directory
echo "🔄 Copying components/ to src/components/..."
rsync -av components/ src/components/ --ignore-existing

# Copy lib directory
echo "🔄 Copying lib/ to src/lib/..."
rsync -av lib/ src/lib/ --ignore-existing

# Create a backup of root-level app, components, lib directories
echo "📦 Creating backup directory..."
mkdir -p .backup
mv app .backup/app 2>/dev/null || true
mv components .backup/components 2>/dev/null || true
mv lib .backup/lib 2>/dev/null || true
mv middleware.ts .backup/middleware.ts 2>/dev/null || true

# Ensure middleware.ts exists in src
echo "🔄 Ensuring middleware.ts exists in src/..."
[ -f src/middleware.ts ] || cp -f .backup/middleware.ts src/middleware.ts 2>/dev/null || true

# Fix import paths in all files
echo "🔧 Fixing import paths..."
find src -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/@\/src\//@\//g' 2>/dev/null || true

echo "✅ Directory structure consolidation complete!"
echo "-----------------------------------------------"
echo "The old directories have been backed up to .backup/"
echo "You can safely delete this directory after verifying everything works." 