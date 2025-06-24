-- Update an existing user to admin (replace with actual email)
UPDATE users 
SET role = 'admin', is_premium = true 
WHERE email = 'your-admin-email@example.com';

-- Or create a new admin user directly (if you have the user ID from auth.users)
-- First, the user must sign up normally through the app, then run:
-- UPDATE users 
-- SET role = 'admin', is_premium = true 
-- WHERE id = 'USER_ID_FROM_AUTH_USERS_TABLE';

-- Check if the update worked
SELECT id, email, name, role, is_premium 
FROM users 
WHERE role = 'admin';
