# DealDraft

**From sales call to signed-ready proposal in 10 minutes.**

DealDraft turns agency sales call transcripts into polished, branded proposals written in your voice, using your template. Built for single-tenant deployments — one agency per instance.

## Product Overview

- **Input:** Paste a sales call transcript (from Fireflies, Fathom, Zoom, etc.)
- **Processing:** AI extracts client pain points, scope, budget, timeline → generates proposal in your template
- **Output:** Editable proposal → Export PDF or share web link → Client accepts online

**Key differentiator:** Every proposal sounds like *your agency* wrote it. The template, tone, and voice are configured once per deployment.

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Supabase** (Postgres + Auth + Storage)
- **Anthropic Claude Sonnet 4** (extraction, generation, rewriting)
- **@react-pdf/renderer** (PDF export)
- **Tailwind CSS** (signature-ready design system)

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- Supabase account
- Anthropic API key

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 4. Supabase Setup

#### Create a new Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key (Project Settings → API)
3. Get your service role key (Project Settings → API → service_role secret)

#### Run migrations

Option A: Using Supabase CLI (recommended):

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

Option B: Manual (SQL Editor in Supabase Dashboard):

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Create a new query
4. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
5. Run the query
6. Repeat for `supabase/migrations/002_seed_data.sql`

#### Set up Storage (if using logo uploads)

1. Go to Storage in Supabase dashboard
2. Create a bucket named `agency-assets`
3. Set it to public
4. Configure upload policies as needed

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

You should see:
- Landing page at `/`
- Demo proposal in dashboard at `/dashboard`
- The demo agency "Northbeam Digital" is pre-configured

### 6. Test the Full Flow

1. **View demo proposal:** Go to `/dashboard` → click the demo proposal
2. **Edit sections:** Try editing content, rewriting a section with an instruction
3. **Edit pricing:** Add/remove items, see totals update
4. **Export PDF:** Click "Export PDF" — should download a formatted PDF
5. **Share link:** Click "Copy share link" → open in incognito → see public client view
6. **Accept proposal:** Click "Accept proposal" on public view
7. **Create new proposal:** Go to `/new` → paste the demo transcript (from seed data) → generate

## Deployment Playbook (For New Agency Deployments)

This is the process for selling and deploying DealDraft for a new agency client.

### Pre-Sale

1. **Discovery call:** Understand their proposal process, brand voice, typical scope
2. **Demo:** Show them the live demo with Northbeam Digital
3. **Pricing:** €1-2k setup + €X/month maintenance (set your own pricing)

### Post-Sale Setup

#### Step 1: Clone and Configure

```bash
# Clone repo for client
git clone [repo] client-name-dealdraft
cd client-name-dealdraft

# Install deps
npm install

# Create .env.local with their Supabase + Anthropic keys
cp .env.example .env.local
```

#### Step 2: Run Migrations (Fresh Database)

Run both migration files in their Supabase project (see setup instructions above).

#### Step 3: Configure Agency Settings

Either:

**Option A:** Update seed data in `002_seed_data.sql` before running migration:
- Replace "Northbeam Digital" with client name
- Update services, pricing, tone instructions
- Customize template sections

**Option B:** Run migrations with demo data, then use Settings page:
1. Go to `/settings`
2. Update:
   - Agency name
   - Brand colors
   - Website
   - About blurb
   - **Tone instructions** (CRITICAL — this is where you encode their voice)
   - Services list with pricing
   - Template sections (keep, remove, or reorder)
   - Default terms
   - Currency

#### Step 4: Test with Real Transcript

1. Get a real sales call transcript from the client (anonymized if needed)
2. Paste into `/new`
3. Review generated proposal with client
4. Iterate on tone instructions until output matches their voice

**Tuning tips:**
- Tone instructions are the most important lever
- Be specific: "Use short sentences. Lead with outcomes. No corporate jargon. Address client by first name."
- Test 2-3 different transcripts to ensure consistency
- Adjust template section instructions for each section's style

#### Step 5: Deploy to Netlify

See [Netlify Deployment](#netlify-deployment) section below.

#### Step 6: Handoff

Provide client with:
- Live URL
- Login credentials (if auth is enabled)
- Settings dashboard access
- 15-min walkthrough (record it for their team)
- Support email/Slack channel

## Netlify Deployment

### Option 1: Manual Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod
```

Follow prompts to create a new site or link to an existing one.

### Option 2: Git-Based Deploy (Recommended)

1. Push your code to GitHub/GitLab
2. Go to [netlify.com](https://netlify.com) → "Add new site" → "Import from Git"
3. Select your repo
4. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
5. Add environment variables in Netlify dashboard (Site settings → Environment variables):
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. Deploy

### Option 3: One-Click Deploy Button

Add to your repo's README:

```markdown
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/dealdraft)
```

Create a `netlify.toml` in the root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Environment Variables on Netlify

After deploying, go to **Site settings → Environment variables** and add all four required keys.

Redeploy after adding environment variables.

## Features Overview

### Core Pages

- **`/`** — Landing page (doubles as sales page for agencies)
- **`/dashboard`** — Proposals table with status, value, last activity
- **`/new`** — Paste transcript → generate proposal
- **`/proposal/[id]`** — Editor (sections + pricing + insights panel)
- **`/p/[token]`** — Public client view (branded, accept button)
- **`/settings`** — Agency configuration

### AI Pipeline

1. **Extraction** (`lib/ai/extraction.ts`):
   - Extracts pain points (with verbatim quotes), scope, budget, timeline
   - Returns structured JSON

2. **Generation** (`lib/ai/generation.ts`):
   - Builds system prompt from agency settings (tone, services, template)
   - Generates all sections + pricing table
   - Mirrors client's language from transcript

3. **Rewrite** (`lib/ai/rewrite.ts`):
   - Per-section rewriting with natural language instructions
   - Examples: "shorter", "more formal", "add a phased option"

### Design System

**Signature-ready theme** (avoids typical AI-SaaS aesthetics):
- **Colors:** Ink (#14213D), Bond paper (#F7F6F2), Brass accent (#9A7B2D)
- **Fonts:** Libre Caslon Text (display), Inter (body), Spline Sans Mono (pricing)
- **Motif:** Letterhead double rule, signature-line button styling

Proposals use agency's `primary_color` in public view for native branding.

## Data Model

See `supabase/migrations/001_initial_schema.sql` for full schema.

**Key tables:**
- `agency_settings` — Singleton, stores all agency config
- `calls` — Transcript + extraction JSON
- `proposals` — Sections (jsonb), pricing (jsonb), status, share_token
- `activity` — Event log (created, exported, link_opened, accepted)

## Authentication (Optional)

Auth is **not included** in this MVP. The product is single-tenant — one agency per deployment.

To add auth:
1. Enable Supabase Auth (magic link recommended)
2. Wrap `/dashboard`, `/new`, `/proposal/*`, `/settings` in auth middleware
3. Leave `/` (landing) and `/p/*` (public view) unprotected

Example middleware:

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Protect routes except landing and public proposals
  if (request.nextUrl.pathname.startsWith('/p/')) {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname === '/') {
    return NextResponse.next()
  }

  // Check auth for all other routes
  // ... implement Supabase auth check
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

## Troubleshooting

### AI generation fails

- **Check Anthropic API key** in `.env.local`
- **Check API quotas** — Claude Sonnet 4 requires API access
- **Review logs** — server logs will show Claude API errors

### Supabase connection issues

- **Verify env vars** — `NEXT_PUBLIC_SUPABASE_URL` and keys
- **Check Supabase project status** — ensure project is running
- **Migrations not run** — proposals/calls tables must exist

### PDF export fails

- **Missing @react-pdf/renderer** — run `npm install @react-pdf/renderer`
- **Timeout** — large proposals may need increased serverless function timeout

### Proposal doesn't match agency voice

- **Edit tone instructions** in `/settings`
- **Be very specific** — "Use short sentences. No buzzwords. Address client by first name."
- **Test with multiple transcripts** to ensure consistency
- **Iterate template section instructions** for better control per section

## Roadmap (Out of Scope for v1)

These are **not included** but could be added:

- Audio transcription (currently paste-only)
- E-signature integration (Accept button is sufficient for v1)
- Multi-tenant/orgs (deliberately single-tenant)
- CRM integrations
- Email sending (share link is manual)
- Proposal versioning/history
- Billing/subscriptions (handled externally)

## Support

For issues or questions:
- Check this README first
- Review `/dealdraft-superprompt.md` for product spec
- Check Supabase logs for database errors
- Check server logs (`npm run dev` output) for API errors

## License

Proprietary. For agency deployments only.

---

**Built for agencies who close.**
