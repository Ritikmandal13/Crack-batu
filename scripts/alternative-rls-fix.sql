-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;

-- Create more permissive policies for user management
CREATE POLICY "Users can view their own data" ON users 
FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data" ON users 
FOR UPDATE USING (auth.uid()::text = id::text);

-- Allow any authenticated user to insert (this happens during signup)
CREATE POLICY "Allow authenticated user creation" ON users 
FOR INSERT TO authenticated WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
