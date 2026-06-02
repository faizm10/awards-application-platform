-- Row Level Security for awards-application-platform
-- Run in Supabase SQL Editor AFTER supabase.sql and mock-seed.sql.
-- Then run supabase-storage.sql for Storage buckets (depends on is_admin / is_reviewer_or_admin here).
-- Fixes: awards visible in Table Editor but empty in the app (anon/authenticated blocked)

-- Helper: current user's role from profiles
CREATE OR REPLACE FUNCTION public.current_user_type()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_type FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT user_type = 'admin' FROM public.profiles WHERE id = auth.uid()), false);
$$;

CREATE OR REPLACE FUNCTION public.is_reviewer_or_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((
    SELECT user_type IN ('reviewer', 'admin')
    FROM public.profiles
    WHERE id = auth.uid()
  ), false);
$$;

GRANT EXECUTE ON FUNCTION public.current_user_type() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_reviewer_or_admin() TO authenticated, anon;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own_or_staff" ON public.profiles;
CREATE POLICY "profiles_select_own_or_staff"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.is_reviewer_or_admin());

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- ---------------------------------------------------------------------------
-- awards (public catalog + admin management)
-- ---------------------------------------------------------------------------
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "awards_select_public" ON public.awards;
CREATE POLICY "awards_select_public"
  ON public.awards FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "awards_insert_admin" ON public.awards;
CREATE POLICY "awards_insert_admin"
  ON public.awards FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "awards_update_admin" ON public.awards;
CREATE POLICY "awards_update_admin"
  ON public.awards FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "awards_delete_admin" ON public.awards;
CREATE POLICY "awards_delete_admin"
  ON public.awards FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- award_required_fields
-- ---------------------------------------------------------------------------
ALTER TABLE public.award_required_fields ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "award_required_fields_select_public" ON public.award_required_fields;
CREATE POLICY "award_required_fields_select_public"
  ON public.award_required_fields FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "award_required_fields_write_admin" ON public.award_required_fields;
CREATE POLICY "award_required_fields_insert_admin"
  ON public.award_required_fields FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "award_required_fields_update_admin" ON public.award_required_fields;
CREATE POLICY "award_required_fields_update_admin"
  ON public.award_required_fields FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "award_required_fields_delete_admin" ON public.award_required_fields;
CREATE POLICY "award_required_fields_delete_admin"
  ON public.award_required_fields FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- applications
-- ---------------------------------------------------------------------------
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "applications_select_own_or_staff" ON public.applications;
CREATE POLICY "applications_select_own_or_staff"
  ON public.applications FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_reviewer_or_admin());

DROP POLICY IF EXISTS "applications_insert_own" ON public.applications;
CREATE POLICY "applications_insert_own"
  ON public.applications FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "applications_update_own_or_staff" ON public.applications;
CREATE POLICY "applications_update_own_or_staff"
  ON public.applications FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid() OR public.is_reviewer_or_admin())
  WITH CHECK (student_id = auth.uid() OR public.is_reviewer_or_admin());

DROP POLICY IF EXISTS "applications_delete_own" ON public.applications;
CREATE POLICY "applications_delete_own"
  ON public.applications FOR DELETE
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin());

-- ---------------------------------------------------------------------------
-- reviews
-- ---------------------------------------------------------------------------
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_select_staff" ON public.reviews;
CREATE POLICY "reviews_select_staff"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (public.is_reviewer_or_admin());

DROP POLICY IF EXISTS "reviews_write_staff" ON public.reviews;
CREATE POLICY "reviews_write_staff"
  ON public.reviews FOR ALL
  TO authenticated
  USING (public.is_reviewer_or_admin())
  WITH CHECK (public.is_reviewer_or_admin());
