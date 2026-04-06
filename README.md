# APPLICAZIONE - OC

Piattaforma SaaS multi-tenant per un'agenzia di marketing italiana che gestisce ottiche. Dashboard in tempo reale per mostrare ai clienti i risultati delle campagne ads, riattivazione WhatsApp e email marketing.

## Setup

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Credenziali Demo

| Ruolo   | Email                        | Password |
|---------|------------------------------|----------|
| Admin   | admin@oc-agenzia.it          | admin123 |
| Cliente | demo@otticavillanova.it      | demo123  |

## Struttura

```
src/
├── app/
│   ├── login/            # Pagina login
│   ├── dashboard/        # Dashboard cliente (nota + ads + WA + email)
│   ├── andamento/        # Storico e totali
│   ├── admin/            # Pannello admin
│   │   ├── clienti/
│   │   │   ├── [id]/     # Dettaglio cliente + "Vedi come il cliente"
│   │   │   └── nuovo/    # Wizard creazione cliente
│   │   └── spese/        # Inserimento rapido spese ads settimanali
│   └── api/
│       ├── auth/login/   # API autenticazione
│       ├── clients/      # API dati clienti
│       ├── weekly-sync/  # Cron: sync settimanale GHL
│       └── weekly-note/  # Generazione nota AI
├── components/
│   ├── ui/               # KpiCard, SectionCard, ProgressBar, Badge, etc.
│   ├── charts/           # BarChart, LineChart, DualBarChart
│   └── layout/           # Sidebar, BottomNav (client + admin)
├── lib/
│   ├── auth.ts           # Autenticazione
│   ├── auth-context.tsx  # React Context auth + viewAs
│   ├── ghl.ts            # Funzioni GHL con TODO documentati
│   ├── mock-data.ts      # Dati mock realistici
│   └── utils.ts          # Formatters, helpers
└── types/
    └── index.ts          # TypeScript types
```

## Fonti Dati

Tutti i dati provengono da **GHL (GoHighLevel)**. Le funzioni in `/lib/ghl.ts` sono placeholder documentati con TODO precisi per il collegamento alle API reali.

- **Lead ads**: contatti GHL con tag `lead_form`
- **Pipeline WhatsApp**: opportunità GHL filtrate per pipeline
- **Conversazioni AI**: conversations GHL
- **Email marketing**: campagne email GHL
- **Spesa ads**: unico dato manuale (admin, 1x/settimana)

## Automazione Settimanale

Ogni lunedì alle 8:00 (configurato in `vercel.json`):
1. Sync dati da GHL per ogni cliente
2. Genera nota settimanale con Claude AI
3. Salva come "Non letta" → badge "Nuovo" per il cliente

## Prossimi Passi

1. **Database**: Aggiungere Prisma + PostgreSQL (Supabase/Neon)
2. **Auth reale**: Sostituire localStorage con NextAuth.js + JWT
3. **GHL API**: Implementare le funzioni in `lib/ghl.ts`
4. **Claude AI**: Collegare Anthropic API per generazione note
5. **Email invito**: Implementare invio email (Resend/SendGrid)
6. **Font Inter**: Aggiungere il font Inter da Google Fonts in produzione

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Recharts (grafici)
- Lucide React (icone)
