-- Test auth users for awards-platform (Supabase SQL Editor)
-- Prerequisite: supabase.sql (schema). Optional: supabase-rls.sql, supabase-storage.sql
--
-- Seeds auth.users + auth.identities only. Does not insert profiles, awards, or applications.
-- After sign-in, create matching public.profiles rows (or use your app signup flow).
--
-- Password for all accounts: TestPassword123!
--   admin@uoguelph.ca    — intended admin
--   reviewer@uoguelph.ca — intended reviewer
--   student1@uoguelph.ca — intended student
--   student2@uoguelph.ca — intended student
--
-- Re-running: removes these four auth users (and identities), then re-inserts.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Cleanup (mock auth users only; clears dependent rows for these IDs if present)
-- ---------------------------------------------------------------------------
DELETE FROM public.reviews
WHERE reviewer_id IN (
  'aaaaaaaa-0002-0002-0002-000000000002'
)
OR application_id IN (
  SELECT id FROM public.applications
  WHERE student_id IN (
    'aaaaaaaa-0003-0003-0003-000000000003',
    'aaaaaaaa-0004-0004-0004-000000000004'
  )
);

DELETE FROM public.applications
WHERE student_id IN (
  'aaaaaaaa-0003-0003-0003-000000000003',
  'aaaaaaaa-0004-0004-0004-000000000004'
);

DELETE FROM public.profiles
WHERE id IN (
  'aaaaaaaa-0001-0001-0001-000000000001',
  'aaaaaaaa-0002-0002-0002-000000000002',
  'aaaaaaaa-0003-0003-0003-000000000003',
  'aaaaaaaa-0004-0004-0004-000000000004'
);

DELETE FROM auth.identities
WHERE user_id IN (
  'aaaaaaaa-0001-0001-0001-000000000001',
  'aaaaaaaa-0002-0002-0002-000000000002',
  'aaaaaaaa-0003-0003-0003-000000000003',
  'aaaaaaaa-0004-0004-0004-000000000004'
);

DELETE FROM auth.users
WHERE id IN (
  'aaaaaaaa-0001-0001-0001-000000000001',
  'aaaaaaaa-0002-0002-0002-000000000002',
  'aaaaaaaa-0003-0003-0003-000000000003',
  'aaaaaaaa-0004-0004-0004-000000000004'
);

-- ---------------------------------------------------------------------------
-- Auth users
-- ---------------------------------------------------------------------------
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
)
VALUES
  (
    'aaaaaaaa-0001-0001-0001-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@uoguelph.ca',
    crypt('TestPassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Alex Admin"}',
    false
  ),
  (
    'aaaaaaaa-0002-0002-0002-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'reviewer@uoguelph.ca',
    crypt('TestPassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Riley Reviewer"}',
    false
  ),
  (
    'aaaaaaaa-0003-0003-0003-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'student1@uoguelph.ca',
    crypt('TestPassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Sam Student"}',
    false
  ),
  (
    'aaaaaaaa-0004-0004-0004-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'student2@uoguelph.ca',
    crypt('TestPassword123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Jordan Lee"}',
    false
  );

INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
VALUES
  (
    'aaaaaaaa-0001-0001-0001-000000000001',
    'aaaaaaaa-0001-0001-0001-000000000001',
    'aaaaaaaa-0001-0001-0001-000000000001',
    '{"sub":"aaaaaaaa-0001-0001-0001-000000000001","email":"admin@uoguelph.ca"}'::jsonb,
    'email',
    now(),
    now(),
    now()
  ),
  (
    'aaaaaaaa-0002-0002-0002-000000000002',
    'aaaaaaaa-0002-0002-0002-000000000002',
    'aaaaaaaa-0002-0002-0002-000000000002',
    '{"sub":"aaaaaaaa-0002-0002-0002-000000000002","email":"reviewer@uoguelph.ca"}'::jsonb,
    'email',
    now(),
    now(),
    now()
  ),
  (
    'aaaaaaaa-0003-0003-0003-000000000003',
    'aaaaaaaa-0003-0003-0003-000000000003',
    'aaaaaaaa-0003-0003-0003-000000000003',
    '{"sub":"aaaaaaaa-0003-0003-0003-000000000003","email":"student1@uoguelph.ca"}'::jsonb,
    'email',
    now(),
    now(),
    now()
  ),
  (
    'aaaaaaaa-0004-0004-0004-000000000004',
    'aaaaaaaa-0004-0004-0004-000000000004',
    'aaaaaaaa-0004-0004-0004-000000000004',
    '{"sub":"aaaaaaaa-0004-0004-0004-000000000004","email":"student2@uoguelph.ca"}'::jsonb,
    'email',
    now(),
    now(),
    now()
  );
