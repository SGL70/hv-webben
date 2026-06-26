-- Add unit + source to equipment
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT 'ST';
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';

-- Add unit to templates
ALTER TABLE equipment_templates ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT 'ST';

-- Unique constraint on templates.article_number (idempotent seed)
ALTER TABLE equipment_templates
  DROP CONSTRAINT IF EXISTS equipment_templates_article_number_key;
ALTER TABLE equipment_templates
  ADD CONSTRAINT equipment_templates_article_number_key UNIQUE (article_number);

-- Unique (user_id, article_number) for PRIO upsert — partial (where not null)
ALTER TABLE equipment DROP CONSTRAINT IF EXISTS equipment_user_article_key;
ALTER TABLE equipment
  ADD CONSTRAINT equipment_user_article_key
  UNIQUE (user_id, article_number);
