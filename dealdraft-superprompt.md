# SUPER PROMPT — Build "DealDraft" MVP (Sales Call → Branded Proposal, for Agencies)

Paste everything below this line into Claude Code as a single prompt.

---

You are building a complete, deployable MVP called **DealDraft** in one session. Read this entire brief before writing any code. Build exactly what is in scope, nothing more.

## 1. Product definition

**DealDraft** (tagline: "From sales call to signed-ready proposal in 10 minutes.") turns an agency's sales-call transcript into a polished, branded proposal draft in the agency's own template. The agency pastes or uploads a call transcript → DealDraft extracts the client, their pain points, scope, budget signals, and timeline → generates a structured proposal → the agency edits it in a clean editor → exports a PDF or shares a web link the client can view.

Business model (do NOT build billing): sold as a done-for-you setup (€1–2k) + monthly maintenance per agency. The MVP is a **single-tenant** app: one agency per deployment, configured via a settings page. This is deliberate — each sale is a deployment.

**The single most important product behavior:** the generated proposal must sound like *the agency wrote it*, in their voice, with their section structure — not like generic AI output. The template + tone configuration is the product.

## 2. Tech stack (do not deviate)

- **Next.js 15 (App Router, TypeScript)** — app + API routes
- **Supabase** — Postgres + Auth (email magic link) + Storage (logos, exported PDFs)
- **Anthropic API (claude-sonnet-4-6)** — extraction + proposal generation + section rewriting
- **@react-pdf/renderer** — PDF export (server-side route)
- **Tailwind CSS** — styling per section 7

Env vars: `ANTHROPIC_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. Provide `.env.example` + README.

Audio transcription is OUT of scope for v1 — the input is a pasted transcript (from Fireflies, Fathom, Teams, Zoom, etc.). Add a disabled "Upload recording (coming soon)" control so buyers see the roadmap.

## 3. Data model (Supabase migrations — write the SQL)

```
agency_settings   id (singleton row), name, logo_url, primary_color, secondary_color,
                  website, about_blurb, tone_instructions text,   -- e.g. "direct, no fluff, we/our voice"
                  services jsonb,        -- [{name, description, price_from, unit}]
                  template_sections jsonb, -- ordered [{key, title, instructions, enabled}]
                  default_terms text, currency default 'EUR'

calls             id, client_name, client_company, transcript text, source_label,
                  extraction jsonb,      -- see section 4
                  created_at

proposals         id, call_id, title, status ('draft'|'sent'|'accepted'|'declined'),
                  sections jsonb,        -- ordered [{key, title, content_md}]
                  pricing jsonb,         -- [{item, description, qty, unit_price, total}]
                  valid_until date, share_token uuid unique, client_viewed_at,
                  accepted_at, created_at, updated_at

activity          id, proposal_id, event ('created'|'exported'|'link_opened'|'accepted'), meta jsonb, created_at
```

Default `template_sections` seed (agency can edit): Cover, Understanding Your Situation, Proposed Approach, Scope & Deliverables, Timeline, Investment, Why {Agency}, Terms & Next Step.

## 4. AI pipeline

**Step 1 — Extraction** (one Claude call, strict JSON). From the transcript extract: `client_name, client_company, industry, pain_points[] (verbatim-grounded, each with a supporting quote), goals[], scope_signals[], budget_signals, timeline_signals, objections[], decision_makers[], next_step_agreed`. Instruct the model: "Only extract what is actually supported by the transcript. Mark anything inferred as `inferred: true`. Never invent budget numbers."

**Step 2 — Proposal generation** (one Claude call per proposal). System prompt is assembled from `agency_settings`: name, about, services with pricing, tone_instructions, template_sections with their per-section instructions. User content is the extraction JSON + full transcript. Output: strict JSON matching `sections` + `pricing`. Rules to embed: mirror the client's own vocabulary from the transcript in "Understanding Your Situation"; pull scope items only from scope_signals + the agency's service list; if budget signals exist, anchor pricing near them, otherwise use the agency's price_from values; keep every section under 150 words except Scope; write in the agency's tone_instructions voice; address objections implicitly in "Proposed Approach" without naming them.

**Step 3 — Section rewrite** (editor feature): each section has a "Rewrite" action with a small instruction input («shorter», «more formal», «add a phased option»). One Claude call, returns only that section.

## 5. Pages

- **`/` Landing page** (English — agencies are the buyer, and this doubles as the sales page). Hero: the tagline + a two-panel visual: left a messy transcript snippet, right the polished proposal cover it became. Sections: how it works (3 steps: Paste → Review → Send), "Your template, your voice" (screenshot of settings), the math («Your team writes 8 proposals/month × 3 hours each. DealDraft makes it 20 minutes.»), CTA: "Book a setup call" (mailto link).
- **`/dashboard`** — proposals table: client, title, status pill, value, last activity, viewed indicator. "New proposal" button.
- **`/new`** — paste transcript (big textarea), client name/company fields (prefill from extraction after processing), "Generate proposal" → processing state with staged messages ("Reading the call…", "Extracting scope…", "Writing in your voice…") → redirect to editor.
- **`/proposal/[id]`** — the editor. Left: section list (reorder, toggle). Center: section-by-section editing (markdown-lite, inline), pricing table editor with auto-totals. Right rail: extraction insights panel (pain points with quotes, budget signals) so the human can check the draft against the call. Header actions: Export PDF, Copy share link, status selector.
- **`/p/[share_token]`** — public client view: clean read-only proposal with agency branding, sticky "Accept proposal" button → records `accepted_at`, shows confirmation. Log `link_opened` on first view.
- **`/settings`** — agency branding (logo upload to Supabase Storage, colors), tone instructions, services list editor, template sections editor, terms.

Seed the database with one demo agency (use a fictional agency, e.g. "Northbeam Digital") and one demo transcript + generated proposal so the app demos instantly.

## 6. Out of scope — do NOT build

No billing. No multi-tenant/orgs. No audio upload or transcription. No e-signature (the Accept button + timestamp is enough for v1). No CRM integrations. No email sending (share link is copied manually). No versioning/history beyond updated_at.

## 7. Brand & design system

**Name:** DealDraft. **Voice:** confident operator, zero hype — this is a tool for people who close.

Avoid the default AI-SaaS look (dark background + neon accent, or cream + terracotta). Direction: **"signature-ready"** — the visual language of contracts, letterheads, and fountain-pen ink.

- Palette: `--ink #14213D` (oxford ink, primary), `--bond #F7F6F2` (bond-paper background), `--brass #9A7B2D` (muted brass accent for CTAs and the accepted state — never yellow-bright), `--carbon #6B7280` (secondary text), `--accept #1F7A5C` (accepted/success).
- Type: display **"Libre Caslon Text"** for headlines (contract gravitas), body **"Inter"**, and **"Spline Sans Mono"** for pricing tables and totals.
- Signature element: proposals and proposal cards carry a **letterhead rule** — a double hairline (1px + 3px gap + 1px) under the agency name/logo, and the Accept button renders as a **signature line**: a baseline rule with "Accept proposal" set above it like a countersignature. This is the one memorable motif; keep everything else restrained.
- In the client view (`/p/[token]`), the agency's own `primary_color` overrides `--ink` so every deployment looks native to that agency.
- Logo: wordmark "DealDraft" in Libre Caslon, the two D's connected by a single underline stroke (the signature line). Inline SVG.

## 8. Acceptance criteria

1. `npm run dev` + seeded demo data: I can open the demo proposal, edit a section, rewrite a section with an instruction, export a correct PDF, and open the public share view — with only `ANTHROPIC_API_KEY` and Supabase keys set.
2. Pasting a fresh transcript produces a complete proposal in under ~60 seconds with all enabled template sections populated and a pricing table.
3. The extraction insights panel shows pain points with verbatim quotes from the transcript.
4. PDF export matches the web proposal (branding, sections, pricing, letterhead rule).
5. README covers env setup, Supabase migrations, storage bucket setup, and "how to configure a new agency" (the deployment playbook — this is the sales asset).

Build it now. Start with the schema + seed, then the AI pipeline with the demo transcript, then the editor, then PDF export, then landing page.
