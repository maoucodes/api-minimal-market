
-- Create a table to store API data
CREATE TABLE public.apis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT 'v1.0.0',
  description TEXT,
  reliability TEXT DEFAULT '99%',
  avg_response_time TEXT DEFAULT '100ms',
  rating DECIMAL(2,1) DEFAULT 4.5,
  users INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  quick_start TEXT,
  endpoint_method TEXT DEFAULT 'GET',
  endpoint_path TEXT,
  endpoint_parameters JSONB DEFAULT '[]'::jsonb,
  endpoint_example TEXT,
  endpoint_response JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.apis ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to APIs
CREATE POLICY "Anyone can view APIs" 
  ON public.apis 
  FOR SELECT 
  TO public
  USING (true);

-- Create policy to allow authenticated users to insert APIs (for admin)
CREATE POLICY "Authenticated users can create APIs" 
  ON public.apis 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to update APIs (for admin)
CREATE POLICY "Authenticated users can update APIs" 
  ON public.apis 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to delete APIs (for admin)
CREATE POLICY "Authenticated users can delete APIs" 
  ON public.apis 
  FOR DELETE 
  TO authenticated
  USING (true);
