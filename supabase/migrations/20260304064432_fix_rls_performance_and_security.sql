/*
  # Fix RLS Performance and Security Issues

  ## Overview
  This migration addresses critical RLS performance optimizations and security improvements
  identified in the security audit.

  ## Changes

  ### 1. RLS Policy Optimization
  All RLS policies updated to use `(select auth.uid())` instead of `auth.uid()` to prevent
  re-evaluation on every row, significantly improving query performance at scale.

  **Affected policies:**
  - user_profiles: view, create, update, delete policies
  - user_sessions: view, create, update, delete policies

  ### 2. Function Security
  Updated `update_updated_at_column()` function with immutable search_path to prevent
  potential security vulnerabilities from role-mutable search paths.

  ### 3. Index Cleanup
  Removed unused indexes that were not being utilized:
  - idx_user_sessions_user_id (redundant with FK index)
  - idx_user_sessions_created_at (not used in current queries)
  - idx_user_profiles_subscription_tier (not used in current queries)

  ## Performance Impact
  - RLS policies now evaluate auth.uid() once per query instead of per row
  - Reduced index overhead
  - More secure function execution context

  ## Security Impact
  - Function search_path now immutable, preventing potential exploits
  - RLS policies maintain same security guarantees with better performance
*/

-- Drop existing RLS policies for user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

-- Drop existing RLS policies for user_sessions
DROP POLICY IF EXISTS "Users can view own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can create own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON user_sessions;

-- Create optimized RLS policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can create own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can delete own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (id = (select auth.uid()));

-- Create optimized RLS policies for user_sessions
CREATE POLICY "Users can view own sessions"
  ON user_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create own sessions"
  ON user_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own sessions"
  ON user_sessions
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own sessions"
  ON user_sessions
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix function search_path security issue
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Drop unused indexes
DROP INDEX IF EXISTS idx_user_sessions_user_id;
DROP INDEX IF EXISTS idx_user_sessions_created_at;
DROP INDEX IF EXISTS idx_user_profiles_subscription_tier;