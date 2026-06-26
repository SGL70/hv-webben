ALTER TABLE equipment_cases
  ADD COLUMN IF NOT EXISTS incident_time TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS incident_location TEXT,
  ADD COLUMN IF NOT EXISTS incident_description TEXT,
  ADD COLUMN IF NOT EXISTS witnesses TEXT,
  ADD COLUMN IF NOT EXISTS agrees_to_compensate BOOLEAN;
