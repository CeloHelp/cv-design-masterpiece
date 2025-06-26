
-- Create a table for storing CVs
CREATE TABLE public.cvs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Meu Currículo',
  personal_data JSONB NOT NULL DEFAULT '{}',
  experiences JSONB NOT NULL DEFAULT '[]',
  education JSONB NOT NULL DEFAULT '[]',
  skills TEXT DEFAULT '',
  languages JSONB NOT NULL DEFAULT '[]',
  selected_design TEXT NOT NULL DEFAULT 'modern',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;

-- Create policies for CVs table
CREATE POLICY "Users can view their own CVs"
  ON public.cvs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own CVs"
  ON public.cvs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CVs"
  ON public.cvs
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CVs"
  ON public.cvs
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER on_cvs_updated
  BEFORE UPDATE ON public.cvs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
