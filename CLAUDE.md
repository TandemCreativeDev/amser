# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language Standards

- **Use British English** throughout all code, comments, documentation, and user-facing text
- Examples: "colour" not "color", "organisation" not "organization", "realise" not "realize"

# Amser - Time Tracking Application

## Project Overview

Amser is a sophisticated time tracking application built as a Toggl clone with advanced rate management features. It supports both personal and organisational time tracking with team collaboration capabilities.

## Tech Stack & Configuration

### Core Framework

- **Next.js 15.4.5** with App Router
- **TypeScript** with strict mode enabled
- **React 19.1.0** with React DOM 19.1.0

### Styling & UI

- **Tailwind CSS v4** (latest version using new `@plugin` syntax)
- **DaisyUI 5.0.50** with custom dark theme configuration
- **Geist fonts** (Sans and Mono) from Google Fonts
- Custom dark theme (`daisy-theme`) with carefully crafted color palette

### Development Tools

- **ESLint 9** with Next.js and TypeScript configurations
- **PostCSS** with Tailwind CSS plugin
- **Turbopack** enabled for faster development builds

## Available Scripts

```bash
npm run dev     # Start development server with Turbopack
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Project Architecture

### Planned Tech Stack (from ai-docs/plan.md)

- **Frontend**: Next.js 14+ App Router, TypeScript, Tailwind CSS + DaisyUI
- **State Management**: Zustand (planned)
- **Forms**: React Hook Form (planned)
- **Backend**: Next.js API Routes with NextAuth.js
- **Database**: MongoDB with Mongoose ODM

### Key Features (Planned)

1. **Authentication & User Management**
   - NextAuth.js integration
   - User registration/login with session management
   - Protected routes

2. **Organisation & Team Management**
   - Multi-tenant organisation system
   - Role-based permissions (Admin, Member)
   - Team member invitations
   - Context switching between personal/organisation workspaces

3. **Time Tracking**
   - Live timer with real-time updates
   - Manual time entry with date/time pickers
   - Project and client assignment
   - Organisation-aware time tracking

4. **Advanced Rate Management**
   - Base rates per project/client
   - Conditional rate rules with weekly thresholds
   - Automatic rate switching based on hours worked
   - Weekly calculation engine

5. **Project & Client Management**
   - Personal and organisation-scoped resources
   - Project categorization
   - Client management with colour coding
   - Archive/delete functionality

### Database Schema (Planned)

- **Users**: Email, name, organisation memberships, settings
- **Organisations**: Name, slug, owner, settings, categories
- **OrganisationMembers**: User-organisation relationships with roles
- **Clients**: Personal or organisation-scoped client management
- **Projects**: Under clients, with categories and default rates
- **TimeEntries**: Duration tracking with applied rates
- **RateRules**: Complex rate calculation rules with thresholds

## File Structure

### Current Structure

```
src/
├── app/
│   ├── favicon.ico
│   ├── globals.css       # Tailwind + DaisyUI configuration
│   ├── layout.tsx        # Root layout with theme
│   └── page.tsx          # Demo page with DaisyUI components
```

### Planned Structure (from plan.md)

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── organisations/
│   │   ├── clients/
│   │   ├── projects/
│   │   ├── time-entries/
│   │   └── rate-rules/
│   ├── dashboard/
│   ├── timer/
│   ├── reports/
│   ├── organisation/
│   └── settings/
├── components/
│   ├── ui/
│   ├── forms/
│   ├── timer/
│   └── tables/
├── lib/
│   ├── auth.ts
│   ├── mongodb.ts
│   ├── models/
│   └── utils/
└── types/
    └── index.ts
```

## Development Configuration

### TypeScript Configuration

- Target: ES2017
- Strict mode enabled
- Path aliases: `@/*` maps to `./src/*`
- Next.js plugin enabled

### Styling Configuration

- **Tailwind CSS v4** with new plugin syntax
- **DaisyUI plugin** with custom dark theme
- Custom colour palette with OKLCH colour space
- Geist fonts with CSS variables

### Theme Configuration

The project uses a custom DaisyUI theme called `daisy-theme` with:

- Dark colour scheme by default
- Custom OKLCH-based colour palette
- Rounded corners (0.5rem for selectors, 0.25rem for fields)
- Custom depth and noise effects

## Development Status

- **Current Phase**: Foundation setup complete
- **Next Steps**: Implement authentication, database models, and core time tracking features
- **Demo**: Currently shows DaisyUI component examples

## Key Development Patterns

### Component Organisation

- Use DaisyUI classes for consistent styling
- Custom theme applied at HTML level with `data-theme="daisy-theme"`
- Responsive design with Tailwind utilities

### Styling Approach

- Tailwind CSS v4 with `@import` and `@plugin` directives
- Custom DaisyUI theme with dark-first design
- OKLCH colour space for better colour management
- CSS custom properties for theme values

## Future Implementation Notes

- **Rate Calculation Engine**: Complex weekly threshold-based rate switching
- **Organisation Context**: Multi-tenant data scoping and permission system
- **Real-time Updates**: Live timer functionality with persistent state
- **Team Collaboration**: Shared resources and permission-based access control

