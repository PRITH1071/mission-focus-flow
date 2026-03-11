
CREATE TABLE public.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  score integer NOT NULL,
  passed boolean NOT NULL DEFAULT false,
  completed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts on quiz_attempts"
  ON public.quiz_attempts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anonymous reads on quiz_attempts"
  ON public.quiz_attempts FOR SELECT
  TO anon, authenticated
  USING (true);
