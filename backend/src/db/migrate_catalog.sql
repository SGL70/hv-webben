-- Add catalog fields to equipment_templates
ALTER TABLE equipment_templates
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS image_path TEXT,
  ADD COLUMN IF NOT EXISTS part_of_article TEXT;

-- Make org_unit_id nullable (templates are now a global catalog)
ALTER TABLE equipment_templates
  ALTER COLUMN org_unit_id DROP NOT NULL;

-- Carry image and description through to individual equipment
ALTER TABLE equipment
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS image_path TEXT;
