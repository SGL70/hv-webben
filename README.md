# Hv-webben

Självhostad prototyp av ett digitalt administrativt stödsystem för Hemvärnets kompani- och bataljonsförband. Syftet är att ersätta manuella processer (Excel-listor, pappersblanketter, e-post) med ett modernt webbgränssnitt anpassat för Hemvärnets organisationsstruktur och roller.

> **Status:** Aktiv prototyp — funktionell men inte produktionsklar. Saknar riktig BankID-integration, e-postnotiser och säkerhetshärdning för publikt internet.

---

## Arkitektur

```
┌─────────────────────────────────────────────────────┐
│  Webbläsare                                         │
│  React 18 + Vite + Tailwind CSS                     │
└───────────────────┬─────────────────────────────────┘
                    │ HTTP/JSON (REST)
┌───────────────────▼─────────────────────────────────┐
│  Node.js 20 + Express                               │
│  JWT-autentisering · Rollbaserad åtkomstkontroll    │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│  PostgreSQL 15                                      │
│  org_units · users · activities · reports           │
│  equipment · equipment_cases · inventory            │
└─────────────────────────────────────────────────────┘
```

**Stack:**
- **Frontend:** React 18, Vite, Tailwind CSS, React Router
- **Backend:** Node.js 20, Express, `pg` (PostgreSQL-klient), `jsonwebtoken`, `multer`, `xlsx`
- **Databas:** PostgreSQL 15
- **Deploy:** LXC-container på Proxmox (Debian), systemd-tjänst

---

## Roller och behörigheter

| Kod | Roll | Behörighet |
|-----|------|-----------|
| `soldat` | Soldat | Egna ärenden, utrustning, kalender |
| `grpc` | Gruppchef | + Enhetssida (gruppens medlemmar) |
| `pc` | Plutonchef | + Granska km-ers/utlägg, skapa aktiviteter |
| `toc` | Troppchef | Som pc |
| `kompc` | Kompanichef | + Attestera rapporter, utrustningsärenden, personalimport |
| `kvm` | Komp-VKM | Som kompc |
| `s4` | S4 / Bat-VKM | Som kompc |
| `batCh` | Bataljonschef | Som kompc |
| `stab` | Stab | Som kompc |

Inloggning sker idag via **simulerad BankID** (rollväljare). Autentisering är JWT-baserad och redo för riktig BankID-integration.

---

## Implementerade förmågor

### Kalender
- Aktiviteter (övning, utbildning, möte, övrigt) kopplade till org-enhet
- OSS-svar: Ja / Nej / Kanske per person
- Svarssummering visas direkt på aktivitetskortet (✓ / ✗ / ?)
- Expanderbar deltagarlista grupperad per org-enhet
- Plutonchef+ kan skapa aktiviteter

### Redovisningar (Km-ers / Utlägg / SÄVA)
- **Km-ersättning** — antal kilometer
- **Utlägg** — belopp + syfte, påminnelse om originalkvitto
- **Traktamente** — belopp
- **SÄVA** (Särskild Visstidsanställning) — antal timmar, används för säkerhetsintervjuer, bostadsbesiktningar, förrådsbesök m.m.
- Fritext-aktivitet ("Övrigt") när ingen kalenderaktivitet finns
- Godkännandekedja: **Soldat → Plutonchef (granskar) → Kompanichef (attesterar)**
- Plutonchef kan avfärda med motivering — visas för soldaten
- Soldaten kan redigera och skicka in igen
- Attesterade rapporter sparas som historik (sökbar av KompC)
- Badge-notifikation i navigation för väntande ärenden

### Utrustningshantering
- Personlig utrustningslista per soldat (kopplar mot materialkatalog)
- Rapportera förlust eller begära byte
- Ärendeflöde: soldat → logistik (godkänn/avslå)
- Förlustblankett (M7102-500360E) genereras för utskrift
- Kompaniinventering — logistik startar, soldater bekräftar sina artiklar

### Organisation
- Hierarkiskt org-träd: bataljon → kompani → pluton → grupp
- Stöd för 112. HvKomp-struktur: Chefsgrupp, Stab/TrossPluton, 1–4. Pluton
- Import av personal från ODS/XLSX (PRIO-export)
  - Förhandsgranskning med möjlighet att redigera/ta bort rader
  - Automatisk mappning av stabPluton-kolumn till org-enhet
  - Idempotent (re-import uppdaterar befintliga, skapar inte dubletter)
- Redigering av enskilda personer (namn, roll, enhet, kontakt)

### Dashboard / Översikt
- Personlig vy: nästa aktivitet, egna ärenden, utrustningsstatus
- Anpassad efter inloggad roll

---

## Databasschema (översikt)

```
org_units          — hierarkiskt träd (id, name, type, parent_id)
users              — personal (personal_number som nyckel, role, org_unit_id)
activities         — kalenderaktiviteter
activity_responses — OSS per person (ja/nej/kanske)
reports            — km-ers/utlägg/SÄVA (status: draft→submitted→reviewed→approved)
equipment_templates — materialkatalog
equipment_items    — personlig utrustning
equipment_cases    — ärenden (förlust/byte)
inventory_sessions — inventeringsomgångar
inventory_items    — per-person-svar på inventering
```

---

## Komma igång (lokal utveckling)

**Krav:** Node.js 20+, PostgreSQL 15

```bash
# Klona
git clone https://github.com/SGL70/hv-webben.git
cd hv-webben

# Backend
cd backend
cp .env.example .env          # sätt DATABASE_URL och JWT_SECRET
npm install
npm run migrate               # kör SQL-migrationer
npm start

# Frontend (nytt terminalfönster)
cd frontend
npm install
npm run dev
```

Öppna `http://localhost:5173` — klicka på QR-koden för att välja testanvändare.

---

## Planerade förbättringar

### Nära (prototyp → MVP)
- [ ] Riktig BankID-integration (Freja eID eller Swedbank Pay BankID-API)
- [ ] E-postnotifieringar vid statusändringar i ärenden
- [ ] Kalender: kategorisering i Avtalsövningar (KFÖ/SÖF/SÖB), Kompletteringsutbildning och Övrigt
- [ ] Kalender: SÖB-filtrering per roll (kompc/stf/fanjunkare/kvm)
- [ ] Exportera redovisningar till PDF/Excel för vidarebefordran till MR-grupp

### Funktionella tillägg
- [ ] Mobilanpassning / PWA (push-notiser)
- [ ] Närvaro­registrering vid genomförd aktivitet (grpc markerar faktisk närvaro)
- [ ] Befälsplanering / tjänstgöringslista
- [ ] Dokumenthantering (order, kallelser, instruktioner)
- [ ] Karta med övningsområden

### Tekniska förbättringar
- [ ] Automatiserade tester (backend: Jest + supertest, frontend: Vitest)
- [ ] Säkerhetshärdning för exponering mot internet (rate limiting, CSP, audit log)
- [ ] Multi-kompani-stöd inom samma instans
- [ ] CI/CD-pipeline

---

## Licens

MIT — fri att använda, modifiera och dela. Prototypen är inte granskad för hantering av sekretessbelagd information.
