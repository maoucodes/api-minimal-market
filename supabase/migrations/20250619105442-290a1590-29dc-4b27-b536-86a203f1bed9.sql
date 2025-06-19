
-- Enable RLS on profiles table and add policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Enable RLS on api_calls table and add policies  
ALTER TABLE public.api_calls ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own API calls
CREATE POLICY "Users can view their own api_calls" 
  ON public.api_calls 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to insert their own API calls
CREATE POLICY "Users can insert their own api_calls" 
  ON public.api_calls 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
