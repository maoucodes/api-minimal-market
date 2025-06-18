
-- Add quick_start_python field to the apis table
ALTER TABLE public.apis ADD COLUMN IF NOT EXISTS quick_start_python TEXT;
