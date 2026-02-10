#!/bin/bash
set -e

echo "🚀 Starting FinTrack Project Restructuring..."
echo ""

# ========================================
# STEP 1: Create new folder structure
# ========================================
echo "📁 Creating folder structure..."
mkdir -p frontend/src/{api,components,context,hooks,lib,pages,utils}
mkdir -p frontend/public
mkdir -p backend/src

# ========================================
# STEP 2: Move frontend files
# ========================================
echo "📦 Moving frontend files..."

# Move main client files to frontend/src
cp -r client/* frontend/src/

# Move public assets
cp -r public/* frontend/public/

# Move root config files that are frontend-specific
cp index.html frontend/
cp postcss.config.js frontend/
cp tailwind.config.ts frontend/

echo "✅ Frontend files moved"

# ========================================
# STEP 3: Update vite.config.ts for new structure
# ========================================
echo "🔧 Updating vite.config.ts..."
cat > vite.config.ts << 'EOF'
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  root: "./frontend",
  server: { host: "::", port: 8080 },
  build: { outDir: "../dist", emptyOutDir: true },
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./frontend/src") } }
});
EOF
echo "✅ vite.config.ts updated"

# ========================================
# STEP 4: Update tsconfig.json
# ========================================
echo "🔧 Updating tsconfig.json..."
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForEnumMembers": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "./frontend",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["frontend/src", "frontend/vite-env.d.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF
echo "✅ tsconfig.json updated"

# ========================================
# STEP 5: Create tsconfig.node.json
# ========================================
echo "🔧 Creating tsconfig.node.json..."
cat > tsconfig.node.json << 'EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOF
echo "✅ tsconfig.node.json created"

# ========================================
# STEP 6: Update package.json
# ========================================
echo "🔧 Updating package.json..."
cat > package.json << 'EOF'
{
  "name": "fintrack",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "description": "FinTrack - Personal Finance Manager",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "format.check": "prettier --check ."
  },
  "dependencies": {
    "@tanstack/react-query": "^5.28.0",
    "lucide-react": "^0.292.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.17.0",
    "recharts": "^2.10.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react-swc": "^3.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "prettier": "^3.1.0",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.3.3",
    "vite": "^5.0.7"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.6.0"
}
EOF
echo "✅ package.json updated"

# ========================================
# STEP 7: Create backend README
# ========================================
echo "📝 Creating backend stub..."
cat > backend/README.md << 'EOF'
# FinTrack Backend

This folder is reserved for future backend implementation.

## Current Status
The application is currently frontend-only, running entirely in the browser with localStorage for data persistence.

## Future Backend Options
When ready to add a backend, consider:
- Node.js/Express
- Python/FastAPI
- Other API solutions

## Structure
- `/src` - Backend source code (when implemented)

For now, the frontend uses a mock API client (`frontend/src/api/axiosClient.ts`) that simulates API responses using localStorage.
EOF
echo "✅ backend/README.md created"

# ========================================
# STEP 8: Create .gitignore if missing
# ========================================
echo "🔧 Ensuring .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules
pnpm-lock.yaml

# Build output
dist
dist-ssr

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode
.idea
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
pnpm-debug.log*
EOF
echo "✅ .gitignore updated"

# ========================================
# STEP 9: Create root README
# ========================================
echo "📝 Creating root README..."
cat > README.md << 'EOF'
# FinTrack - Personal Finance Manager

A modern, responsive personal finance tracker web application built with React, Vite, and TailwindCSS.

## Project Structure


.
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── api/       # API client and endpoints
│   │   ├── components/# Reusable React components
│   │   ├── context/   # React Context for state management
│   │   ├── hooks/     # Custom React hooks
│   │   ├── lib/       # Utility functions
│   │   ├── pages/     # Page components (routes)
│   │   └── utils/     # Helper utilities
│   ├── public/        # Static assets
│   └── index.html     # HTML entry point
├── backend/           # Backend (future implementation)
├── package.json       # Root dependencies
├── vite.config.ts     # Vite configuration
└── tsconfig.json      # TypeScript configuration
```

## Features

✨ **Dashboard** - Financial overview with charts and analytics
💳 **Transactions** - Track income and expenses
📋 **Budgets** - Set and monitor spending limits
🎯 **Goals** - Create and track savings goals
👤 **Profile** - View financial insights and tips
🤖 **AI Chatbot** - Get financial guidance

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build
```

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: React Context + TanStack Query
- **Charts**: Recharts
- **Routing**: React Router 6
- **UI Icons**: Lucide React
- **Data**: localStorage (browser-based)

## Development

```bash
# Type checking
pnpm run typecheck

# Format code
pnpm run format

# Check formatting
pnpm run format.check
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- Currently frontend-only with localStorage persistence
- All data is stored locally in your browser
- No server-side sync across devices
- Perfect for personal use and prototype testing

## Future Enhancements

- Backend API integration
- Cloud sync
- Mobile app
- Advanced analytics
- Budget recommendations

## License

MIT
EOF
echo "✅ README.md updated"

# ========================================
# STEP 10: Create MIGRATION_GUIDE.md
# ========================================
echo "📝 Creating migration guide..."
cat > MIGRATION_GUIDE.md << 'EOF'
# Project Restructuring - Migration Guide

## What Changed

The project has been restructured from a monolithic layout to a clean frontend/backend separation.

### Old Structure
```
/client        → Frontend code
/server        → Express backend (removed)
/backend       → FastAPI backend (removed)
/netlify       → Serverless wrapper (removed)
/shared        → Shared utilities (removed)
```

### New Structure
```
/frontend      → React SPA application
  /src         → Source code (API, Components, Pages, etc.)
  /public      → Static assets
  /index.html  → Entry point
/backend       → Reserved for future backend
```

## Removed Files & Folders

The following files/folders were removed as they were unused:
- `/server/` - Express backend (unused)
- `/backend/` - FastAPI backend (unused)
- `/netlify/` - Netlify Functions wrapper (unused)
- `/shared/` - Shared utilities (consolidated into frontend)
- `/components.json` - UI components config (unused)
- `vite.config.server.ts` - Server build config (unused)
- `AGENTS.md`, `FINTRACK_FRONTEND_ONLY.md` - Documentation (archived)

## Configuration Changes

### vite.config.ts
- Root changed to `./frontend`
- Output directory changed to `../dist`
- Path alias now points to `./frontend/src`

### tsconfig.json
- Base URL updated to `./frontend`
- Include paths updated
- Removed server/shared paths

### package.json
- Removed backend dependencies
- Streamlined to include only necessary frontend packages
- Updated scripts to use new paths

## Import Path Updates

All imports in the application now use:
```typescript
import { Component } from "@/components/...";
import { Page } from "@/pages/...";
import { api } from "@/api/...";
```

The `@` alias points to `frontend/src/`.

## How to Use

1. **Development**
   ```bash
   pnpm install
   pnpm run dev
   ```

2. **Build**
   ```bash
   pnpm run build
   ```

3. **Type Check**
   ```bash
   pnpm run typecheck
   ```

## Notes for Future Backend Integration

When adding a backend:

1. Create your backend in `/backend/src/`
2. Update API endpoints in `/frontend/src/api/` to point to your backend
3. Create a separate build process for backend if needed
4. Consider using environment variables for API endpoints:
   ```typescript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
   ```

## Troubleshooting

**Issue**: Import errors after restructure
- **Solution**: Ensure paths use `@/...` syntax and point to frontend/src

**Issue**: Build fails
- **Solution**: Run `pnpm run typecheck` to identify type errors

**Issue**: Dev server won't start
- **Solution**: Delete `node_modules` and `pnpm-lock.yaml`, then run `pnpm install`

## Questions?

Refer to the main README.md for more information about the project structure and development.
EOF
echo "✅ MIGRATION_GUIDE.md created"

# ========================================
# STEP 11: Clean up old folders
# ========================================
echo "🧹 Cleaning up old folders..."
rm -rf client
rm -rf server
rm -rf backend  # This will be recreated with README
mkdir -p backend
cat > backend/README.md << 'EOF'
# FinTrack Backend

This folder is reserved for future backend implementation.

## Current Status
The application is currently frontend-only, running entirely in the browser with localStorage for data persistence.

## Future Backend Options
When ready to add a backend, consider:
- Node.js/Express
- Python/FastAPI
- Other API solutions

## Structure
- `/src` - Backend source code (when implemented)

For now, the frontend uses a mock API client (`frontend/src/api/axiosClient.ts`) that simulates API responses using localStorage.
EOF

rm -rf netlify
rm -rf shared
rm -rf public
rm -f vite.config.server.ts
rm -f AGENTS.md
rm -f FINTRACK_FRONTEND_ONLY.md
echo "✅ Old folders cleaned up"

# ========================================
# STEP 12: Install dependencies
# ========================================
echo "📦 Installing dependencies..."
pnpm install
echo "✅ Dependencies installed"

# ========================================
# Final summary
# ========================================
echo ""
echo "✨ ✨ ✨ Restructuring Complete! ✨ ✨ ✨"
echo ""
echo "📁 New Project Structure:"
echo "├── frontend/     (React SPA)"
echo "│   ├── src/"
echo "│   ├── public/"
echo "│   └── index.html"
echo "├── backend/      (Future backend)"
echo "├── package.json"
echo "├── vite.config.ts"
echo "├── tsconfig.json"
echo "└── README.md"
echo ""
echo "🚀 Next Steps:"
echo "   1. Run: pnpm run dev"
echo "   2. Verify the app runs at http://localhost:8080"
echo "   3. Review MIGRATION_GUIDE.md for details"
echo ""
echo "Happy coding! 🎉"
