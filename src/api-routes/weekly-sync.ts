// Move to: src/app/api/weekly-sync/route.ts (for Vercel deployment)
import { NextResponse } from 'next/server';
import { mockClients } from '@/lib/mock-data';

/**
 * Weekly Sync Cron Job - ogni lunedì alle 8:00
 * Proteggere con CRON_SECRET in header Authorization.
 */
export async function POST(request: Request) {
  // TODO: Verificare CRON_SECRET
  const activeClients = mockClients.filter((c) => c.isActive);
  const results = [];

  for (const client of activeClients) {
    try {
      // TODO: syncClientData, generateWeeklyNote, saveWeeklyData
      results.push({ clientId: client.id, status: 'ok' });
    } catch (error) {
      results.push({
        clientId: client.id,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
