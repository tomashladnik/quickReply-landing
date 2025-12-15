# DentalScan School Portal - QuickReply Landing

This is a [Next.js](https://nextjs.org) project for the DentalScan School Portal system.

## Prerequisites

- Node.js 18+ (or Bun)
- PostgreSQL database
- npm, yarn, pnpm, or bun

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dentalscan?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/dentalscan?schema=public"

# Add other environment variables as needed (Supabase, Twilio, etc.)
```

### 3. Set Up Database

Generate Prisma Client:
```bash
npm run prisma:generate
# or
bun run prisma:generate
```

Run migrations (if needed):
```bash
npm run prisma:migrate
# or
bun run prisma:migrate
```

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 5. Access School Portal

Navigate to [http://localhost:3000/school](http://localhost:3000/school) to access the school portal entry page.

## Available Routes

- `/school` - School portal entry (Parent, Student, Teacher, Admin)
- `/school/parent` - Parent login/OTP flow
- `/school/parent/dashboard` - Parent dashboard
- `/school/parent/enroll` - Child enrollment form
- `/school/parent/child/[id]` - Child scan result details
- `/school/parent/child/[id]/history` - Scan history
- `/school/parent/child/[id]/dentist` - Dentist sharing
- `/school/parent/settings` - Account settings

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations

## Project Structure

```
src/
├── app/
│   ├── school/              # School portal pages
│   │   ├── page.tsx         # Entry page (role selection)
│   │   └── parent/          # Parent portal
│   │       ├── page.tsx     # Login/OTP
│   │       ├── dashboard/   # Dashboard
│   │       ├── enroll/      # Enrollment
│   │       ├── child/[id]/   # Child details
│   │       └── settings/    # Settings
│   └── ...
├── components/
│   └── ui/                  # Reusable UI components
└── lib/                     # Utilities and helpers
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).
