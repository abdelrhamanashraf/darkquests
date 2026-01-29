-- Allow 'legendary' difficulty in quests
DO $$
BEGIN
  -- Drop existing check constraint if it exists
  IF EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = 'public'
      AND t.relname = 'quests'
      AND c.conname = 'quests_difficulty_check'
  ) THEN
    EXECUTE 'ALTER TABLE public.quests DROP CONSTRAINT quests_difficulty_check';
  END IF;
END $$;

ALTER TABLE public.quests
ADD CONSTRAINT quests_difficulty_check
CHECK (difficulty IN ('easy', 'medium', 'hard', 'legendary'));

-- Optional: set a default if you ever insert without a difficulty
-- ALTER TABLE public.quests ALTER COLUMN difficulty SET DEFAULT 'medium';
