
CREATE TABLE public.homework_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  duration_minutes integer NOT NULL,
  actual_time_spent_minutes integer NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.homework_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts on homework_sessions"
  ON public.homework_sessions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anonymous reads on homework_sessions"
  ON public.homework_sessions
  FOR SELECT
  TO anon, authenticated
  USING (true);
