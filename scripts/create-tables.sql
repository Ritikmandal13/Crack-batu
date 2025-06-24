-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pyqs table
CREATE TABLE IF NOT EXISTS pyqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  semester VARCHAR(10) NOT NULL,
  year VARCHAR(10) NOT NULL,
  file_url TEXT NOT NULL,
  view_url TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE CASCADE
);

-- Create user_activity table
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pyq_id UUID REFERENCES pyqs(id) ON DELETE CASCADE,
  action VARCHAR(20) CHECK (action IN ('viewed', 'downloaded', 'bookmarked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'feedback' CHECK (type IN ('feedback', 'request', 'report')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pyqs_department ON pyqs(department);
CREATE INDEX IF NOT EXISTS idx_pyqs_semester ON pyqs(semester);
CREATE INDEX IF NOT EXISTS idx_pyqs_year ON pyqs(year);
CREATE INDEX IF NOT EXISTS idx_pyqs_is_premium ON pyqs(is_premium);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pyqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Anyone can view non-premium PYQs" ON pyqs FOR SELECT USING (is_premium = FALSE);
CREATE POLICY "Premium users can view premium PYQs" ON pyqs FOR SELECT USING (
  is_premium = TRUE AND 
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND is_premium = TRUE)
);
CREATE POLICY "Admins can manage PYQs" ON pyqs FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);

CREATE POLICY "Users can view their own activity" ON user_activity FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own activity" ON user_activity FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own feedback" ON feedback FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own feedback" ON feedback FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Admins can view all feedback" ON feedback FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);
CREATE POLICY "Admins can update feedback" ON feedback FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);
