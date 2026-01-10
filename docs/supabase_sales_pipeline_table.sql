-- Recommended Supabase table for sales pipeline snapshots
-- Usage: upsert snapshots via PostgREST /rest/v1/sales_pipeline_snapshots
-- Ensure you provide the service role key to the automation process (SUPABASE_SERVICE_ROLE_KEY).

-- Create table (idempotent)
CREATE TABLE IF NOT EXISTS public.sales_pipeline_snapshots (
  "timestamp" text NOT NULL PRIMARY KEY,
  source text,
  demo boolean DEFAULT FALSE,
  payload jsonb NOT NULL,
  inserted_at timestamptz DEFAULT now()
);

-- Useful index for time-based queries
CREATE INDEX IF NOT EXISTS idx_sales_pipeline_snapshots_inserted_at
  ON public.sales_pipeline_snapshots (inserted_at);

-- Notes / Recommendations:
-- 1) Grant minimal access to the service role only; do NOT expose the service role key to clients.
-- 2) If you prefer an opaque id, add a uuid column and populate on insert.
-- 3) To enable upsert on "timestamp" the automation uses PostgREST's on_conflict parameter.
-- 4) Consider adding RLS policies if you expose direct DB access to untrusted actors.
