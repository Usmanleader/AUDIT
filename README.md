# AuditPro - Enterprise Audit Management Software

A comprehensive audit management platform built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

## Features

- **Dashboard** - Real-time audit statistics and analytics
- **Audit Management** - Create and manage audit engagements
- **Risk Assessment** - Risk register with heat map visualization
- **Controls Testing** - Control library and testing workflow
- **Findings Management** - Issue tracking and remediation
- **Reporting** - Generate audit reports and executive summaries
- **Organizations** - Manage clients and organizations
- **Settings** - User preferences and account management

## Tech Stack

- **Frontend**: React 19, TypeScript 5, Vite 7
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router DOM

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd audit-pro
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Set up Supabase database

Follow the detailed setup instructions in `SETUP_GUIDE.md` to:
- Create a Supabase project
- Run the database schema SQL
- Configure storage buckets
- Set up Row Level Security policies

5. Start development server
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

See `SETUP_GUIDE.md` for detailed deployment instructions.

## Project Structure

```
src/
├── components/
│   ├── layout/     # Layout components (Sidebar, Header)
│   ├── ui/         # Reusable UI components
│   └── dashboard/  # Dashboard-specific components
├── pages/          # Page components
├── lib/            # API clients and utilities
├── store/          # Zustand state stores
├── hooks/          # Custom React hooks
├── types/          # TypeScript type definitions
└── utils/          # Helper utilities
```

## Demo Mode

The application includes demo data and works in offline mode when Supabase is not configured. Simply run the app and click "Try Demo" on the login page.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Support

For issues or questions, please create an issue in the GitHub repository.
