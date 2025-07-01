-- Fix for duplicate email error in user creation trigger
-- This script updates the trigger to handle cases where a user already exists in public.users

-- Drop the existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the existing function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function that handles duplicate emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert new user into public.users table
  -- Use ON CONFLICT to handle duplicate emails gracefully
  INSERT INTO public.users (
    id,
    email,
    full_name,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new.created_at,
    new.created_at
  )
  ON CONFLICT (email) 
  DO UPDATE SET
    -- Update the existing record if email already exists
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    updated_at = NOW()
  WHERE public.users.id = new.id; -- Only update if it's the same user ID
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also update the unique constraint to be case-insensitive
-- First, drop the existing constraint
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_email_key;

-- Create a unique index on lowercase email
CREATE UNIQUE INDEX users_email_unique_idx ON public.users (LOWER(email));

-- Add a check constraint to ensure emails are stored in lowercase
ALTER TABLE public.users ADD CONSTRAINT users_email_lowercase_check 
  CHECK (email = LOWER(email));

-- Update any existing emails to lowercase (if any)
UPDATE public.users SET email = LOWER(email) WHERE email != LOWER(email);