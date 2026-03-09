-- Run this in your Supabase SQL Editor to initialize the database schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create candidates table
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  party TEXT NOT NULL,
  constituency TEXT NOT NULL,
  education TEXT,
  "criminalCases" INTEGER DEFAULT 0,
  assets FLOAT DEFAULT 0,
  liabilities FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: The column names here are in double quotes for camelCase, 
-- but it's often better to just use snake_case in Supabase. 
-- However, we match the prompt's Prisma schema fields exactly:
-- 'criminalCases', 'assets', 'liabilities'

-- Seed candidates
INSERT INTO candidates (name, party, constituency, education, "criminalCases", assets, liabilities)
VALUES 
  ('Narendra Modi', 'BJP', 'Varanasi', 'Post Graduate (MA)', 0, 30000000, 0),
  ('Rahul Gandhi', 'INC', 'Wayanad', 'M.Phil', 5, 200000000, 2000000),
  ('Arvind Kejriwal', 'AAP', 'New Delhi', 'B.Tech', 15, 34000000, 0),
  ('Mamata Banerjee', 'AITC', 'Bhabanipur', 'MA, LLB', 0, 16000000, 0);
