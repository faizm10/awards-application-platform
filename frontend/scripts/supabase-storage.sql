-- Supabase Storage: buckets + RLS for file uploads
-- Run in Supabase SQL Editor AFTER supabase.sql, mock-seed.sql, and supabase-rls.sql
-- (uses public.is_admin() and public.is_reviewer_or_admin() from supabase-rls.sql)
--
-- App usage:
--   - frontend/components/file-upload.tsx  → default bucket "documents", path {user_id}/...
--   - frontend/app/awards/[id]/apply/page.tsx → bucket "applications", path {award_id}/{user_id}/{field}/...

-- ---------------------------------------------------------------------------
-- Buckets (public so getPublicUrl() works without signed URLs)
-- ---------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'applications',
    'applications',
    true,
    10485760, -- 10 MB (matches FileUpload maxSize default)
    ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ]::text[]
  ),
  (
    'documents',
    'documents',
    true,
    10485760,
    ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ]::text[]
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- Helper: user may write under {user_id}/... or {award_id}/{user_id}/...
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.storage_user_owns_object(object_name text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT
    auth.uid() IS NOT NULL
    AND (
      auth.uid()::text = (storage.foldername(object_name))[1]
      OR auth.uid()::text = (storage.foldername(object_name))[2]
    );
$$;

GRANT EXECUTE ON FUNCTION public.storage_user_owns_object(text) TO authenticated;

-- ---------------------------------------------------------------------------
-- storage.objects policies (drop + recreate for idempotent re-runs)
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "applications_select_public" ON storage.objects;
DROP POLICY IF EXISTS "applications_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "applications_update_own" ON storage.objects;
DROP POLICY IF EXISTS "applications_delete_own" ON storage.objects;
DROP POLICY IF EXISTS "applications_admin_all" ON storage.objects;
DROP POLICY IF EXISTS "applications_reviewer_select" ON storage.objects;

DROP POLICY IF EXISTS "documents_select_public" ON storage.objects;
DROP POLICY IF EXISTS "documents_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "documents_update_own" ON storage.objects;
DROP POLICY IF EXISTS "documents_delete_own" ON storage.objects;
DROP POLICY IF EXISTS "documents_admin_all" ON storage.objects;
DROP POLICY IF EXISTS "documents_reviewer_select" ON storage.objects;

-- applications bucket
CREATE POLICY "applications_select_public"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'applications');

CREATE POLICY "applications_insert_own"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'applications'
    AND public.storage_user_owns_object(name)
  );

CREATE POLICY "applications_update_own"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'applications'
    AND public.storage_user_owns_object(name)
  )
  WITH CHECK (
    bucket_id = 'applications'
    AND public.storage_user_owns_object(name)
  );

CREATE POLICY "applications_delete_own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'applications'
    AND public.storage_user_owns_object(name)
  );

CREATE POLICY "applications_admin_all"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'applications' AND public.is_admin())
  WITH CHECK (bucket_id = 'applications' AND public.is_admin());

CREATE POLICY "applications_reviewer_select"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'applications' AND public.is_reviewer_or_admin());

-- documents bucket (FileUpload default)
CREATE POLICY "documents_select_public"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'documents');

CREATE POLICY "documents_insert_own"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
    AND public.storage_user_owns_object(name)
  );

CREATE POLICY "documents_update_own"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND public.storage_user_owns_object(name)
  )
  WITH CHECK (
    bucket_id = 'documents'
    AND public.storage_user_owns_object(name)
  );

CREATE POLICY "documents_delete_own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND public.storage_user_owns_object(name)
  );

CREATE POLICY "documents_admin_all"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'documents' AND public.is_admin())
  WITH CHECK (bucket_id = 'documents' AND public.is_admin());

CREATE POLICY "documents_reviewer_select"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'documents' AND public.is_reviewer_or_admin());
