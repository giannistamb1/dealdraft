# DealDraft Deployment Guide

## Quick Start Checklist

Before deployment, make sure you have:

- [ ] Supabase project created
- [ ] Migrations run (001_initial_schema.sql and 002_seed_data.sql)
- [ ] Anthropic API key obtained
- [ ] Environment variables ready
- [ ] Netlify account set up

## Step-by-Step Deployment to Netlify

### 1. Prepare Supabase

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Get your credentials:**
   - Go to Project Settings → API
   - Copy `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - Copy `anon public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - Copy `service_role secret` key (SUPABASE_SERVICE_ROLE_KEY)

3. **Run migrations:**

   Open SQL Editor in your Supabase dashboard and run:

   First, copy and paste the contents of `supabase/migrations/001_initial_schema.sql` and execute.

   Then, copy and paste the contents of `supabase/migrations/002_seed_data.sql` and execute.

   This creates the database schema and seeds it with a demo agency (Northbeam Digital) and sample proposal.

### 2. Get Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an API key
3. Copy it (you'll need this as ANTHROPIC_API_KEY)

### 3. Deploy to Netlify

#### Option A: Using Netlify CLI (Fastest)

```bash
# Install Netlify CLI if you haven't already
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build the project
npm run build

# Deploy to production
netlify deploy --prod
```

When prompted:
- Choose "Create & configure a new site"
- Select your team
- Enter a site name (or leave blank for auto-generated)

After deployment, add environment variables:

```bash
netlify env:set ANTHROPIC_API_KEY "your_key_here"
netlify env:set NEXT_PUBLIC_SUPABASE_URL "your_supabase_url"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your_anon_key"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "your_service_role_key"
```

Redeploy:
```bash
netlify deploy --prod
```

#### Option B: Using Netlify Dashboard (Recommended for Git repos)

1. **Push your code to GitHub/GitLab**

2. **Go to [netlify.com](https://netlify.com)**

3. **Click "Add new site" → "Import an existing project"**

4. **Connect to your Git provider** and select the repo

5. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: (leave empty)

6. **Add environment variables** in Site settings → Environment variables:
   ```
   ANTHROPIC_API_KEY
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   ```

7. **Deploy!**

### 4. Verify Deployment

1. Visit your Netlify URL
2. Navigate to `/dashboard` — you should see the demo proposal
3. Click on the proposal to open the editor
4. Try generating a new proposal from `/new` using the demo transcript

### 5. Configure for Your Agency

Go to `/settings` and update:

- **Agency name** (replaces "Northbeam Digital")
- **Brand colors** (primary and secondary)
- **Website URL**
- **About blurb**
- **Tone instructions** ← MOST IMPORTANT for voice matching
- **Services** (your offerings with pricing)
- **Template sections** (reorder, enable/disable, edit instructions)
- **Default terms**
- **Currency**

Test by generating a new proposal and ensuring the output matches your brand voice.

## Environment Variables Reference

```env
# Required
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

## Troubleshooting

### Build fails on Netlify

**Error:** "Missing environment variables"
- Ensure all 4 environment variables are set in Netlify dashboard
- Redeploy after adding variables

**Error:** "Database connection failed"
- Verify Supabase URL and keys are correct
- Check that migrations have been run

### App loads but shows errors

**"Settings not found"**
- Migrations weren't run. Go to Supabase SQL Editor and run both migration files.

**"Failed to generate proposal"**
- Check Anthropic API key is valid
- Verify you have Claude Sonnet 4 access
- Check Netlify function logs for detailed error

**PDF export doesn't work**
- This is known to be slow on Netlify free tier
- Consider upgrading to Pro for better function timeout limits

### AI doesn't match agency voice

- Go to `/settings` → Tone instructions
- Be very specific: "Use short sentences. No buzzwords. Address client by first name. Lead with outcomes not process."
- Test with 2-3 different transcripts
- Iterate on template section instructions per section

## Custom Domain Setup

1. Go to Netlify Site settings → Domain management
2. Add custom domain
3. Configure DNS (Netlify provides instructions)
4. Enable HTTPS (automatic with Netlify)

## Post-Deployment: Client Handoff

Provide to client:
- [ ] Live URL
- [ ] Admin access (if auth added)
- [ ] Settings page walkthrough
- [ ] Training video (record a 10-min session)
- [ ] Support contact

## Ongoing Maintenance

- Monitor Anthropic API usage (costs)
- Check Supabase database size (free tier limits)
- Review Netlify function execution time
- Update settings as agency evolves

## Security Notes

**Important:**
- Never commit `.env` or `.env.local` to Git
- Keep service role key secure (it bypasses row-level security)
- Consider adding authentication for `/dashboard`, `/new`, `/proposal/*`, and `/settings`
- The `/` landing page and `/p/*` (public proposal view) should remain public

## Support

For deployment issues:
- Check [Netlify docs](https://docs.netlify.com)
- Check [Supabase docs](https://supabase.com/docs)
- Review build logs in Netlify dashboard
- Check Netlify function logs for runtime errors

---

**Ready to deploy? Run `npm run build` locally first to verify everything works, then deploy to Netlify!**
