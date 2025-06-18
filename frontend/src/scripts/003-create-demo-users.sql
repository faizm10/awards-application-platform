-- Note: These are demo accounts for testing
-- In production, users would sign up through the application

-- Insert demo profiles (these would normally be created through the signup process)
-- You'll need to create these users through Supabase Auth first, then update with the correct UUIDs

-- Example structure - replace UUIDs with actual ones from Supabase Auth
-- INSERT INTO public.profiles (id, email, full_name, user_type) VALUES
-- ('uuid-from-supabase-auth', 'admin@example.com', 'Admin User', 'admin'),
-- ('uuid-from-supabase-auth', 'student@example.com', 'Student User', 'student'),
-- ('uuid-from-supabase-auth', 'reviewer@example.com', 'Reviewer User', 'reviewer');

-- For now, we'll create a function to help with demo user creation
CREATE OR REPLACE FUNCTION create_demo_profile(
  user_id UUID,
  user_email TEXT,
  user_name TEXT,
  user_role TEXT
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, user_type)
  VALUES (user_id, user_email, user_name, user_role)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    user_type = EXCLUDED.user_type,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
