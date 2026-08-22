-- Migration: add profile fields to admins
--
-- The admins table has only ever needed id + created_at to gate access.
-- Adding basic identity fields for display in an admin panel (e.g. "who
-- approved this brand"). Nullable, not NOT NULL, since existing admin
-- rows were created via direct database access and won't have these set
-- yet - backfill them manually, don't force a constraint that breaks on
-- the rows that already exist.

ALTER TABLE public.admins
  ADD COLUMN full_name text,
  ADD COLUMN email text,
  ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();

-- Admins could previously only view their own row. Let them update their
-- own name/email too. This does not open a path to changing id (the
-- primary key) or to inserting new admin rows - that stays direct-DB-only,
-- per the original comment on the admins table.
CREATE POLICY "Admins can update their own profile" ON public.admins
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
