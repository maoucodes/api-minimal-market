
-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can create APIs" ON public.apis;
DROP POLICY IF EXISTS "Authenticated users can update APIs" ON public.apis;
DROP POLICY IF EXISTS "Authenticated users can delete APIs" ON public.apis;

-- Create policies that allow public access for admin operations
-- Note: In production, you should implement proper authentication
CREATE POLICY "Anyone can create APIs" 
  ON public.apis 
  FOR INSERT 
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update APIs" 
  ON public.apis 
  FOR UPDATE 
  TO public
  USING (true);

CREATE POLICY "Anyone can delete APIs" 
  ON public.apis 
  FOR DELETE 
  TO public
  USING (true);
