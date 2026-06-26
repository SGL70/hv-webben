-- Seed: organisationsträd
INSERT INTO org_units (id, name, type, parent_id) VALUES
  (1,  '1. Bataljon',    'bataljon', NULL),
  (9,  'Bataljonsstab',  'stab',     1),
  (2,  '1. Kompani',     'kompani',  1),
  (10, '1. Kompanistab', 'stab',     2),
  (3,  '2. Kompani',     'kompani',  1),
  (11, '2. Kompanistab', 'stab',     3),
  (4,  '1. Pluton',      'pluton',   2),
  (5,  '2. Pluton',      'pluton',   2),
  (6,  '1. Grupp',       'grupp',    4),
  (7,  '2. Grupp',       'grupp',    4),
  (8,  '3. Grupp',       'grupp',    5)
ON CONFLICT DO NOTHING;

SELECT setval('org_units_id_seq', 20);

-- Seed: testanvändare
-- BatCh, S4 → Bataljonsstab; KomPC → Kompani; KVM → Kompanistab
INSERT INTO users (id, personal_number, name, role, org_unit_id, email, mobile, profile_complete) VALUES
  (1, '199001010001', 'Erik Andersson',  'soldat', 6,  'erik@test.se',  '070-1111111', TRUE),
  (2, '199001010002', 'Sara Nilsson',    'grpc',   6,  'sara@test.se',  '070-2222222', TRUE),
  (3, '199001010003', 'Johan Lindqvist', 'pc',     4,  'johan@test.se', '070-3333333', TRUE),
  (4, '199001010004', 'Anna Bergström',  'kompc',  2,  'anna@test.se',  '070-4444444', TRUE),
  (5, '199001010005', 'Lars Eriksson',   'kvm',    10, 'lars@test.se',  '070-5555555', TRUE),
  (6, '199001010006', 'Maria Karlsson',  's4',     9,  'maria@test.se', '070-6666666', TRUE),
  (7, '199001010007', 'Peter Svensson',  'batCh',  1,  'peter@test.se', '070-7777777', TRUE)
ON CONFLICT DO NOTHING;

SELECT setval('users_id_seq', 20);

-- Seed: exempelutrustning för Erik (soldat, id=1)
INSERT INTO equipment (user_id, article_number, name, category, quantity, status) VALUES
  (1, 'M90-01', 'Fältuniform M90', 'Klädsel', 2, 'ok'),
  (1, 'SK-42',  'Stridsvärja',     'Utrustning', 1, 'ok'),
  (1, 'HV-11',  'Hjälm med hållare', 'Skydd', 1, 'förlustanmäld'),
  (1, 'RY-02',  'Ryggsäck 35L',    'Utrustning', 1, 'byte_pågår'),
  (1, 'KN-99',  'Kniv m/1990',     'Verktyg', 1, 'ok'),
  (1, 'SV-55',  'Sovsäck',         'Bivack', 1, 'ej_mottagen')
ON CONFLICT DO NOTHING;

-- Seed: exempelaktivitet
INSERT INTO activities (title, description, type, start_time, end_time, created_by, org_unit_id) VALUES
  ('Skjututbildning', 'Grundläggande skjututbildning för 1. Pluton', 'utbildning',
   NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '8 hours', 3, 4),
  ('Plutonsmöte', 'Veckomöte med genomgång av kommande aktiviteter', 'möte',
   NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '1 hour', 3, 4),
  ('Fältövning GREN', 'Tvådagarsövning i terräng', 'övning',
   NOW() + INTERVAL '14 days', NOW() + INTERVAL '16 days', 4, 2)
ON CONFLICT DO NOTHING;
