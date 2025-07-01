-- Create Admin User Script
-- This script creates a default admin user for the Wee Project

-- Note: This uses Supabase Auth to create the user
-- You need to run this in Supabase SQL Editor

-- Step 1: Create auth user (Supabase will handle password hashing)
-- Replace the password with a secure one before running in production
DO $$
DECLARE
    user_id uuid;
BEGIN
    -- Create user in auth.users
    -- Note: In Supabase, you typically create users through the Dashboard or API
    -- This is a placeholder to show the required data
    
    -- For manual creation, use Supabase Dashboard:
    -- 1. Go to Authentication > Users
    -- 2. Click "Add user"
    -- 3. Use these credentials:
    --    Email: admin@weeproject.kr
    --    Password: WeeAdmin2024!@#
    
    -- After creating the user in Supabase Dashboard, get the user ID and run:
    -- UPDATE public.users SET role = 'admin' WHERE email = 'admin@weeproject.kr';
    
    RAISE NOTICE 'Please create user manually in Supabase Dashboard with:';
    RAISE NOTICE 'Email: admin@weeproject.kr';
    RAISE NOTICE 'Password: WeeAdmin2024!@#';
    RAISE NOTICE 'Then run the UPDATE statement below';
END $$;

-- Step 2: After creating user in Supabase Dashboard, update the role
-- Uncomment and run this after creating the user:
/*
UPDATE public.users 
SET 
    role = 'admin',
    full_name = 'System Administrator',
    organization = 'Wee Project',
    department = 'IT Department',
    position = 'System Admin',
    is_active = true,
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'admin@weeproject.kr';
*/

-- Step 3: Verify admin user creation
/*
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.role,
    u.organization,
    u.created_at
FROM public.users u
WHERE u.email = 'admin@weeproject.kr';
*/

-- Alternative: Create additional admin users
-- Use this template for creating more admin accounts:
/*
-- Manager account
UPDATE public.users 
SET 
    role = 'manager',
    full_name = 'Project Manager',
    organization = 'Wee Project',
    department = 'Management',
    position = 'Manager',
    is_active = true,
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'manager@weeproject.kr';

-- Counselor account
UPDATE public.users 
SET 
    role = 'counselor',
    full_name = 'Wee Counselor',
    organization = 'Wee Center',
    department = 'Counseling',
    position = 'Senior Counselor',
    is_active = true,
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'counselor@weeproject.kr';
*/

-- Admin User Credentials:
-- Email: admin@weeproject.kr
-- Password: WeeAdmin2024!@#
-- Role: admin (시스템 관리자)

-- IMPORTANT SECURITY NOTES:
-- 1. Change the password immediately after first login
-- 2. Use a strong, unique password in production
-- 3. Enable 2FA if available
-- 4. Never commit actual passwords to version control