-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;

-- Create new policies that allow user creation during signup
CREATE POLICY "Users can view their own data" ON users 
FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data" ON users 
FOR UPDATE USING (auth.uid()::text = id::text);

-- IMPORTANT: Allow INSERT for new user registration
CREATE POLICY "Allow user registration" ON users 
FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Alternative: If the above doesn't work, temporarily allow all inserts for authenticated users
-- CREATE POLICY "Allow authenticated user creation" ON users 
-- FOR INSERT TO authenticated WITH CHECK (true);

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'users';
