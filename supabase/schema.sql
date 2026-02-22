-- Slid Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Slids table (invoices with agreements)
CREATE TABLE slids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  short_id VARCHAR(10) UNIQUE NOT NULL,
  
  -- Creator (freelancer/business)
  creator_address VARCHAR(42) NOT NULL,
  
  -- Client
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255),
  client_address VARCHAR(42), -- filled when they connect wallet to pay
  
  -- Invoice details
  amount DECIMAL(18, 6) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USDC',
  description TEXT NOT NULL,
  
  -- Agreement (optional)
  scope TEXT,
  terms TEXT,
  
  -- Status tracking
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'paid', 'expired', 'cancelled')),
  
  -- Payment
  tx_hash VARCHAR(66),
  paid_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Indexes for fast lookups
CREATE INDEX idx_slids_short_id ON slids(short_id);
CREATE INDEX idx_slids_creator ON slids(creator_address);
CREATE INDEX idx_slids_status ON slids(status);
CREATE INDEX idx_slids_created ON slids(created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER slids_updated_at
  BEFORE UPDATE ON slids
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE slids ENABLE ROW LEVEL SECURITY;

-- Anyone can view a slid by short_id (for pay page)
CREATE POLICY "Public can view slids by short_id" ON slids
  FOR SELECT
  USING (true);

-- Anyone can create a slid (we verify wallet sig in app)
CREATE POLICY "Anyone can create slids" ON slids
  FOR INSERT
  WITH CHECK (true);

-- Anyone can update (we verify wallet sig in app)
CREATE POLICY "Anyone can update slids" ON slids
  FOR UPDATE
  USING (true);

-- Grant permissions
GRANT ALL ON slids TO anon;
GRANT ALL ON slids TO authenticated;
