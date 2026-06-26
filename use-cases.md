# Use Cases — Bataljonssystem

Härledda ur arkitekturdokument, konceptfas 2026. Organiserade per roll i stigande behörighetsnivå.

> **Arv:** Alla chefsroller (GrpC och uppåt) är också soldater och inkluderar samtliga use cases på individnivå. Varje nivå ärver dessutom från nivån under. En KompCh kan alltså göra allt en PC, GrpC och Soldat kan göra — men scoped till sitt kompani.

---

## Soldat

| # | Use Case | Beskrivning |
|---|----------|-------------|
| S-1 | Logga in | Autentiserar sig med BankID. Personnummer och namn hämtas automatiskt. |
| S-2 | Komplettera profil (första inloggning) | Anger e-postadress och mobilnummer direkt efter första BankID-inloggning. Obligatoriskt innan åtkomst till övriga funktioner. Kan uppdateras senare under Mina uppgifter. |
| S-3 | Vänta på enhetstilldelning | Om kontot saknar enhetstillhörighet visas en väntevy efter profilkomplettering. Åtkomst till övriga funktioner låses upp när en chef tilldelat individen till en enhet. |
| S-4 | Se kalender | Ser aktiviteter (övningar, utbildningar, möten) relevanta för sin grupp, pluton och kompani. |
| S-5 | Motta aktivitetsinbjudan | Får notifiering när en aktivitet skapas som berör soldaten. |
| S-6 | Acceptera/neka deltagande | Svarar ja/nej/kanske på en aktivitetsinbjudan. Svar kan ändras tills aktiviteten börjar. |
| S-7 | Motta påminnelse | Får automatisk påminnelse om aktivitet är nära och svar saknas, eller om befäl skickar manuell påminnelse. |
| S-8 | Redovisa tid | Rapporterar antal timmar efter genomförd aktivitet. |
| S-9 | Redovisa körmil | Rapporterar körda mil i samband med aktivitet med start- och slutadress. |
| S-10 | Redovisa utlägg | Registrerar utlägg (belopp, syfte, datum) i samband med aktivitet. Systemet uppmanar soldaten att snarast skicka originalkvitto per post till MR-grupp/HR. |
| S-11 | Se utrustningsregister | Ser sina tilldelade persedlar med status. Listan baseras på enhetens standardlista. Artiklar med aktiva ärenden visas med statusflaggar: **ej mottagen** (flaggad, ej beslutad), **ej tilldelad** (godkänd avvikelse), **förlustanmäld** (aktivt förlustärende), **byte pågår** (ersättningsbeställning initierad). |
| S-12 | Flagga artikel som "ej mottagen" | Markerar en eller flera artiklar i sin lista som inte faktiskt erhållits. Ärendet skickas till KVM för granskning. |
| S-13 | Beställa ersättningspersedel | Initierar beställning av trasig eller förbrukad utrustning. Returpacksedel medföljer för retur av defekt artikel. |
| S-14 | Initiera förlustanmälan | Anmäler borttappad utrustning med beskrivning och omständigheter. |
| S-15 | Följa ärendestatus | Ser status på pågående "ej mottagen"-ärenden, beställningar, utlägg och förlustanmälningar. |
| S-16 | Motta notifiering | Får notifieringar via e-post eller webb-push om nya aktiviteter och ärendeuppdateringar. |

---

## GrpC — Gruppchef

Är soldat + gruppchef. Ärver alla use cases för **Soldat**, plus:

| # | Use Case | Beskrivning |
|---|----------|-------------|
| G-1 | Se sin grupp | Ser alla soldater i sin grupp med namn, e-post, mobilnummer och svarsstatus per aktivitet. |
| G-2 | Lägga till soldat i gruppen | Registrerar en soldat via personnummer. Kontot matchas när soldaten loggar in med BankID för första gången och tilldelas gruppen. |
| G-3 | Ta bort soldat från gruppen | Tar bort en soldat ur gruppen. Soldaten kvarstår i systemet utan enhetstillhörighet tills annan chef tilldelar dem. |
| G-4 | Genomföra närvarokontroll | Markerar faktisk närvaro för gruppmedlemmar vid aktivitetens start. Avvikelse mot anmält svar flaggas. |
| G-5 | Se gruppens utrustningsbrister | Samlad vy över hela gruppens utrustningsstatus. Visar artiklar flaggade som ej mottagna, förlustanmälda eller med pågående byte — per soldat. |
| G-6 | Initiera inventering | Startar inventering av gruppens utrustning mot register. Avvikelser flaggas och leder till beställning eller förlustanmälan. |

---

## PC — Plutonchef

Är soldat + plutonchef. Ärver alla use cases för **GrpC** (för hela plutonen), plus:

| # | Use Case | Beskrivning |
|---|----------|-------------|
| P-1 | Se sin pluton | Ser alla grupper och soldater i sin pluton med namn, kontaktinfo och svarsstatus per aktivitet. |
| P-2 | Flytta soldat mellan grupper | Flyttar en soldat från en grupp till en annan inom sin pluton. Chef härledds automatiskt om. |
| P-3 | Utse GrpC | Tilldelar rollen GrpC till en soldat i sin pluton. Tidigare GrpC återgår till rollen Soldat. |
| P-4 | Skapa aktivitet | Skapar aktiviteter (övning, utbildning, möte) för sin pluton. Systemet skickar inbjudningar till berörda. |
| P-5 | Se svarsöversikt | Ser sammanställning av ja/nej/kanske/ej svarat per aktivitet och soldat. |
| P-6 | Skicka påminnelse | Skickar manuell påminnelse till soldater som inte svarat på en aktivitet. |
| P-7 | Granska tid, körmil och utlägg | Förhandsgranskar inlämnade rapporter innan de når KompCh för attest. Kan returnera med kommentar. |
| P-8 | Se plutonens utrustningsbrister | Samlad vy över plutonens utrustningsstatus, nedbruten per grupp och soldat. Kan filtreras på bristtyp. |
| P-9 | Yttra sig om förlustanmälan | Lämnar yttrande på en soldats förlustanmälan och vidarebefordrar ärendet till KVM. |
| P-10 | Initiera inventering | Startar inventering för hela plutonen. |

---

## ToC — Troppchef *(valfri nivå, aktiveras per kompani)*

Som **PC** men med behörighet begränsad till sin tropp. Aktiveras av kompanichef vid behov.

---

## KompCh — Kompanichef

Är soldat + kompanichef. Ärver alla use cases för **PC** (för hela kompaniet), plus:

| # | Use Case | Beskrivning |
|---|----------|-------------|
| K-1 | Se kompaniet | Ser alla plutoner, grupper och soldater i kompaniet med namn, kontaktinfo och svarsstatus per aktivitet. |
| K-2 | Flytta soldat eller grupp mellan plutoner | Omplacerar en soldat eller en hel grupp till annan pluton inom kompaniet. |
| K-3 | Utse PC | Tilldelar rollen PC till en soldat i kompaniet. Tidigare PC återgår till rollen Soldat. |
| K-4 | Skapa aktivitet för enhet | Skapar aktiviteter för hela kompaniet eller underenheter. Systemet skickar inbjudningar till berörda. |
| K-5 | Attestera tid, körmil och utlägg | Formellt attesterar soldaternas rapporter efter PC:s granskning. Attest krävs per post (tid, körmil, utlägg) och kan göras samlat. |
| K-6 | Exportera till PDF | Exporterar attesterade rapporter (tid, körmil, utlägg) till PDF per soldat, aktivitet eller tidsperiod. |
| K-7 | Se kompaniets utrustningsbrister | Samlad vy över kompaniets utrustningsstatus, nedbruten per pluton och grupp. Kan exporteras som underlag. |

---

## Kvartermästare Kompani (KVM)

Behörighet liknande KompCh med tyngdpunkt på logistik. Primär ägare av standardlistan på kompaninivå.

**Standardlista och tilldelning**

| # | Use Case | Beskrivning |
|---|----------|-------------|
| KK-1 | Skapa standardutrustningslista | Skapar en mall med artiklar (artikelnummer, namn, kategori, antal) som alla soldater i enheten ska ha tilldelat sig. |
| KK-2 | Importera standardlista | Importerar standardlistan från CSV-fil. Format: artikelnummer, namn, kategori, antal. |
| KK-3 | Tilldela standardlista till soldat | Tilldelar standardlistan till en enskild soldat (t.ex. vid nyrekrytering). Skapar soldatens personliga utrustningslista. |
| KK-4 | Tilldela standardlista till enhet | Tilldelar standardlistan till alla soldater i en grupp, pluton eller kompani i ett svep. |
| KK-5 | Uppdatera standardlista | Lägger till, tar bort eller justerar artiklar i standardlistan. Påverkar inte redan tilldelade listor automatiskt — KVM väljer om ändringen ska propageras. |

**Avvikelser — "ej mottagen"**

| # | Use Case | Beskrivning |
|---|----------|-------------|
| KK-6 | Granska "ej mottagen"-flaggning | Granskar ärenden där soldater flaggat att de inte erhållit en artikel. Ser soldatens lista och flaggad artikel. |
| KK-7 | Godkänna "ej mottagen"-flaggning | Bekräftar att artikeln inte delats ut. Artikeln markeras "ej tilldelad" i soldatens lista. Soldat notifieras. |
| KK-8 | Avslå "ej mottagen"-flaggning | Avslår med skriftlig motivering. Artikeln kvarstår i soldatens lista med status "ok". Soldat notifieras. |

**Beställningar och förlust**

| # | Use Case | Beskrivning |
|---|----------|-------------|
| KK-9 | Se kompaniets utrustningsbrister | Samlad vy med bristläge per artikel och soldat: ej mottagna, förlustanmälda, byte pågår. Primär arbetsyta för att prioritera och agera på avvikelser. |
| KK-10 | Följa beställningar | Ser status på pågående beställningar av ersättningspersedlar inom kompaniet. |
| KK-11 | Hantera beställningar | Bekräftar och administrerar beställningar. Uppdaterar soldatens lista vid leverans. |
| KK-12 | Granska förlustanmälan | Läser in ärendet, PC:s yttrande och underlag. |
| KK-13 | Godkänna förlustanmälan | Godkänner ärendet — triggar ersättningsbeställning och uppdaterar registret. Soldat notifieras. |
| KK-14 | Avslå förlustanmälan | Avslår med skriftlig motivering. Registret återställs och soldat notifieras. |
---

## S4 — Kvartermästare Bataljon

Äger org-trädet och standardlistan på bataljonsnivå. Kan delegera utrustningsadministration till KVM per kompani.

**Org-träd och personalförvaltning**

| # | Use Case | Beskrivning |
|---|----------|-------------|
| S4-1 | Förvalta org-trädet | Skapar, byter namn på och tar bort enheter (kompani, pluton, grupp) i bataljonens organisationsträd. Är den enda rollen som kan ändra trädstrukturen. |
| S4-2 | Utse KompCh och KVM | Tilldelar rollerna KompCh och Kvartermästare Kompani till individer. |
| S4-3 | Flytta enhet i trädet | Omplacerar en pluton eller grupp under annat kompani eller pluton. |

**Utrustning**

| # | Use Case | Beskrivning |
|---|----------|-------------|
| S4-4 | Skapa/importera bataljonsstandardlista | Skapar eller importerar en gemensam baslista för hela bataljonen som KVM per kompani kan utgå ifrån och anpassa. |
| S4-5 | Se bataljonens utrustningsbrister | Samlad vy över alla kompanier och soldaters utrustning, nedbruten per kompani. Bristläge aggregerat per enhet och i detalj per soldat. |
| S4-6 | Godkänna förlustanmälan (bataljonsnivå) | Hanterar förlustärenden som eskaleras från kompaninivå. Triggar ersättningsbeställning vid godkännande. |
| S4-7 | Avslå förlustanmälan (bataljonsnivå) | Avslår eskalerade ärenden med motivering. |

---

## BatCh — Bataljonschef

| # | Use Case | Beskrivning |
|---|----------|-------------|
| B-1 | Bataljonsöverblick | Ser samlad status för hela bataljonen — aktiviteter, närvaro, utrustning. |
| B-2 | Se statistik och rapporter | Tar del av aggregerad statistik över kompanier (närvaro, attesterad tid, utrustningsstatus). |
| B-3 | Budgetgodkännande | Godkänner budgetrelaterade beslut på bataljonsnivå. |

---

## Stab — S1–S6

| # | Use Case | Roll | Beskrivning |
|---|----------|------|-------------|
| ST-1 | Bataljonsöverblick | S1–S6 | Tillgång till hela bataljonens data, filtrerat per ansvarsområde. |
| ST-2 | Exportera till PDF | S1 | Exporterar attesterade rapporter (tid, körmil, utlägg) till PDF per soldat, kompani eller tidsperiod. Används som underlag för lön och ersättning. |
| ST-3 | Exportera till CSV | S1 | Exporterar samma underlag som ovan i CSV-format för import i lönesystem. |
| ST-4 | Se personalstatus och närvaro | S1 | Ser närvaro (anmält vs faktiskt) och aktivitetsstatus per soldat och enhet. |
| ST-5 | Verifiera utlägg mot kvitto | S1/MR | Mottar fysiska originalkvitton från soldater och matchar mot registrerade utlägg i systemet innan utbetalning. |

---

## Systemövergripande use cases (alla roller)

| # | Use Case | Beskrivning |
|---|----------|-------------|
| SYS-1 | Logga ut | Avslutar sessionen. |
| SYS-2 | Se notifieringar | Tar emot och läser webb-push eller e-postnotifieringar om relevanta händelser. |
| SYS-3 | Audit trail | Alla åtgärder loggas med tidsstämpel och användare (läses av systemadministratör). |

---

## Aktivitetsflöde — Från skapande till rapportering

```
PC/KompCh skapar aktivitet (P-2 / K-2)
  → System skickar inbjudan till berörda soldater (S-3)
    → Soldat svarar ja/nej/kanske (S-4)
    → [Inget svar] System skickar automatisk påminnelse (S-5)
    → [Manuell] PC skickar påminnelse (P-4)
      → Aktivitet startar
        → GrpC genomför närvarokontroll (G-2) — faktisk närvaro markeras
          → Aktivitet genomförd
            → Soldat redovisar tid (S-6)
            → Soldat redovisar körmil (S-7)
            → Soldat redovisar utlägg (S-8) → System uppmanar: skicka kvitto till MR-grupp/HR
              → PC granskar (P-5)
                → KompCh attesterar (K-3)
                  → KompCh/S1 exporterar till PDF eller CSV (K-4 / ST-2 / ST-3)
```

## Attesteringsflöde — Tid, körmil och utlägg

```
Soldat redovisar (S-6, S-7, S-8)
  → PC granskar (P-5)  ← kan returnera med kommentar
    → KompCh attesterar (K-3)
      → S1 exporterar till PDF/CSV (ST-2, ST-3)
        → [Utlägg] S1/MR matchar mot fysiskt kvitto (ST-5) → utbetalning
```

## Individprofil

Varje individ i systemet har följande fält. "Chef" lagras aldrig — den härledds alltid ur var i org-trädet individen befinner sig.

| Fält | Källa | Redigerbar av |
|------|-------|---------------|
| Personnummer | BankID (vid inloggning) | Ingen |
| Namn | BankID (vid inloggning) | Ingen |
| Roll | Chef på nivån ovan | Chef på nivån ovan |
| Enhetstillhörighet | Chef på nivån ovan | Chef på nivån ovan |
| E-postadress | Individen själv | Individen själv |
| Mobilnummer | Individen själv | Individen själv |

> **En individ tillhör alltid exakt en enhet.** Flytt till ny enhet innebär att den gamla tillhörigheten upphör omedelbart.

## Flöde — Onboarding av ny soldat

```
GrpC registrerar personnummer i sin grupp (G-2)
  → System skapar ett "väntande" konto kopplat till gruppen
    → Soldat loggar in med BankID första gången (S-1)
      → System matchar personnummer → konto aktiveras med namn från BankID
        → Soldat kompletterar profil: e-post + mobilnummer (S-2)
          → Soldat får tillgång till alla funktioner för sin grupp/pluton/kompani
```

> Om en soldat loggar in med BankID utan att vara förregistrerad hamnar de i väntläge (S-3) tills en chef lägger till dem.

## Befogenheter — Rolltilldelning

Varje chefsnivå kan bara utse befäl ett steg ned i hierarkin:

| Utser | Befogenhet hos |
|-------|---------------|
| GrpC | PC |
| PC | KompCh |
| KompCh | S4 |
| KVM | S4 |
| BatCh/Stab | S4 (på uppdrag) |

---

## Systembeteende — Statusflaggar i utrustningslistan

Varje artikel i en soldats utrustningslista bär en statusflagga som uppdateras automatiskt när ett ärende öppnas eller stängs:

| Status | Visas när |
|--------|-----------|
| *(ingen flagga)* | Artikel ok, inget aktivt ärende. |
| **ej mottagen** | Soldat har flaggat artikel som ej erhållen — ärende väntar på KVM-beslut. |
| **ej tilldelad** | KVM har godkänt "ej mottagen" — artikeln har aldrig delats ut. |
| **förlustanmäld** | Aktivt förlustärende är öppet på artikeln. Artikeln är låst för andra åtgärder. |
| **byte pågår** | Ersättningsbeställning är initierad (antingen via beställning eller godkänd förlust). |

Flaggarna syns för soldaten i S-9, och aggregeras i brist-vyerna G-3, P-6, K-5, KK-9 och S4-2.

---

## Ärendeflöde — Utrustningslista: tilldelning och "ej mottagen"

```
KVM skapar eller importerar standardlista (KK-1 / KK-2 / S4-1)
  → KVM tilldelar lista till soldat eller enhet (KK-3 / KK-4)
    → System skapar individens personliga utrustningslista baserad på standardlistan
      → Soldat ser sin lista (S-9)
        → [Om artikel saknas] Soldat flaggar "ej mottagen" (S-10)
          → KVM granskar flaggning (KK-6)
            → Godkänt (KK-7): artikel markeras "ej tilldelad", soldat notifieras
            → Avslaget (KK-8): flaggning avvisas med kommentar, artikel kvarstår, soldat notifieras
```

## Ärendeflöde — Förlustanmälan

```
Soldat initierar (S-12)
  → System låser artikel + notifierar PC
    → PC lämnar yttrande (P-6)
      → KVM granskar (KK-12)
        → Godkänt (KK-13): beställning triggas, register uppdateras, soldat notifieras
        → Avslaget (KK-14): motivering returneras, register återställs, soldat notifieras
        → [Eskalering] KVM vidarebefordrar till S4
          → S4 godkänner (S4-3) eller avslår (S4-4)
```
