// ============================================================
// APPLICAZIONE - OC: Types
// ============================================================

export interface Client {
  id: string;
  businessName: string;
  slug: string;
  email: string;
  password: string; // In production: hashed
  phone: string;
  address: string;
  logoUrl?: string;
  accentColor: string;
  ghlLocationId: string;
  ghlApiKey: string;
  isActive: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin';
}

export interface WeeklyNote {
  id: string;
  clientId: string;
  weekStart: string;
  content: string;
  isRead: boolean;
  generatedAt: string;
}

export interface AdsData {
  weekStart: string;
  leads: number;
  reach: number;
  spend: number;
}

export interface WhatsAppStats {
  totalDatabase: number;
  contacted: number;
  replied: number;
  appointments: number;
  activeConversations: number;
}

export interface Conversation {
  id: string;
  clientId: string;
  contactName: string;
  lastMessage: string;
  date: string;
  time: string;
  status: 'in_conversazione' | 'appuntamento_fissato' | 'lead_caldo' | 'non_risposto';
  messages?: ConversationMessage[];
}

export interface ConversationMessage {
  id: string;
  sender: 'agent' | 'contact';
  text: string;
  timestamp: string;
}

export interface EmailData {
  weekStart: string;
  sent: number;
  openRate: number;
  clicks: number;
  replies: number;
}

export interface WeeklySpend {
  clientId: string;
  weekStart: string;
  amount: number;
  updatedAt: string;
  updatedBy: string;
}

export interface GHLSyncStatus {
  clientId: string;
  lastSync: string | null;
  status: 'ok' | 'error' | 'pending' | 'never';
  errorMessage?: string;
}

export interface DashboardData {
  client: Client;
  weeklyNote: WeeklyNote | null;
  ads: AdsData;
  adsHistory: AdsData[];
  whatsapp: WhatsAppStats;
  conversations: Conversation[];
  email: EmailData;
  emailHistory: EmailData[];
}

export interface AndamentoData {
  weeklyHistory: {
    weekStart: string;
    leads: number;
    appointments: number;
    emailOpened: number;
  }[];
  totals: {
    totalReach: number;
    totalLeads: number;
    totalAppointments: number;
    totalEmailsSent: number;
  };
}

export type UserSession = {
  id: string;
  email: string;
  role: 'admin' | 'client';
  clientId?: string;
  name: string;
};
