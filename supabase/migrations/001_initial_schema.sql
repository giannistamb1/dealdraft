-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Agency Settings table (singleton)
CREATE TABLE agency_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#14213D',
  secondary_color TEXT NOT NULL DEFAULT '#9A7B2D',
  website TEXT,
  about_blurb TEXT,
  tone_instructions TEXT,
  services JSONB DEFAULT '[]'::jsonb,
  template_sections JSONB DEFAULT '[]'::jsonb,
  default_terms TEXT,
  currency TEXT NOT NULL DEFAULT 'EUR',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Calls table
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT,
  client_company TEXT,
  transcript TEXT NOT NULL,
  source_label TEXT,
  extraction JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Proposals table
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_id UUID REFERENCES calls(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'declined')),
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  pricing JSONB NOT NULL DEFAULT '[]'::jsonb,
  valid_until DATE,
  share_token UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
  client_viewed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activity table
CREATE TABLE activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  event TEXT NOT NULL CHECK (event IN ('created', 'exported', 'link_opened', 'accepted')),
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_calls_created_at ON calls(created_at DESC);
CREATE INDEX idx_proposals_call_id ON proposals(call_id);
CREATE INDEX idx_proposals_share_token ON proposals(share_token);
CREATE INDEX idx_proposals_created_at ON proposals(created_at DESC);
CREATE INDEX idx_activity_proposal_id ON activity(proposal_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_agency_settings_updated_at BEFORE UPDATE ON agency_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
