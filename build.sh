#!/bin/bash
# Build script with memory optimization for Render deployments
set -e

echo "🔨 Starting optimized build process..."
echo "📊 Setting memory options: 2GB"

# Set Node memory options
export NODE_OPTIONS="--max-old-space-size=2048"

# Run build
npm run build

echo "✅ Build completed successfully!"
