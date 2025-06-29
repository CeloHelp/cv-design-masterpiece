
-- Create a table for CV version history
CREATE TABLE public.cv_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cv_id UUID REFERENCES public.cvs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  personal_data JSONB NOT NULL DEFAULT '{}',
  experiences JSONB NOT NULL DEFAULT '[]',
  education JSONB NOT NULL DEFAULT '[]',
  skills TEXT DEFAULT '',
  languages JSONB NOT NULL DEFAULT '[]',
  selected_design TEXT NOT NULL DEFAULT 'modern',
  change_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cv_history ENABLE ROW LEVEL SECURITY;

-- Create policies for cv_history table
CREATE POLICY "Users can view their own CV history"
  ON public.cv_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create CV history entries"
  ON public.cv_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for better performance when querying history
CREATE INDEX idx_cv_history_cv_id ON public.cv_history(cv_id);
CREATE INDEX idx_cv_history_user_id ON public.cv_history(user_id);
CREATE INDEX idx_cv_history_created_at ON public.cv_history(created_at DESC);

-- Create function to automatically create history entry when CV is updated
CREATE OR REPLACE FUNCTION public.create_cv_history_entry()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the next version number for this CV
  INSERT INTO public.cv_history (
    cv_id, 
    user_id, 
    version_number, 
    title, 
    personal_data, 
    experiences, 
    education, 
    skills, 
    languages, 
    selected_design,
    change_description
  )
  SELECT 
    NEW.id,
    NEW.user_id,
    COALESCE(MAX(version_number), 0) + 1,
    NEW.title,
    NEW.personal_data,
    NEW.experiences,
    NEW.education,
    NEW.skills,
    NEW.languages,
    NEW.selected_design,
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'CV criado'
      ELSE 'CV atualizado'
    END
  FROM public.cv_history 
  WHERE cv_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create history entries
CREATE TRIGGER on_cv_created_or_updated
  AFTER INSERT OR UPDATE ON public.cvs
  FOR EACH ROW EXECUTE FUNCTION public.create_cv_history_entry();
