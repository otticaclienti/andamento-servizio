// Move to: src/app/api/weekly-note/route.ts (for Vercel deployment)
import { NextRequest, NextResponse } from 'next/server';

/**
 * Generate Weekly Note using Claude AI
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { clientId } = body;

  if (!clientId) {
    return NextResponse.json({ error: 'clientId richiesto' }, { status: 400 });
  }

  const systemPrompt = `Sei l'assistente di un'agenzia di marketing italiana. Scrivi un aggiornamento settimanale per un'ottica italiana.
Scrivi in italiano semplice, tono positivo e professionale, max 4 frasi, nessun termine tecnico, prima persona plurale.
Se i numeri sono bassi usa frasi come "stiamo ottimizzando" o "è normale in questa fase".
Finisci con frase motivante.`;

  // TODO: Chiamare Claude API con anthropic SDK
  const mockNote = 'Questa settimana abbiamo raggiunto ottimi risultati! Le campagne stanno performando bene e i vostri clienti stanno rispondendo positivamente. Continuiamo su questa strada!';

  return NextResponse.json({
    clientId,
    note: mockNote,
    generatedAt: new Date().toISOString(),
    _systemPrompt: systemPrompt,
  });
}
