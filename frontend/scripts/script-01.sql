-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.applications (
  award_id uuid NOT NULL,
  student_id uuid NOT NULL,
  resume_url text,
  letter_url text,
  response_text text,
  travel_description text,
  travel_benefit text,
  budget text,
  international_intent_url text,
  certificate_url text,
  submitted_at timestamp with time zone,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  status text DEFAULT 'draft'::text CHECK (status = ANY (ARRAY['draft'::text, 'submitted'::text, 'under_review'::text, 'approved'::text, 'rejected'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  first_name text,
  last_name text,
  student_id_text text,
  major_program text,
  credits_completed text,
  email text,
  community_letter_url text,
  responses jsonb,
  CONSTRAINT applications_pkey PRIMARY KEY (id),
  CONSTRAINT applications_award_id_fkey FOREIGN KEY (award_id) REFERENCES public.awards(id),
  CONSTRAINT applications_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.award_required_fields (
  award_id uuid NOT NULL,
  field_name text NOT NULL,
  label text NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['file'::text, 'text'::text, 'textarea'::text])),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  required boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT award_required_fields_pkey PRIMARY KEY (id),
  CONSTRAINT award_required_fields_award_id_fkey FOREIGN KEY (award_id) REFERENCES public.awards(id)
);
CREATE TABLE public.awards (
  form_type text,
  title text NOT NULL,
  code text NOT NULL UNIQUE,
  donor text NOT NULL,
  value text NOT NULL,
  deadline date NOT NULL,
  description text NOT NULL,
  eligibility text NOT NULL,
  application_method text NOT NULL,
  category text NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  citizenship ARRAY NOT NULL DEFAULT '{}'::text[],
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT awards_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  full_name text,
  user_type text NOT NULL DEFAULT 'student'::text CHECK (user_type = ANY (ARRAY['student'::text, 'reviewer'::text, 'admin'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.reviews (
  application_id uuid,
  reviewer_id uuid,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comments text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.profiles(id)
);