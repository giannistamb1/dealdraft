-- Insert demo agency (Northbeam Digital)
INSERT INTO agency_settings (
  id,
  name,
  logo_url,
  primary_color,
  secondary_color,
  website,
  about_blurb,
  tone_instructions,
  services,
  template_sections,
  default_terms,
  currency
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Northbeam Digital',
  NULL,
  '#14213D',
  '#9A7B2D',
  'https://northbeamdigital.example',
  'We build digital products that drive revenue. No fluff, just results.',
  'Direct and confident. Use "we" and "our". No buzzwords. Lead with outcomes, not process. Keep sentences short. Address the client by name.',
  '[
    {
      "name": "Website Development",
      "description": "Custom websites built for conversion",
      "price_from": 15000,
      "unit": "project"
    },
    {
      "name": "E-commerce Platform",
      "description": "Full-featured online stores with payment integration",
      "price_from": 25000,
      "unit": "project"
    },
    {
      "name": "Brand Identity",
      "description": "Logo, guidelines, and visual system",
      "price_from": 8000,
      "unit": "project"
    },
    {
      "name": "Digital Strategy",
      "description": "Market research and positioning work",
      "price_from": 5000,
      "unit": "project"
    },
    {
      "name": "Ongoing Support",
      "description": "Monthly maintenance and updates",
      "price_from": 2000,
      "unit": "month"
    }
  ]'::jsonb,
  '[
    {
      "key": "cover",
      "title": "Cover",
      "instructions": "Keep it minimal. Just agency name, client name, proposal title, and date. No other content.",
      "enabled": true
    },
    {
      "key": "understanding",
      "title": "Understanding Your Situation",
      "instructions": "Mirror the client''s own words from the transcript. Quote their pain points verbatim where possible. Show you listened. 100 words max.",
      "enabled": true
    },
    {
      "key": "approach",
      "title": "Proposed Approach",
      "instructions": "Explain how we solve it. Address any objections they raised implicitly. Focus on outcomes. 120 words.",
      "enabled": true
    },
    {
      "key": "scope",
      "title": "Scope & Deliverables",
      "instructions": "Bulleted list. Only include what was discussed. Use their vocabulary for features. Be specific.",
      "enabled": true
    },
    {
      "key": "timeline",
      "title": "Timeline",
      "instructions": "Realistic phases with week ranges. Match any deadlines they mentioned.",
      "enabled": true
    },
    {
      "key": "investment",
      "title": "Investment",
      "instructions": "Anchor to budget signals if they exist. Break down by scope item. Show total clearly.",
      "enabled": true
    },
    {
      "key": "why",
      "title": "Why Northbeam",
      "instructions": "Three reasons, tied to what they care about based on the call. No generic claims.",
      "enabled": true
    },
    {
      "key": "terms",
      "title": "Terms & Next Steps",
      "instructions": "Payment terms from default_terms. Clear next action.",
      "enabled": true
    }
  ]'::jsonb,
  '50% upfront, 50% on completion. Proposal valid for 14 days. Work begins upon receipt of deposit and signed agreement.',
  'EUR'
);

-- Insert demo call transcript
INSERT INTO calls (
  id,
  client_name,
  client_company,
  transcript,
  source_label,
  extraction,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Sarah Chen',
  'Bloom & Co',
  'Sarah: Thanks for taking the time. So we're Bloom & Co, we do premium floral subscriptions in Amsterdam and Rotterdam. We launched two years ago, bootstrapped, doing about 400k ARR right now.

Agency: Congrats on the growth. What brings you to us?

Sarah: Our website. It's a Shopify theme we customized ourselves and it's… not great. Our conversion rate is 1.2% and we know that's low. We're losing people at checkout — the flow is confusing, and honestly the whole thing looks a bit cheap for a premium brand.

Agency: What's the goal?

Sarah: We want to 3x our revenue in the next 18 months. We've got the operations sorted, the product is strong, but we need the site to reflect that. Professional, clean, fast. And we need it to handle subscriptions properly — right now we're using a plugin that breaks half the time.

Agency: Any must-haves?

Sarah: Subscriptions have to work flawlessly. We need flexibility to offer custom arrangements — corporate clients want to customize colors, delivery days, that sort of thing. And we're planning to expand to Brussels and Antwerp next year, so multi-region support.

Agency: Timeline?

Sarah: We want to launch before Valentine's Day. That's our biggest sales period. So, realistically, we'd need to be live by end of January. That's about… 12 weeks?

Agency: Tight but doable. Budget?

Sarah: We've set aside 30k for this. Is that realistic?

Agency: For what you're describing, yes. Subscription logic, custom product builder, multi-region setup, that's solid scope. We'd probably come in around 28 to 32k depending on the product customization complexity.

Sarah: Okay good. One thing — we've been burned before by an agency. Took our deposit, missed every deadline, delivered something unusable. I need to know you'll actually ship this.

Agency: Understood. We do milestone-based contracts. You see working builds every two weeks. If we're not delivering, you know early.

Sarah: That works. And do you do brand work? Our logo is fine but we don't have a real style guide.

Agency: We do. Usually 8 to 10k for full brand identity. We could package that with the site build, give you a consistent system.

Sarah: Let's talk about that. Send me a proposal with both options — site only, and site + brand.

Agency: Will do. I'll have it to you by Thursday.

Sarah: Perfect. Thanks.',
  'Fireflies',
  '{
    "client_name": "Sarah Chen",
    "client_company": "Bloom & Co",
    "industry": "E-commerce (Floral subscriptions)",
    "pain_points": [
      {
        "point": "Low conversion rate (1.2%) due to confusing checkout flow",
        "quote": "Our conversion rate is 1.2% and we know that''s low. We're losing people at checkout — the flow is confusing",
        "inferred": false
      },
      {
        "point": "Website looks cheap for a premium brand",
        "quote": "honestly the whole thing looks a bit cheap for a premium brand",
        "inferred": false
      },
      {
        "point": "Current subscription plugin is unreliable",
        "quote": "right now we're using a plugin that breaks half the time",
        "inferred": false
      },
      {
        "point": "Previous agency experience was poor",
        "quote": "we've been burned before by an agency. Took our deposit, missed every deadline, delivered something unusable",
        "inferred": false
      }
    ],
    "goals": [
      "3x revenue in next 18 months",
      "Professional, clean, fast website that reflects premium positioning",
      "Flawless subscription handling",
      "Support for custom arrangements (corporate clients)",
      "Multi-region expansion (Brussels, Antwerp)"
    ],
    "scope_signals": [
      "Subscription system",
      "Custom product builder for arrangements",
      "Multi-region support",
      "Professional redesign",
      "Fast, optimized site"
    ],
    "budget_signals": "30k allocated, comfortable with 28-32k range",
    "timeline_signals": "12 weeks, must launch before Valentine''s Day (end of January)",
    "objections": [
      "Trust issues from previous bad agency experience",
      "Needs proof of delivery/shipping capability"
    ],
    "decision_makers": ["Sarah Chen"],
    "next_step_agreed": "Send proposal by Thursday with two options: site only, and site + brand package"
  }'::jsonb,
  NOW() - INTERVAL '2 days'
);

-- Insert demo proposal
INSERT INTO proposals (
  id,
  call_id,
  title,
  status,
  sections,
  pricing,
  valid_until,
  share_token,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Bloom & Co — E-commerce Platform Proposal',
  'draft',
  '[
    {
      "key": "cover",
      "title": "Cover",
      "content_md": "# Bloom & Co E-commerce Platform\n\n**Prepared for:** Sarah Chen, Bloom & Co  \n**Prepared by:** Northbeam Digital  \n**Date:** ' || TO_CHAR(CURRENT_DATE, 'DD Month YYYY') || '"
    },
    {
      "key": "understanding",
      "title": "Understanding Your Situation",
      "content_md": "Sarah, you said your current site \"looks a bit cheap for a premium brand\" and you're losing people at checkout. Your 1.2% conversion rate confirms it — the site isn't reflecting the quality of your product.\n\nYou're doing 400k ARR with a broken subscription plugin and a confusing flow. That means the fundamentals work. Fix the experience and you'll convert more of the traffic you already have.\n\nYou also mentioned being burned by an agency before. We get it. You need a partner who ships."
    },
    {
      "key": "approach",
      "title": "Proposed Approach",
      "content_md": "We'll rebuild your site as a custom platform — not a Shopify theme with plugins. This gives you full control over subscriptions, corporate customization, and multi-region logic.\n\nYou'll see working builds every two weeks. No surprises at the end. We'll design the checkout flow specifically to remove friction. And we'll make sure the site feels premium — fast load times, clean layouts, photography that matches your brand positioning.\n\nWe've done this for three other subscription businesses. The average conversion lift is 2.4x."
    },
    {
      "key": "scope",
      "title": "Scope & Deliverables",
      "content_md": "**Core Platform**\n- Custom e-commerce site with subscription engine\n- Product customization system (colors, delivery days, corporate options)\n- Multi-region support (NL + future BE expansion)\n- Checkout flow optimized for conversion\n- Admin dashboard for orders, subscriptions, and customization requests\n\n**Design**\n- Full site design (desktop + mobile)\n- Premium brand expression aligned with your positioning\n\n**Technical**\n- Headless CMS for content updates\n- Payment gateway integration (Stripe or Mollie)\n- Responsive, fast-loading frontend\n- Hosting setup and deployment\n\n**Delivery**\n- Staging site for review\n- Training session for your team\n- 30-day post-launch support"
    },
    {
      "key": "timeline",
      "title": "Timeline",
      "content_md": "**12-week delivery to meet your Valentine's deadline**\n\n- **Weeks 1–2:** Discovery, architecture, design concepts\n- **Weeks 3–5:** Design finalization, frontend build begins\n- **Weeks 6–8:** Subscription system, product customizer, checkout flow\n- **Weeks 9–10:** Admin dashboard, multi-region setup, content migration\n- **Weeks 11–12:** Testing, training, launch\n\n**Key date:** Live by January 28"
    },
    {
      "key": "investment",
      "title": "Investment",
      "content_md": "This proposal reflects the scope we discussed and stays within your allocated budget.\n\n*See pricing table below*"
    },
    {
      "key": "why",
      "title": "Why Northbeam",
      "content_md": "**1. We ship on time.** Milestone-based contracts mean you see progress every two weeks. No missed deadlines.\n\n**2. We've built subscription platforms before.** We know the edge cases — failed payments, plan changes, corporate billing. We'll handle it.\n\n**3. We care about conversion.** This isn't a design project. It's a revenue project. We'll optimize the experience to turn visitors into customers."
    },
    {
      "key": "terms",
      "title": "Terms & Next Steps",
      "content_md": "**Payment terms:** 50% upfront (€14,500), 50% on completion (€14,500)\n\n**Validity:** This proposal is valid for 14 days.\n\n**Next step:** Reply to this proposal to move forward. We'll send the contract and kick off discovery the week you're ready.\n\nLooking forward to working with you."
    }
  ]'::jsonb,
  '[
    {
      "item": "E-commerce Platform Development",
      "description": "Custom subscription site with product customizer and multi-region support",
      "qty": 1,
      "unit_price": 25000,
      "total": 25000
    },
    {
      "item": "Premium Design System",
      "description": "Full site design (desktop + mobile)",
      "qty": 1,
      "unit_price": 4000,
      "total": 4000
    }
  ]'::jsonb,
  CURRENT_DATE + INTERVAL '14 days',
  '10000000-0000-0000-0000-000000000001',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
);

-- Insert activity for the demo proposal
INSERT INTO activity (proposal_id, event, meta, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 'created', '{"user": "system", "note": "Demo proposal"}'::jsonb, NOW() - INTERVAL '1 day');
