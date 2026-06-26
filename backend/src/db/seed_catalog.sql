-- Seed: standardutrustning VSH033PG HEMVÄRNSSOLDAT (73 artiklar)
-- Idempotent: ON CONFLICT (article_number) DO NOTHING
INSERT INTO equipment_templates (article_number, name, category, quantity, unit, org_unit_id) VALUES
  -- Identitet
  ('M1150-801010', 'FÄSTANORDNING NAMNSKYLT',      'Identitet',           2, 'ST',  NULL),
  -- CBRN
  ('M2311-714020', 'FILTER 90 ÖVNING',              'CBRN',                1, 'ST',  NULL),
  -- Fältmateriel
  ('M2740-101001', 'FICKLAMPA MT',                  'Fältmateriel',        1, 'ST',  NULL),
  ('M2760-024210', 'REFLEXBINDEL GRÖN',             'Fältmateriel',        1, 'ST',  NULL),
  ('M2824-064001', 'SOLDATKÖK',                     'Fältmateriel',        1, 'ST',  NULL),
  ('M7080-262000', 'FÄLTNECESSÄR',                  'Fältmateriel',        1, 'ST',  NULL),
  -- Verktyg
  ('M6310-004610', 'SLIDKNIV',                      'Verktyg',             1, 'ST',  NULL),
  ('M6426-200010', 'KLÄDBORSTE',                    'Verktyg',             1, 'ST',  NULL),
  -- Dricka
  ('M7061-203011', 'DRICKSFLASKA 90/K',             'Dricka',              1, 'ST',  NULL),
  ('M7061-206051', 'VÄTSKESYST CBRN/T',             'Dricka',              1, 'ST',  NULL),
  ('M7062-105010', 'STÅLTERMOS 0,7L',               'Dricka',              1, 'ST',  NULL),
  -- Bärande system
  ('M7085-105119', 'INNERSÄCK STRSÄCK',             'Bärande system',      1, 'ST',  NULL),
  ('M7085-107000', 'BÄRSÄCK',                       'Bärande system',      1, 'ST',  NULL),
  ('M7085-112001', 'STRIDSSÄCK',                    'Bärande system',      1, 'ST',  NULL),
  ('M7390-307111', 'STRIDSVÄST 2000/K',             'Bärande system',      1, 'ST',  NULL),
  ('M7390-307238', 'PÅSE M UPPGKIT SV00',           'Bärande system',      1, 'ST',  NULL),
  ('M7390-702000', 'BYXBÄLTE GBG OB SPÄ',           'Bärande system',      1, 'ST',  NULL),
  -- Sovsystem
  ('M7313-811000', 'LIGGUNDERLAG',                  'Sovsystem',           1, 'ST',  NULL),
  ('M7317-116001', 'SOVSÄCK',                       'Sovsystem',           1, 'ST',  NULL),
  ('M7317-118001', 'SOVSÄCKSPÅSE',                  'Sovsystem',           1, 'ST',  NULL),
  -- Fältuniform
  ('M7320-207000', 'FÄLTSKJORTA M/90',              'Fältuniform',         3, 'ST',  NULL),
  ('M7352-017000', 'FÄLTBYXOR 90 L',                'Fältuniform',         1, 'PAR', NULL),
  ('M7352-317000', 'FÄLTBYXOR M/90',                'Fältuniform',         1, 'PAR', NULL),
  -- Underkläder
  ('M7321-159000', 'BRYNJA KÄ',                     'Underkläder',         2, 'ST',  NULL),
  ('M7321-179000', 'BRYNJA LÄ',                     'Underkläder',         2, 'ST',  NULL),
  ('M7321-230000', 'TRÖJA M/90',                    'Underkläder',         1, 'ST',  NULL),
  ('M7321-301000', 'BH SPORT',                      'Underkläder',         2, 'ST',  NULL),
  ('M7321-302000', 'BH KOMFORT',                    'Underkläder',         2, 'ST',  NULL),
  ('M7322-108000', 'LÅNGKALS BRYNJA',               'Underkläder',         2, 'ST',  NULL),
  ('M7322-155000', 'UNDERBYXA KB',                  'Underkläder',         5, 'ST',  NULL),
  ('M7323-025000', 'KNÄSTRUMPA',                    'Underkläder',         3, 'PAR', NULL),
  ('M7323-027000', 'ANKELSOCKOR FÄLT',              'Underkläder',         3, 'PAR', NULL),
  ('M7323-055000', 'YTTERSTRUMP FR',                'Underkläder',         2, 'PAR', NULL),
  -- Handskar
  ('M7330-104000', 'FEMFINGERVANTAR SV',            'Handskar',            2, 'PAR', NULL),
  ('M7330-132000', 'TUMVANTAR FROTTÉ',              'Handskar',            1, 'PAR', NULL),
  ('M7331-223000', 'STRIDSHANDSKAR 2000',           'Handskar',            1, 'PAR', NULL),
  ('M7331-225000', 'TUMHAND VIT M KRAGE',           'Handskar',            1, 'PAR', NULL),
  ('M7332-247000', 'FEMFINGHANDSK 06 TJ',           'Handskar',            1, 'PAR', NULL),
  -- Skodon
  ('M7336-195000', 'MARSCHKÄNGOR M/90',             'Skodon',              1, 'PAR', NULL),
  ('M7336-196000', 'VINTERKÄNGOR M/90',             'Skodon',              1, 'PAR', NULL),
  ('M7336-604000', 'INLSULA VKÄNG M/90',            'Skodon',              1, 'ST',  NULL),
  ('M7336-607000', 'INLSULOR MKÄNG M/90',           'Skodon',              1, 'PAR', NULL),
  ('M7336-607600', 'INLSULOR M90B',                 'Skodon',              1, 'PAR', NULL),
  ('M7337-104000', 'GUMSTÖVLAR M/90/K',             'Skodon',              1, 'PAR', NULL),
  -- Optik & hörsel
  ('M7340-124000', 'SKYGLASÖGON KORG',              'Optik & hörsel',      1, 'ST',  NULL),
  ('M7340-126000', 'SKYGLASÖGON SPORT',             'Optik & hörsel',      1, 'ST',  NULL),
  ('M7343-727001', 'LJUDNIVÅBER HÖSKYDD',           'Optik & hörsel',      1, 'ST',  NULL),
  -- Huvudbonader
  ('M7346-030000', 'BASKERMÖSSA',                   'Huvudbonader',        1, 'ST',  NULL),
  ('M7346-206000', 'FÄLTMÖSSA M/90',                'Huvudbonader',        1, 'ST',  NULL),
  ('M7346-255000', 'PÄLSMÖSSA M/59',                'Huvudbonader',        1, 'ST',  NULL),
  ('M7346-724010', 'HJÄLMUNDERLAG M/90',            'Huvudbonader',        1, 'ST',  NULL),
  ('M7347-004020', 'HJÄLM 90 INR 02',               'Huvudbonader',        1, 'ST',  NULL),
  ('M7347-004300', 'HJÄLMDOK 90',                   'Huvudbonader',        1, 'ST',  NULL),
  -- Ytterkläder
  ('M7355-026000', 'FÄLTJACKA M/90',                'Ytterkläder',         1, 'ST',  NULL),
  ('M7355-035000', 'FÄLTJACKA M/90 LÄTT',           'Ytterkläder',         1, 'ST',  NULL),
  ('M7360-020000', 'VÄRMEJACKA 90-1',               'Ytterkläder',         1, 'ST',  NULL),
  ('M7370-285000', 'OVERALL GRÖN BLXL',             'Ytterkläder',         1, 'ST',  NULL),
  ('M7372-131000', 'SKALJACKA M/08 GRÖ',            'Ytterkläder',         1, 'ST',  NULL),
  ('M7373-131000', 'SKALBYXOR M/08 GR',             'Ytterkläder',         1, 'PAR', NULL),
  ('M7373-150000', 'VÄRMEBYXOR M/90',               'Ytterkläder',         1, 'PAR', NULL),
  ('M7379-142000', 'REGNBYXOR M/90',                'Ytterkläder',         1, 'PAR', NULL),
  ('M7379-143000', 'REGNJACKA M/90',                'Ytterkläder',         1, 'ST',  NULL),
  ('M7379-304000', 'SNÖJACKA M/90',                 'Ytterkläder',         1, 'ST',  NULL),
  ('M7379-324000', 'SNÖBYXOR M/90',                 'Ytterkläder',         1, 'PAR', NULL),
  -- Knäskydd
  ('M7388-032000', 'KRSK 90/K',                     'Knäskydd',            1, 'ST',  NULL),
  ('M7388-217500', 'KRSK 12 TAKTIK KNÄ HÖ',        'Knäskydd',            1, 'ST',  NULL),
  ('M7388-217550', 'KRSK 12 TAKTIK KNÄ VÄ',        'Knäskydd',            1, 'ST',  NULL),
  -- Hygien
  ('M7510-205010', 'FROTTEHANDDUK',                 'Hygien',              2, 'ST',  NULL),
  ('M7510-303010', 'BADLAKAN FR GRÖN',              'Hygien',              2, 'ST',  NULL),
  ('M8610-221010', 'SKOVÅRD GRUND/S',               'Hygien',              1, 'ST',  NULL),
  -- Skyddsutrustning
  ('M8286-303010', 'SJVUTR SOL/SJÖ/S',              'Skyddsutrustning',    1, 'ST',  NULL),
  ('M8560-101200', 'SKYDDSUTR 90',                  'Skyddsutrustning',    1, 'ST',  NULL),
  ('M8570-129000', 'KRSK 23 D/S',                   'Skyddsutrustning',    1, 'ST',  NULL)
ON CONFLICT (article_number) DO NOTHING;
