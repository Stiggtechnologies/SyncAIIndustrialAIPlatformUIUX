/*
  # Create SyncAI User Profiles and Session Tracking

  ## Overview
  This migration establishes the core data infrastructure for the SyncAI platform,
  including user profiles, session tracking, and trial management.

  ## New Tables

  ### `user_profiles`
  Stores extended user information beyond basic auth data
  - `id` (uuid, primary key) - References auth.users
  - `full_name` (text) - User's full name
  - `company` (text) - Company name
  - `role` (text) - User's role (reliability engineer, executive, etc.)
  - `industry` (text) - Industry sector
  - `trial_sessions_remaining` (integer) - Sessions left in trial
  - `trial_sessions_used` (integer) - Total sessions consumed
  - `subscription_tier` (text) - explorer, professional, or enterprise
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update

  ### `user_sessions`
  Tracks each user interaction session for analytics and trial management
  - `id` (uuid, primary key) - Unique session identifier
  - `user_id` (uuid) - References user_profiles
  - `session_type` (text) - Type: chat, analysis, report
  - `query_text` (text) - User's query or input
  - `executive_mode` (boolean) - Whether executive view was active
  - `session_duration` (integer) - Duration in seconds
  - `created_at` (timestamptz) - Session timestamp

  ## Security

  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Users can only access their own data
  - Strict authentication requirements on all operations

  ### Policies
  - SELECT: Users can view only their own records
  - INSERT: Users can create their own records
  - UPDATE: Users can update only their own records
  - DELETE: Users can delete only their own records

  ## Important Notes
  - Default trial: 10 sessions for all new users
  - Session tracking supports conversion analytics
  - All timestamps use UTC timezone
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  company text NOT NULL,
  role text NOT NULL,
  industry text NOT NULL,
  trial_sessions_remaining integer DEFAULT 10 NOT NULL,
  trial_sessions_used integer DEFAULT 0 NOT NULL,
  subscription_tier text DEFAULT 'explorer' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_subscription_tier CHECK (subscription_tier IN ('explorer', 'professional', 'enterprise')),
  CONSTRAINT valid_trial_sessions CHECK (trial_sessions_remaining >= 0 AND trial_sessions_used >= 0)
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  session_type text DEFAULT 'chat' NOT NULL,
  query_text text,
  executive_mode boolean DEFAULT false NOT NULL,
  session_duration integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_session_type CHECK (session_type IN ('chat', 'analysis', 'report'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_tier ON user_profiles(subscription_tier);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can create own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for user_sessions

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions"
  ON user_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can create their own sessions
CREATE POLICY "Users can create own sessions"
  ON user_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own sessions
CREATE POLICY "Users can update own sessions"
  ON user_sessions
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own sessions
CREATE POLICY "Users can delete own sessions"
  ON user_sessions
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user_profiles updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
