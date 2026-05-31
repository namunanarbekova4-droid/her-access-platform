# Her Access — AI Education Platform

> **AI-powered education for girls in restricted regions.** Learn, grow, and connect — safely, privately, in your language.

Her Access is a mission-driven platform that delivers world-class education to girls who face barriers to learning. Built with privacy, safety, and emotional intelligence at its core.

---

## Features

| Feature | Description |
|---|---|
| 🌸 **AI Mentor (Noor)** | Multilingual AI guide — Arabic, Dari, Pashto, English, Russian |
| 📚 **Adaptive Learning Path** | AI-generated 12-week personalized roadmap |
| 👁️ **Safe Anonymous Mode** | One-click stealth transforms site into cooking website |
| 📖 **Quiet Library** | Offline-capable lesson library across 5 subjects |
| 👥 **Peer Circles** | Anonymous group chats of 3–5 girls with shared interests |
| ✨ **Inspiration Stories** | AI-generated motivational stories from girls like you |
| 🔒 **Privacy-first** | No real name required. Encrypted. Fully anonymous option. |

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM + SQLite
- **Authentication**: NextAuth v4 (credentials)
- **AI**: Google Gemini API (`gemini-1.5-flash`)
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Markdown**: React Markdown + remark-gfm

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone <repository-url>
cd her-access-platform
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
# Database (SQLite — file-based, no setup required)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secure-random-secret"
NEXTAUTH_URL="http://localhost:3000"

# Google Gemini AI
GEMINI_API_KEY="your-gemini-api-key"
```

**Getting your Gemini API key:**
1. Visit Google AI Studio
2. Click "Get API Key"
3. Create a new key and copy it

### Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates SQLite file)
npm run db:push
```

### Running Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Database Commands

```bash
# Generate Prisma client (after schema changes)
npm run db:generate

# Sync schema to database
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio
```

---

## Project Structure

```
her-access-platform/
├── app/
│   ├── (auth)/          # Login & Register pages
│   ├── (dashboard)/     # Protected dashboard routes
│   ├── api/             # API routes
│   ├── onboarding/      # User onboarding flow
│   └── page.tsx         # Landing page
├── components/
│   ├── ui/              # Reusable UI components
│   ├── layout/          # Layout components
│   ├── dashboard/       # Dashboard components
│   ├── mentor/          # AI Mentor chat
│   ├── learning/        # Learning path
│   ├── library/         # Offline library
│   ├── circles/         # Peer circles
│   ├── stories/         # Inspiration stories
│   ├── stealth/         # Safe mode (stealth)
│   └── landing/         # Landing page sections
├── lib/
│   ├── auth.ts          # NextAuth config
│   ├── gemini.ts        # Gemini AI integration
│   ├── prisma.ts        # Prisma client
│   └── utils.ts         # Utilities
├── actions/             # Server actions
├── types/               # TypeScript types
└── prisma/
    └── schema.prisma    # Database schema
```

---

## Safety Features

### Anonymous Mode (Safe Mode)
One click transforms the entire platform into a realistic cooking website. No animation delay. No trace. Press `Ctrl+Shift+H` to exit.

### Privacy Design
- Nicknames instead of real names
- No public profiles
- Encrypted sessions
- No tracking

---

## Supported Languages

| Language | Code |
|---|---|
| English | `en` |
| Arabic (العربية) | `ar` |
| Dari (دری) | `fa` |
| Pashto (پښتو) | `ps` |
| Russian (Русский) | `ru` |

---

## Troubleshooting

**"GEMINI_API_KEY is not configured"**
Add your Gemini API key to `.env`.

**Prisma errors**
Run `npm run db:push` to sync the schema.

**Auth not working**
Ensure `NEXTAUTH_SECRET` is set and `NEXTAUTH_URL` matches your URL.

---

Built with love for girls everywhere who deserve to learn. 🌸
