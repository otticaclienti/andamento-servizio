import { NextResponse } from 'next/server';
import { mockClients } from '@/lib/mock-data';

/**
 * API Route: Weekly Sync Cron Job
 *
 * Chiamato ogni lunedì alle 8:00 tramite cron job esterno.
 * Per ogni cliente attivo:
 * 1. Sincronizza dati da GHL
 * 2. Genera nota settimanale con Claude AI
 * 3. Salva nel database
 *
 * Per configurare il cron job:
 * - Vercel Cron: vercel.json con schedule "0 8 * * 1"
 * - Oppure servizio esterno (cron-job.org, EasyCron, etc.)
 *
 * Proteggere con CRON_SECRET in header Authorization.
 */
export async function POST(request: Request) {
  // TODO: Verificare CRON_SECRET
  // const authHeader = request.headers.get('Authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  const activeClients = mockClients.filter((c) => c.isActive);
  const results = [];

  for (const client of activeClients) {
    try {
      // TODO: Step 1 - Sync data from GHL
      // const syncData = await syncClientData(client.ghlLocationId, client.ghlApiKey, weekStart);

      // TODO: Step 2 - Generate weekly note with Claude AI
      // const note = await generateWeeklyNote(client, syncData);

      // TODO: Step 3 - Save to database
      // await saveWeeklyData(client.id, syncData, note);

      results.push({ clientId: client.id, status: 'ok' });
    } catch (error) {
      results.push({
        clientId: client.id,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return NextResponse.json({
    processed: results.length,
    results,
  });
}
