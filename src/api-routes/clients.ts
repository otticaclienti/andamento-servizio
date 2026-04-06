// Move to: src/app/api/clients/route.ts (for Vercel deployment)
import { NextResponse } from 'next/server';
import { mockClients, getMockDashboardData, getMockAndamentoData } from '@/lib/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('id');
  const type = searchParams.get('type');

  if (type === 'list') {
    return NextResponse.json({
      clients: mockClients.map(({ password, ghlApiKey, ...c }) => c),
    });
  }

  if (clientId && type === 'dashboard') {
    const data = getMockDashboardData(clientId);
    if (!data) {
      return NextResponse.json({ error: 'Cliente non trovato' }, { status: 404 });
    }
    const { client: { password, ghlApiKey, ...safeClient }, ...rest } = data;
    return NextResponse.json({ ...rest, client: safeClient });
  }

  if (clientId && type === 'andamento') {
    const data = getMockAndamentoData(clientId);
    return NextResponse.json(data);
  }

  return NextResponse.json({ error: 'Parametri mancanti' }, { status: 400 });
}
