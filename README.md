# Catus

A simple, clean app for tracking your cat's health and life. Think of it as a baby tracker, but for cats.

**Live at [catusapp.netlify.app](https://catusapp.netlify.app)**

Track weight, vaccinations, vet visits, medications, feeding, photos, journal entries, and more — all in one place. Supports multiple cats per account.

## Features

- **Cat Profiles** — Name, breed, photo, date of birth, gender, microchip number, neutered status, allergies, and more
- **Weight Tracker** — Log weight over time with a visual chart (kg/lbs)
- **Vaccination Records** — Track vaccines with due date reminders and status badges
- **Vet Visits** — Log visits with diagnosis, treatment, cost, and document uploads
- **Medications** — Track current and past medications with dosage and frequency
- **Treatments** — Flea/tick, deworming, and other preventive treatment logs
- **Feeding** — Record diet info, food type, brand, portions, and schedule
- **Photo Gallery** — Upload and browse photos of your cat
- **Journal** — Free-form notes with tags for tracking behavior, concerns, or funny moments
- **Multi-Cat Support** — One account, unlimited cat profiles
- **Google Sign-In** — Sign up with Google or email/password

## Tech Stack

- [Next.js](https://nextjs.org) — React framework
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [Supabase](https://supabase.com) — Auth, PostgreSQL database, file storage
- [Recharts](https://recharts.org) — Weight charts
- [Lucide](https://lucide.dev) — Icons
- [react-hook-form](https://react-hook-form.com) + [zod](https://zod.dev) — Form handling and validation

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- (Optional) [Supabase CLI](https://supabase.com/docs/guides/cli) for running migrations

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/catus.git
cd catus
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

Create a new project at [supabase.com](https://supabase.com) and grab your project URL and publishable (anon) key from **Settings > API**.

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your Supabase credentials. This file is gitignored and will never be committed.

### 4. Run database migrations

**Option A: Using the Supabase CLI**

```bash
supabase link --project-ref your-project-ref
supabase db push
```

**Option B: Using the SQL Editor**

Copy the contents of `supabase/all_migrations.sql` and paste it into the [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql), then click Run.

This creates all tables, Row Level Security policies, storage buckets, and an auth trigger that auto-creates user profiles on signup.

### 5. Configure Google OAuth (optional)

To enable "Sign in with Google":

1. Create OAuth credentials in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Set the authorized redirect URI to: `https://your-project.supabase.co/auth/v1/callback`
3. In your Supabase Dashboard, go to **Authentication > Providers > Google** and enter your Client ID and Client Secret

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

The app is configured for [Netlify](https://netlify.com). Connect your repo and it will auto-detect the settings from `netlify.toml`.

Environment variables to set in Netlify:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (auto-created on signup) |
| `cats` | Cat profiles with all identity/health fields |
| `weight_logs` | Weight measurements over time |
| `vaccinations` | Vaccine records with due dates |
| `vet_visits` | Vet appointment history with document uploads |
| `medications` | Current and past medications |
| `treatments` | Flea/tick, deworming, and other preventive treatments |
| `feeding` | Diet and feeding information |
| `photos` | Photo gallery |
| `journal_entries` | Free-form notes and diary entries |

All tables are protected by Row Level Security — users can only access their own data.

## Project Structure

```
catus/
├── app/                  # Next.js App Router pages
│   ├── (auth)/           # Login, signup, password reset
│   ├── (dashboard)/      # Dashboard, cat profiles, all tracking pages
│   └── auth/callback/    # OAuth callback handler
├── components/           # React components
├── hooks/                # Custom React hooks
├── lib/                  # Supabase clients, utilities, constants
├── supabase/
│   └── migrations/       # SQL migration files
└── netlify.toml          # Netlify deployment config
```

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE)
