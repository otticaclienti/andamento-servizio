import type { UserSession } from '@/types';
import { adminUser, mockClients } from './mock-data';

const SESSION_KEY = 'oc_session';

export function authenticate(email: string, password: string): UserSession | null {
  // Check admin
  if (email === adminUser.email && password === adminUser.password) {
    return {
      id: adminUser.id,
      email: adminUser.email,
      role: 'admin',
      name: adminUser.name,
    };
  }

  // Check clients
  const client = mockClients.find((c) => c.email === email && c.password === password);
  if (client) {
    return {
      id: client.id,
      email: client.email,
      role: 'client',
      clientId: client.id,
      name: client.businessName,
    };
  }

  return null;
}

export function setSession(session: UserSession): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

export function getSession(): UserSession | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}
