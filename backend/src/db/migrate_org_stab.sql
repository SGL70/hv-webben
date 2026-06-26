-- Extend type check to include 'stab'
ALTER TABLE org_units DROP CONSTRAINT org_units_type_check;
ALTER TABLE org_units ADD CONSTRAINT org_units_type_check
  CHECK (type = ANY (ARRAY['bataljon','kompani','pluton','tropp','grupp','stab']));

-- Add stab units
INSERT INTO org_units (id, name, type, parent_id) VALUES
  (9,  'Bataljonsstab',  'stab', 1),
  (10, '1. Kompanistab', 'stab', 2),
  (11, '2. Kompanistab', 'stab', 3)
ON CONFLICT DO NOTHING;

SELECT setval('org_units_id_seq', 20);

-- S4 → Bataljonsstab (org 9)
UPDATE users SET org_unit_id = 9 WHERE role = 's4';

-- KVM → 1. Kompanistab (org 10)
UPDATE users SET org_unit_id = 10 WHERE role = 'kvm';
