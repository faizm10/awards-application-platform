-- Mock data for awards-platform (Supabase SQL Editor)
-- Prerequisite: supabase.sql, then supabase-rls.sql (without RLS the app returns no awards).
--
-- Test logins (password for all): TestPassword123!
--   admin@uoguelph.ca     — admin
--   reviewer@uoguelph.ca    — reviewer (committee: Engineering)
--   student1@uoguelph.ca  — student
--   student2@uoguelph.ca  — student
--
-- Re-running: clears mock rows by fixed IDs/emails, then re-inserts.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Cleanup (mock data only)
-- ---------------------------------------------------------------------------
DELETE FROM public.reviews
WHERE application_id IN (
  'cccccccc-0001-0001-0001-000000000001',
  'cccccccc-0002-0002-0002-000000000002',
  'cccccccc-0003-0003-0003-000000000003'
);

DELETE FROM public.applications
WHERE id IN (
  'cccccccc-0001-0001-0001-000000000001',
  'cccccccc-0002-0002-0002-000000000002',
  'cccccccc-0003-0003-0003-000000000003'
);

DELETE FROM public.award_required_fields
WHERE award_id IN (
  'bbbbbbbb-0001-0001-0001-000000000001',
  'bbbbbbbb-0002-0002-0002-000000000002',
  'bbbbbbbb-0003-0003-0003-000000000003',
  'bbbbbbbb-0004-0004-0004-000000000004'
);

DELETE FROM public.awards
WHERE id IN (
  'bbbbbbbb-0001-0001-0001-000000000001',
  'bbbbbbbb-0002-0002-0002-000000000002',
  'bbbbbbbb-0003-0003-0003-000000000003',
  'bbbbbbbb-0004-0004-0004-000000000004'
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
-- Auth users (required before profiles)
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

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
INSERT INTO public.profiles (id, email, full_name, user_type, committee)
VALUES
  ('aaaaaaaa-0001-0001-0001-000000000001', 'admin@uoguelph.ca', 'Alex Admin', 'admin', NULL),
  ('aaaaaaaa-0002-0002-0002-000000000002', 'reviewer@uoguelph.ca', 'Riley Reviewer', 'reviewer', 'Engineering'),
  ('aaaaaaaa-0003-0003-0003-000000000003', 'student1@uoguelph.ca', 'Sam Student', 'student', NULL),
  ('aaaaaaaa-0004-0004-0004-000000000004', 'student2@uoguelph.ca', 'Jordan Lee', 'student', NULL);

-- ---------------------------------------------------------------------------
-- Awards
-- ---------------------------------------------------------------------------
INSERT INTO public.awards (
  id, title, code, donor, value, deadline, citizenship,
  description, eligibility, category, is_active
)
VALUES
  (
    'bbbbbbbb-0001-0001-0001-000000000001',
    'Excellence in Engineering Scholarship',
    'ENG-EXCELLENCE-2026',
    'College of Engineering and Physical Sciences',
    '$5,000',
    '2026-09-15',
    ARRAY['Canadian citizen', 'Permanent resident'],
    'Recognizes outstanding academic achievement in engineering programs.',
    'Minimum 3.7 GPA. Full-time enrollment in an engineering program. Second year or above.',
    'scholarship',
    true
  ),
  (
    'bbbbbbbb-0002-0002-0002-000000000002',
    'Community Leadership Award',
    'COMM-LEAD-2026',
    'Office of Student Experience',
    '$2,500',
    '2026-10-01',
    ARRAY['Canadian citizen', 'International student'],
    'For students demonstrating exceptional community service and leadership.',
    'Minimum 100 hours of documented community service. Good academic standing (3.0+ GPA).',
    'prize',
    true
  ),
  (
    'bbbbbbbb-0003-0003-0003-000000000003',
    'Research Innovation Grant',
    'RES-INNOV-2026',
    'Office of Research',
    '$3,000',
    '2026-08-30',
    ARRAY['Canadian citizen', 'Permanent resident', 'International student'],
    'Supports undergraduate research projects with innovative potential.',
    'Faculty supervisor required. Research proposal and budget outline. Minimum 3.5 GPA.',
    'grant',
    true
  ),
  (
    'bbbbbbbb-0004-0004-0004-000000000004',
    'International Student Excellence Award',
    'INTL-EXCEL-2026',
    'International Student Services',
    '$4,000',
    '2026-11-01',
    ARRAY['International student'],
    'Supporting international students with outstanding academic records.',
    'International student status. Minimum 3.6 GPA. Cultural leadership or community engagement.',
    'scholarship',
    true
  );

-- ---------------------------------------------------------------------------
-- Award required fields
-- ---------------------------------------------------------------------------
INSERT INTO public.award_required_fields (
  id, award_id, field_name, label, type, required, question, description
)
VALUES
  (
    'dddddddd-0001-0001-0001-000000000001',
    'bbbbbbbb-0001-0001-0001-000000000001',
    'response_text',
    'Personal statement',
    'textarea',
    true,
    'Why do you deserve this scholarship?',
    'Maximum 500 words.'
  ),
  (
    'dddddddd-0002-0002-0002-000000000002',
    'bbbbbbbb-0001-0001-0001-000000000001',
    'resume_url',
    'Resume',
    'file',
    true,
    'Upload your current resume',
    'PDF preferred.'
  ),
  (
    'dddddddd-0003-0003-0003-000000000003',
    'bbbbbbbb-0002-0002-0002-000000000002',
    'response_text',
    'Leadership essay',
    'textarea',
    true,
    'Describe your most impactful community leadership experience.',
    NULL
  ),
  (
    'dddddddd-0004-0004-0004-000000000004',
    'bbbbbbbb-0003-0003-0003-000000000003',
    'response_text',
    'Research summary',
    'textarea',
    true,
    'Summarize your proposed research project.',
    NULL
  ),
  (
    'dddddddd-0005-0005-0005-000000000005',
    'bbbbbbbb-0003-0003-0003-000000000003',
    'budget',
    'Project budget',
    'text',
    true,
    'Provide an itemized budget for grant funds.',
    NULL
  ),
  (
    'dddddddd-0006-0006-0006-000000000006',
    'bbbbbbbb-0004-0004-0004-000000000004',
    'response_text',
    'Cultural leadership essay',
    'textarea',
    true,
    'How have you contributed to campus or community as an international student?',
    NULL
  );

-- ---------------------------------------------------------------------------
-- Applications
-- ---------------------------------------------------------------------------
INSERT INTO public.applications (
  id, award_id, student_id, status,
  first_name, last_name, student_id_text, major_program, credits_completed, email,
  response_text, resume_url, submitted_at,
  essay_responses
)
VALUES
  (
    'cccccccc-0001-0001-0001-000000000001',
    'bbbbbbbb-0001-0001-0001-000000000001',
    'aaaaaaaa-0003-0003-0003-000000000003',
    'submitted',
    'Sam',
    'Student',
    '1234567',
    'Computer Engineering',
    '60',
    'student1@uoguelph.ca',
    'I have maintained a 3.8 GPA while leading the engineering mentorship program and volunteering with local STEM outreach.',
    NULL,
    now() - interval '5 days',
    '{"response_text":"I have maintained a 3.8 GPA while leading the engineering mentorship program."}'::jsonb
  ),
  (
    'cccccccc-0002-0002-0002-000000000002',
    'bbbbbbbb-0002-0002-0002-000000000002',
    'aaaaaaaa-0003-0003-0003-000000000003',
    'under_review',
    'Sam',
    'Student',
    '1234567',
    'Computer Engineering',
    '60',
    'student1@uoguelph.ca',
    'Over the past two years I coordinated a food bank drive and mentored first-year students.',
    NULL,
    now() - interval '12 days',
    '{}'::jsonb
  ),
  (
    'cccccccc-0003-0003-0003-000000000003',
    'bbbbbbbb-0004-0004-0004-000000000004',
    'aaaaaaaa-0004-0004-0004-000000000004',
    'draft',
    'Jordan',
    'Lee',
    '7654321',
    'International Development',
    '45',
    'student2@uoguelph.ca',
    NULL,
    NULL,
    NULL,
    '{}'::jsonb
  );

-- ---------------------------------------------------------------------------
-- Reviews
-- ---------------------------------------------------------------------------
INSERT INTO public.reviews (
  id, application_id, reviewer_id, comments, shortlisted
)
VALUES
  (
    'eeeeeeee-0001-0001-0001-000000000001',
    'cccccccc-0001-0001-0001-000000000001',
    'aaaaaaaa-0002-0002-0002-000000000002',
    'Strong academic record and clear leadership examples. Recommend shortlist.',
    true
  ),
  (
    'eeeeeeee-0002-0002-0002-000000000002',
    'cccccccc-0002-0002-0002-000000000002',
    'aaaaaaaa-0002-0002-0002-000000000002',
    'Compelling community impact; request reference letter before final decision.',
    false
  );
