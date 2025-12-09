# AAC Communication Board App

A React-based augmentative and alternative communication (AAC) board application built with Vite. The original project design is available at [Figma](https://www.figma.com/design/O8w4tYvX57YNUAC1yS4aom/AAC-Communication-Board-App).

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Deployment

This application can be deployed to Firebase Hosting or Vercel. See [DEPLOY.md](../DEPLOY.md) in the project root for detailed deployment instructions.

### Quick Deploy Commands

```bash
# Deploy to Firebase Hosting
npm run deploy:firebase

# Deploy to Vercel
npm run deploy:vercel
```

**Note**: You must configure Firebase and Vercel CLI tools before using these commands. See the deployment guide for setup instructions.

## Technology Stack

- **React** 18.3.1
- **Vite** 6.3.5
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## Project Structure

```
application/
├── src/                    # Source code
├── public/                 # Static assets
├── build/                  # Production build output (generated)
├── firebase.json           # Firebase Hosting configuration
├── .firebaserc            # Firebase project configuration
├── vercel.json            # Vercel deployment configuration
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Create production build in `build/` directory
- `npm run preview` - Preview production build locally
- `npm run deploy:firebase` - Deploy to Firebase Hosting
- `npm run deploy:vercel` - Deploy to Vercel

## Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure your environment variables:

```bash
cp .env.example .env.local
```

Environment variables must be prefixed with `VITE_` to be accessible in the application.

### Build Configuration

The build is configured in `vite.config.ts`:

- **Output Directory**: `build/`
- **Target**: `esnext`
- **Dev Server Port**: `3000`

## Continuous Deployment

Automated deployments are configured via GitHub Actions:

- **Push to `main`**: Deploys to production (both Firebase and Vercel)
- **Pull Requests**: Creates preview deployments with unique URLs

See `.github/workflows/` for workflow configurations.

## Browser Support

This application targets modern browsers with ES6+ support.

## Additional Resources

- [Deployment Guide](../DEPLOY.md) - Comprehensive deployment instructions
- [Vite Documentation](https://vite.dev/)
- [React Documentation](https://react.dev/)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Vercel Documentation](https://vercel.com/docs)
