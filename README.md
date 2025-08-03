# Tier Events

A membership-based events platform where users can discover and RSVP to events based on their tier level (Free, Silver, Gold, Platinum).

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
```bash
cp env.example .env.local
```

Add your API keys to `.env.local`:
- **Clerk**: Get from https://clerk.dev
- **Supabase**: Get from your Supabase project settings

### 3. Database Setup
- Go to your Supabase project dashboard
- Navigate to SQL Editor
- Copy and run the entire `scripts/setup-database.sql` file

### 4. Clerk Configuration
- In Clerk dashboard, go to Users
- Add public metadata to a user: `{ "tier": "free" }`
- Available tiers: `free`, `silver`, `gold`, `platinum`

### 5. Run Application
```bash
npm run dev
```

Visit http://localhost:3000

## Features

- **Tier-based Access**: Users see events for their tier and below
- **RSVP System**: Attend/Maybe/Cancel responses
- **Tier Upgrade**: Simulate membership upgrades
- **Random Icons**: Dynamic event images via API
- **Real-time Updates**: Live attendance tracking

## Tech Stack

- Next.js 14 (App Router)
- Clerk.dev (Authentication)
- Supabase (Database)
- Tailwind CSS (Styling)
- TypeScript