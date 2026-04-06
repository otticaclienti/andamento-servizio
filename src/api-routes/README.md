# API Routes (per Vercel deployment)

Queste route sono state spostate fuori da `app/api/` per permettere
il build statico (GitHub Pages).

Per il deploy su Vercel, spostare i file in `src/app/api/` e rimuovere
`output: "export"` e `basePath` da `next.config.ts`.

## File da ripristinare

- `auth/login/route.ts` → `src/app/api/auth/login/route.ts`
- `clients/route.ts` → `src/app/api/clients/route.ts`
- `weekly-sync/route.ts` → `src/app/api/weekly-sync/route.ts`
- `weekly-note/route.ts` → `src/app/api/weekly-note/route.ts`
