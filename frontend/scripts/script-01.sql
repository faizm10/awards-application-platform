CREATE TABLE public.applications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  award_id uuid,
  student_id uuid,
  status text DEFAULT 'draft'::text CHECK (status = ANY (ARRAY['draft'::text, 'submitted'::text, 'under_review'::text, 'approved'::text, 'rejected'::text])),
  application_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  submitted_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT applications_pkey PRIMARY KEY (id),
  CONSTRAINT applications_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id),
  CONSTRAINT applications_award_id_fkey FOREIGN KEY (award_id) REFERENCES public.awards(id)
);
CREATE TABLE public.awards (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  code text NOT NULL UNIQUE,
  donor text NOT NULL,
  value text NOT NULL,
  deadline date NOT NULL,
  citizenship ARRAY NOT NULL DEFAULT '{}'::text[],
  description text NOT NULL,
  eligibility text NOT NULL,
  application_method text NOT NULL,
  category text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  -- created_by uuid,
  CONSTRAINT awards_pkey PRIMARY KEY (id),
  -- CONSTRAINT awards_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
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
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  application_id uuid,
  reviewer_id uuid,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comments text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.profiles(id),
  CONSTRAINT reviews_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(id)
);