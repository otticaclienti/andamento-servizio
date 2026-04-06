import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: Generate Weekly Note
 *
 * Genera la nota settimanale per un cliente usando Claude AI.
 * Può essere chiamata dal cron job automatico o manualmente dall'admin.
 *
 * POST body: { clientId: string }
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { clientId } = body;

  if (!clientId) {
    return NextResponse.json({ error: 'clientId richiesto' }, { status: 400 });
  }

  // TODO: Recuperare dati reali dal database/GHL
  // const weekData = await getWeekData(clientId);

  // System prompt per la generazione della nota
  const systemPrompt = `Sei l'assistente di un'agenzia di marketing italiana. Scrivi un aggiornamento settimanale per un'ottica italiana.
Scrivi in italiano semplice, tono positivo e professionale, max 4 frasi, nessun termine tecnico, prima persona plurale.
Se i numeri sono bassi usa frasi come "stiamo ottimizzando" o "è normale in questa fase".
Finisci con frase motivante.`;

  // TODO: Chiamare Claude API
  // const response = await anthropic.messages.create({
  //   model: 'claude-sonnet-4-20250514',
  //   max_tokens: 300,
  //   system: systemPrompt,
  //   messages: [{
  //     role: 'user',
  //     content: `Dati settimana per [businessName]:
  //       lead: [N], reach: [N], spesa: €[N],
  //       risposte WA: [N], appuntamenti: [N],
  //       conversazioni attive: [N], email inviate: [N],
  //       tasso apertura: [N]%`
  //   }]
  // });

  // Mock response
  const mockNote = 'Questa settimana abbiamo raggiunto ottimi risultati! Le campagne stanno performando bene e i vostri clienti stanno rispondendo positivamente. Continuiamo su questa strada!';

  return NextResponse.json({
    clientId,
    note: mockNote,
    generatedAt: new Date().toISOString(),
    _systemPrompt: systemPrompt,
  });
}
