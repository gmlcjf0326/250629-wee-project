-- 사용자를 관리자로 설정하는 SQL 쿼리
-- Supabase SQL Editor에서 실행하세요

-- 1. 사용자 확인 (먼저 실행하여 사용자가 존재하는지 확인)
SELECT id, email, role, full_name, created_at 
FROM public.users 
WHERE email = 'gmlcjf0326@hanmail.net';

-- 2. 사용자를 관리자로 업데이트
UPDATE public.users 
SET 
    role = 'admin',
    full_name = 'Administrator',
    is_active = true,
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'gmlcjf0326@hanmail.net';

-- 3. 업데이트 확인
SELECT id, email, role, full_name, is_active, updated_at 
FROM public.users 
WHERE email = 'gmlcjf0326@hanmail.net';

-- 결과 확인 후 정상적으로 role이 'admin'으로 변경되었는지 확인하세요