# SyncAI - Industrial Intelligence Infrastructure

**AI Agents for Asset-Intensive Enterprises**

A premium, Bolt-inspired web application for industrial operations, built with React, TypeScript, Supabase, and Framer Motion.

## Features

- **Chat-First Command Center**: AI-powered operational intelligence with insight blocks
- **Premium Dark UI**: Minimalist, fast, with smooth animations
- **Free Trial System**: 10 sessions with intelligent gating
- **Executive/Operator Modes**: Context-aware outputs for different audiences
- **Supabase Auth**: Email/password authentication with enterprise-ready security
- **Real-time Session Tracking**: Zustand-powered state management

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (fast development and build)
- **TailwindCSS** (utility-first styling)
- **Framer Motion** (premium animations)
- **Supabase** (authentication + database)
- **Zustand** (state management)
- **Lucide React** (icon library)

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Configure Supabase:**

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your [Supabase Dashboard](https://app.supabase.com) → Project Settings → API.

3. **Run the development server:**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

4. **Build for production:**

```bash
npm run build
```

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AnimatedBackground.tsx   # Industrial schematic animation
│   ├── AuthShell.tsx           # Auth page wrapper
│   ├── AuthTabs.tsx            # Tab navigation for auth
│   ├── CommandCenter.tsx       # Main chat interface
│   └── Sidebar.tsx             # Navigation sidebar
├── pages/              # Route pages
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── EnterpriseAccess.tsx
│   ├── Pricing.tsx
│   ├── Security.tsx
│   ├── Terms.tsx
│   └── Privacy.tsx
├── store/              # Zustand stores
│   ├── trialStore.ts   # Free trial session counter
│   └── uiStore.ts      # UI state (sidebar, mode toggles)
├── lib/
│   └── supabase.ts     # Supabase client configuration
├── App.tsx             # Main app component with routing
└── main.tsx            # Entry point
```

---

## Free Trial System

### How It Works

- New users start with **10 free sessions**
- Each message sent decrements the counter by **1 session**
- Future "Run Simulation" actions will decrement by **2 sessions**
- Session count is stored in Zustand and persisted to `localStorage`
- When sessions reach **0**, users see an upgrade modal

### Implementation Details

Located in `src/store/trialStore.ts`:

```typescript
export const useTrialStore = create<TrialState>()(
  persist(
    (set) => ({
      sessionsRemaining: 10,
      decrementSession: () =>
        set((state) => ({
          sessionsRemaining: Math.max(0, state.sessionsRemaining - 1),
        })),
      resetSessions: () => set({ sessionsRemaining: 10 }),
    }),
    { name: 'syncai-trial' }
  )
);
```

To modify the trial limit, change the `sessionsRemaining: 10` default value.

---

## Executive vs Operator Mode

Toggle between two presentation modes:

- **Operator View**: Technical actions, work orders, asset-level tactics
- **Executive View**: EBITDA impact, risk reduction, strategic KPIs

Implementation in `src/components/CommandCenter.tsx` transforms AI responses based on `executiveMode` state from `uiStore`.

---

## Authentication

### Current Implementation

- Email/password authentication via Supabase
- No email confirmation required (disabled by default)
- User metadata stored: full name, company, role, industry

### Adding OAuth (Future)

To add Microsoft Azure AD, Google Workspace, or Okta:

1. Configure providers in Supabase Dashboard → Authentication → Providers
2. Update login UI to include OAuth buttons
3. Use `supabase.auth.signInWithOAuth({ provider: 'azure' })`

Example placeholder buttons are ready in the Login component (currently commented out).

---

## Integrating a Real Chat Model

Currently, the chat uses mocked responses. To integrate a real AI model:

### Option 1: Client-Side API Call

Update `handleSendMessage` in `CommandCenter.tsx`:

```typescript
const response = await fetch('https://your-api-endpoint.com/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: input,
    mode: executiveMode ? 'executive' : 'operator'
  }),
});

const data = await response.json();
```

### Option 2: Supabase Edge Function

Create a Supabase Edge Function for server-side processing:

```bash
supabase functions new chat
```

Then call it from the frontend:

```typescript
const { data, error } = await supabase.functions.invoke('chat', {
  body: { message: input, mode: executiveMode ? 'executive' : 'operator' },
});
```

This keeps API keys secure and enables RAG with your database.

---

## Deployment

### Deploy to Vercel

1. **Install Vercel CLI:**

```bash
npm i -g vercel
```

2. **Deploy:**

```bash
vercel
```

3. **Add environment variables in Vercel Dashboard:**

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

4. **Production deployment:**

```bash
vercel --prod
```

### Deploy to Netlify

1. **Install Netlify CLI:**

```bash
npm i -g netlify-cli
```

2. **Build and deploy:**

```bash
npm run build
netlify deploy --prod --dir=dist
```

3. Set environment variables in Netlify Dashboard → Site Settings → Environment Variables

---

## Supabase Setup

### Required Configuration

1. **Disable email confirmation** (for faster testing):
   - Supabase Dashboard → Authentication → Email Auth → Disable "Confirm email"

2. **Set site URL**:
   - Authentication → URL Configuration → Site URL: `http://localhost:5173` (dev) or your production URL

### Database (Optional)

Currently, no custom database tables are required. User data is stored in Supabase's built-in `auth.users` table.

To add custom tables for operational data (assets, work orders, etc.):

```sql
-- Create in Supabase SQL Editor
create table assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default now()
);

alter table assets enable row level security;

create policy "Users can view own assets"
  on assets for select
  using (auth.uid() = user_id);
```

---

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript type checking
```

---

## Design System

### Colors

- **Background**: `#0B0F14` (dark charcoal)
- **Surface**: `#161C24` (card backgrounds)
- **Border**: `#232A33` (subtle borders)
- **Primary**: `#3A8DFF` (blue accent)
- **Text**: `#E6EDF3` (primary text), `#9BA7B4` (secondary text)

### Typography

- Font: System font stack (Inter-like fallbacks)
- Headings: 600 weight, generous spacing
- Body: 400 weight, 150% line height

### Animations

- Page transitions: 300ms ease-in-out
- Hover effects: 200ms
- Modal animations: Spring physics (Framer Motion)

---

## Troubleshooting

### "Session expired" errors

Check that your Supabase URL and anon key are correctly set in `.env`.

### Trial counter not persisting

Clear localStorage and refresh:

```javascript
localStorage.removeItem('syncai-trial');
```

### Build errors with TypeScript

Run type checking:

```bash
npm run typecheck
```

---

## Future Enhancements

- [ ] Supabase Edge Function for AI chat backend
- [ ] RAG integration with operational data
- [ ] Real-time collaboration features
- [ ] Mobile-responsive improvements
- [ ] Stripe billing integration
- [ ] OAuth providers (Azure AD, Google, Okta)
- [ ] Multi-tenant organization support

---

## License

Proprietary - SyncAI Industrial Intelligence Infrastructure

## Support

For technical support or enterprise inquiries:
- Email: support@syncai.com
- Enterprise: enterprise@syncai.com
