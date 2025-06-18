
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  api_key TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  credits INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create api_calls table to track usage
CREATE TABLE public.api_calls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  api_id UUID REFERENCES public.apis(id) ON DELETE CASCADE NOT NULL,
  endpoint TEXT,
  method TEXT,
  status_code INTEGER,
  response_time INTEGER, -- in milliseconds
  credits_used INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Enable RLS on api_calls table
ALTER TABLE public.api_calls ENABLE ROW LEVEL SECURITY;

-- Users can view their own API calls
CREATE POLICY "Users can view own api calls" ON public.api_calls
  FOR SELECT USING (auth.uid() = user_id);

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Add more fields to APIs table for better admin management
ALTER TABLE public.apis ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';
ALTER TABLE public.apis ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.apis ADD COLUMN IF NOT EXISTS pricing_model TEXT DEFAULT 'free';
ALTER TABLE public.apis ADD COLUMN IF NOT EXISTS rate_limit INTEGER DEFAULT 1000;
ALTER TABLE public.apis ADD COLUMN IF NOT EXISTS documentation_url TEXT;
