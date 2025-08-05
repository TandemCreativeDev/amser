# ClepSync - Time Tracking Application

A sophisticated time tracking application built as a Toggl clone with advanced rate management features. Supports both personal and organisational time tracking with team collaboration capabilities.

## Features Implemented ✅

### Core Authentication & User Management
- ✅ NextAuth.js integration with Google OAuth
- ✅ User registration/login with session management
- ✅ Protected routes and authentication guards

### Database & Models
- ✅ MongoDB integration with Mongoose ODM
- ✅ Complete database schemas (User, Organisation, Client, Project, TimeEntry, RateRule)
- ✅ Multi-tenant organisation system support

### State Management
- ✅ Zustand stores for timer state and app state
- ✅ Persistent timer state across browser sessions
- ✅ Organisation context switching

### Time Tracking
- ✅ Live timer with real-time updates
- ✅ Project and client assignment
- ✅ Persistent timer state
- ✅ Time entry creation and display
- ✅ Automatic rate calculation

### Project & Client Management
- ✅ Client CRUD operations with colour coding
- ✅ Project management with categories and rates
- ✅ Organisation-scoped resource management

### Dashboard & Analytics
- ✅ Real-time dashboard with statistics
- ✅ Recent activity tracking
- ✅ Earnings calculations
- ✅ Active project overview

### UI/UX
- ✅ Responsive design with Tailwind CSS v4
- ✅ DaisyUI components with custom dark theme
- ✅ British English throughout
- ✅ Intuitive navigation and user experience

## Features In Progress 🚧

- ⏳ Manual time entry management (editing, deletion)
- ⏳ Advanced rate calculation engine with conditional rules
- ⏳ Organisation and team management features
- ⏳ Reports and analytics dashboard
- ⏳ Settings and user profile management

## Tech Stack

- **Frontend**: Next.js 15.4.5 with App Router, TypeScript, React 19.1.0
- **Styling**: Tailwind CSS v4 + DaisyUI 5.0.50 with custom dark theme
- **State Management**: Zustand with persistence
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: MongoDB with Mongoose ODM
- **Development**: ESLint 9, Turbopack for fast builds

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB database (local or cloud)
- Google OAuth credentials

### Installation

1. Clone the repository and install dependencies
```bash
npm install
```

2. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/clepsync
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Setting up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
6. Copy the Client ID and Client Secret to your `.env.local` file

## Usage

### For Personal Use
1. Sign in with Google
2. Create clients and projects
3. Start tracking time with the timer
4. View dashboard for analytics

### For Teams (Coming Soon)
1. Create or join an organisation
2. Switch between personal and organisation context
3. Collaborate on shared projects
4. Manage team permissions

## Development Commands

```bash
npm run dev        # Start development server with Turbopack
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── timer/             # Timer functionality
│   ├── projects/          # Project management
│   └── auth/              # Authentication pages
├── components/            # React components
│   ├── ui/               # UI components
│   └── layout/           # Layout components
├── lib/                  # Utilities and configurations
│   ├── stores/           # Zustand stores
│   ├── models/           # Database models
│   ├── auth.ts           # NextAuth configuration
│   └── mongodb.ts        # Database connection
└── types/                # TypeScript type definitions
```

## Contributing

Please follow the British English conventions used throughout the application and maintain the existing code style and patterns.
