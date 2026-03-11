
-- Create homework_submissions table
CREATE TABLE public.homework_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  description text NOT NULL DEFAULT '',
  file_name text,
  file_url text,
  time_spent_minutes integer NOT NULL DEFAULT 0,
  submitted_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.homework_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts on homework_submissions"
  ON public.homework_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anonymous reads on homework_submissions"
  ON public.homework_submissions FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create storage bucket for homework files
INSERT INTO storage.buckets (id, name, public)
VALUES ('homework-files', 'homework-files', true);

-- Allow uploads
CREATE POLICY "Allow public uploads to homework-files"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'homework-files');

-- Allow reads
CREATE POLICY "Allow public reads from homework-files"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'homework-files');
