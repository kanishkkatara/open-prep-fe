/*
  # Initial Schema Setup for OpenPrep

  1. New Tables
    - users
      - Extended user profile data
      - Learning preferences
      - Study goals
    - study_modules
      - Pre-defined study modules
      - Progress tracking
    - questions
      - GMAT question bank
      - Metadata and analytics
    - question_attempts
      - User attempt history
      - Performance tracking
    - chat_sessions
      - AI tutor conversations
      - Context tracking
    - study_plans
      - Personalized study plans
      - Schedule and milestones

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Secure chat history access
*/

-- Users table with extended profile
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id uuid UNIQUE REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_onboarded boolean DEFAULT false,
  target_score int,
  exam_date date,
  previous_score int,
  weekly_study_hours int,
  preferred_study_times text[],
  learning_style text[],
  confidence_ratings jsonb DEFAULT '{
    "quantitative": 0,
    "verbal": 0,
    "integrated": 0,
    "analytical": 0
  }'::jsonb
);

-- Study modules table
CREATE TABLE IF NOT EXISTS study_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  difficulty text NOT NULL,
  estimated_time interval,
  topics text[],
  prerequisites uuid[],
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  difficulty text NOT NULL,
  topic text NOT NULL,
  subtopic text,
  question_text text NOT NULL,
  options jsonb NOT NULL,
  correct_answer text NOT NULL,
  explanation text NOT NULL,
  hints text[],
  avg_time_seconds int,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Question attempts tracking
CREATE TABLE IF NOT EXISTS question_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  question_id uuid REFERENCES questions(id),
  selected_answer text NOT NULL,
  is_correct boolean NOT NULL,
  time_spent_seconds int NOT NULL,
  created_at timestamptz DEFAULT now(),
  notes text
);

-- Chat sessions for AI tutor
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  context text NOT NULL,
  messages jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Study plans
CREATE TABLE IF NOT EXISTS study_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  start_date date NOT NULL,
  end_date date NOT NULL,
  weekly_schedule jsonb NOT NULL,
  modules jsonb NOT NULL,
  progress jsonb DEFAULT '{"completed": [], "current": null}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read and update their own data
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = auth_id);

-- Study modules are readable by all authenticated users
CREATE POLICY "Authenticated users can view study modules"
  ON study_modules FOR SELECT
  TO authenticated
  USING (true);

-- Questions are readable by all authenticated users
CREATE POLICY "Authenticated users can view questions"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

-- Users can manage their own question attempts
CREATE POLICY "Users can manage own question attempts"
  ON question_attempts FOR ALL
  USING (auth.uid() IN (SELECT auth_id FROM users WHERE id = user_id));

-- Users can manage their own chat sessions
CREATE POLICY "Users can manage own chat sessions"
  ON chat_sessions FOR ALL
  USING (auth.uid() IN (SELECT auth_id FROM users WHERE id = user_id));

-- Users can manage their own study plans
CREATE POLICY "Users can manage own study plans"
  ON study_plans FOR ALL
  USING (auth.uid() IN (SELECT auth_id FROM users WHERE id = user_id));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_question_attempts_user_id ON question_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_question_attempts_question_id ON question_attempts(question_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_user_id ON study_plans(user_id);