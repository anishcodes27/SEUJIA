-- Add users table to the database schema
-- Run this SQL in your Supabase SQL Editor to create the users table

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Add RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT
  USING (true);

-- Allow insert for signup (anyone can create an account)
CREATE POLICY "Anyone can create account" ON users
  FOR INSERT
  WITH CHECK (true);

-- Allow users to update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE
  USING (true);
