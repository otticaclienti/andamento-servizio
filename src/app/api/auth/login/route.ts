import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email e password richiesti' }, { status: 400 });
  }

  const session = authenticate(email, password);
  if (!session) {
    return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 });
  }

  return NextResponse.json({ user: session });
}
