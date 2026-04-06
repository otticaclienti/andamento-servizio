import type {
  Client,
  AdminUser,
  WeeklyNote,
  AdsData,
  WhatsAppStats,
  Conversation,
  ConversationMessage,
  EmailData,
  DashboardData,
  AndamentoData,
  GHLSyncStatus,
} from '@/types';

// ============================================================
// Utenti
// ============================================================

export const adminUser: AdminUser = {
  id: 'admin-1',
  email: 'admin@oc-agenzia.it',
  password: 'admin123',
  name: 'Team OC',
  role: 'admin',
};

export const mockClients: Client[] = [
  {
    id: 'client-1',
    businessName: 'Ottica Villanova d\'Asti',
    slug: 'ottica-villanova',
    email: 'demo@otticavillanova.it',
    password: 'demo123',
    phone: '+39 0141 946XXX',
    address: 'Via Roma 42, Villanova d\'Asti (AT)',
    accentColor: '#0EA5E9',
    ghlLocationId: 'loc_villanova_001',
    ghlApiKey: 'ghl_test_key_villanova',
    isActive: true,
    createdAt: '2025-09-15',
  },
  {
    id: 'client-2',
    businessName: 'Ottica Moderna Torino',
    slug: 'ottica-moderna',
    email: 'info@otticamoderna.it',
    password: 'demo123',
    phone: '+39 011 812XXXX',
    address: 'Corso Vittorio Emanuele II 18, Torino',
    accentColor: '#8B5CF6',
    ghlLocationId: 'loc_moderna_002',
    ghlApiKey: 'ghl_test_key_moderna',
    isActive: true,
    createdAt: '2025-10-01',
  },
  {
    id: 'client-3',
    businessName: 'Ottica San Marco',
    slug: 'ottica-sanmarco',
    email: 'info@otticasanmarco.it',
    password: 'demo123',
    phone: '+39 045 590XXXX',
    address: 'Piazza San Marco 7, Verona',
    accentColor: '#10B981',
    ghlLocationId: 'loc_sanmarco_003',
    ghlApiKey: 'ghl_test_key_sanmarco',
    isActive: true,
    createdAt: '2025-11-10',
  },
  {
    id: 'client-4',
    businessName: 'Ottica Belvedere',
    slug: 'ottica-belvedere',
    email: 'info@otticabelvedere.it',
    password: 'demo123',
    phone: '+39 055 234XXXX',
    address: 'Via dei Calzaiuoli 22, Firenze',
    accentColor: '#F59E0B',
    ghlLocationId: 'loc_belvedere_004',
    ghlApiKey: 'ghl_test_key_belvedere',
    isActive: false,
    createdAt: '2025-08-20',
  },
];

// ============================================================
// Nota settimanale
// ============================================================

export const mockWeeklyNote: WeeklyNote = {
  id: 'note-1',
  clientId: 'client-1',
  weekStart: '2026-03-30',
  content:
    'Questa settimana abbiamo raggiunto oltre 6.200 persone nella zona di Villanova d\'Asti e dintorni. 28 nuove persone hanno lasciato i loro contatti per ricevere informazioni sui vostri occhiali. Il nostro agente ha conversato con 43 vostri clienti storici — 3 hanno già fissato un appuntamento. Abbiamo anche inviato la newsletter a 520 contatti con un tasso di apertura del 34%, ottimo risultato per il settore. Continuiamo così!',
  isRead: false,
  generatedAt: '2026-03-30T08:00:00Z',
};

// ============================================================
// Dati Ads
// ============================================================

export const mockCurrentAds: AdsData = {
  weekStart: '2026-03-30',
  leads: 28,
  reach: 6200,
  spend: 380,
};

export const mockAdsHistory: AdsData[] = [
  { weekStart: '2026-02-23', leads: 12, reach: 3800, spend: 320 },
  { weekStart: '2026-03-02', leads: 18, reach: 4500, spend: 350 },
  { weekStart: '2026-03-09', leads: 23, reach: 5200, spend: 360 },
  { weekStart: '2026-03-16', leads: 19, reach: 4800, spend: 340 },
  { weekStart: '2026-03-23', leads: 25, reach: 5900, spend: 370 },
  { weekStart: '2026-03-30', leads: 28, reach: 6200, spend: 380 },
];

// ============================================================
// Dati WhatsApp
// ============================================================

export const mockWhatsAppStats: WhatsAppStats = {
  totalDatabase: 3475,
  contacted: 847,
  replied: 312,
  appointments: 89,
  activeConversations: 43,
};

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    clientId: 'client-1',
    contactName: 'Mario Rossi',
    lastMessage: 'Interessato agli occhiali progressivi, vuole sapere i prezzi',
    date: '2026-04-05',
    time: '14:32',
    status: 'in_conversazione',
    messages: [
      { id: 'm1', sender: 'agent', text: 'Buongiorno Mario! Sono l\'assistente di Ottica Villanova. Come sta? È passato un po\' di tempo dalla sua ultima visita e volevamo aggiornarla sulle nostre novità.', timestamp: '2026-04-05T10:00:00Z' },
      { id: 'm2', sender: 'contact', text: 'Buongiorno! Sì, è vero, è un po\' che non passo. Avete novità sugli occhiali progressivi?', timestamp: '2026-04-05T10:15:00Z' },
      { id: 'm3', sender: 'agent', text: 'Certamente! Abbiamo ricevuto la nuova collezione di lenti progressive Essilor con tecnologia avanzata. Offriamo anche un controllo vista gratuito. Le interessa?', timestamp: '2026-04-05T10:16:00Z' },
      { id: 'm4', sender: 'contact', text: 'Sì mi interessa. Quali sono i prezzi più o meno?', timestamp: '2026-04-05T14:32:00Z' },
    ],
  },
  {
    id: 'conv-2',
    clientId: 'client-1',
    contactName: 'Laura Bianchi',
    lastMessage: 'Ha fissato appuntamento martedì 8 aprile alle 10:30',
    date: '2026-04-04',
    time: '11:20',
    status: 'appuntamento_fissato',
    messages: [
      { id: 'm5', sender: 'agent', text: 'Buongiorno Laura! Come sta? Le scrivo da Ottica Villanova per ricordarle che è disponibile il controllo vista gratuito.', timestamp: '2026-04-04T09:00:00Z' },
      { id: 'm6', sender: 'contact', text: 'Ciao! Sì, in effetti dovrei controllare, mi sembra di non vedere più bene da vicino.', timestamp: '2026-04-04T09:30:00Z' },
      { id: 'm7', sender: 'agent', text: 'Capisco perfettamente! Possiamo fissare un appuntamento questa settimana. Le andrebbe bene martedì mattina?', timestamp: '2026-04-04T09:31:00Z' },
      { id: 'm8', sender: 'contact', text: 'Martedì alle 10:30 va benissimo!', timestamp: '2026-04-04T11:20:00Z' },
      { id: 'm9', sender: 'agent', text: 'Perfetto! Appuntamento confermato per martedì 8 aprile alle 10:30. A presto Laura! 😊', timestamp: '2026-04-04T11:21:00Z' },
    ],
  },
  {
    id: 'conv-3',
    clientId: 'client-1',
    contactName: 'Giuseppe Ferraro',
    lastMessage: 'Ha chiesto info sul controllo vista gratuito',
    date: '2026-04-03',
    time: '16:45',
    status: 'in_conversazione',
    messages: [
      { id: 'm10', sender: 'agent', text: 'Buongiorno Giuseppe! Le scrivo da Ottica Villanova. Sapeva che offriamo un controllo della vista completamente gratuito?', timestamp: '2026-04-03T14:00:00Z' },
      { id: 'm11', sender: 'contact', text: 'No, non lo sapevo. Come funziona?', timestamp: '2026-04-03T16:45:00Z' },
    ],
  },
  {
    id: 'conv-4',
    clientId: 'client-1',
    contactName: 'Anna Conti',
    lastMessage: 'Ha risposto positivamente all\'offerta progressivi',
    date: '2026-04-02',
    time: '09:15',
    status: 'lead_caldo',
    messages: [
      { id: 'm12', sender: 'agent', text: 'Buongiorno Anna! Ottica Villanova ha una promozione speciale sulle lenti progressive questo mese. Le interessa saperne di più?', timestamp: '2026-04-02T08:00:00Z' },
      { id: 'm13', sender: 'contact', text: 'Sì, mi interessa molto! Ho bisogno di cambiare i miei occhiali progressivi.', timestamp: '2026-04-02T09:15:00Z' },
    ],
  },
  {
    id: 'conv-5',
    clientId: 'client-1',
    contactName: 'Roberto Mele',
    lastMessage: 'Vuole venire con la moglie a vedere le montature',
    date: '2026-04-01',
    time: '17:00',
    status: 'appuntamento_fissato',
    messages: [
      { id: 'm14', sender: 'agent', text: 'Buongiorno Roberto! Come sta? Le scrivo da Ottica Villanova per presentarle le nuove montature arrivate in negozio.', timestamp: '2026-04-01T11:00:00Z' },
      { id: 'm15', sender: 'contact', text: 'Ciao! Interessante, vorrei venire a vederle con mia moglie. Quando siete aperti?', timestamp: '2026-04-01T17:00:00Z' },
      { id: 'm16', sender: 'agent', text: 'Siamo aperti dal martedì al sabato, dalle 9 alle 19. Vi aspettiamo!', timestamp: '2026-04-01T17:01:00Z' },
    ],
  },
];

// ============================================================
// Dati Email
// ============================================================

export const mockCurrentEmail: EmailData = {
  weekStart: '2026-03-30',
  sent: 520,
  openRate: 34,
  clicks: 89,
  replies: 23,
};

export const mockEmailHistory: EmailData[] = [
  { weekStart: '2026-02-23', sent: 380, openRate: 28, clicks: 52, replies: 12 },
  { weekStart: '2026-03-02', sent: 420, openRate: 31, clicks: 61, replies: 15 },
  { weekStart: '2026-03-09', sent: 480, openRate: 33, clicks: 72, replies: 18 },
  { weekStart: '2026-03-16', sent: 500, openRate: 30, clicks: 68, replies: 16 },
  { weekStart: '2026-03-23', sent: 510, openRate: 32, clicks: 78, replies: 20 },
  { weekStart: '2026-03-30', sent: 520, openRate: 34, clicks: 89, replies: 23 },
];

// ============================================================
// Dati Andamento (storico 12 settimane)
// ============================================================

export const mockAndamentoData: AndamentoData = {
  weeklyHistory: [
    { weekStart: '2026-01-12', leads: 8, appointments: 2, emailOpened: 95 },
    { weekStart: '2026-01-19', leads: 10, appointments: 3, emailOpened: 110 },
    { weekStart: '2026-01-26', leads: 9, appointments: 4, emailOpened: 105 },
    { weekStart: '2026-02-02', leads: 14, appointments: 5, emailOpened: 120 },
    { weekStart: '2026-02-09', leads: 11, appointments: 4, emailOpened: 115 },
    { weekStart: '2026-02-16', leads: 15, appointments: 6, emailOpened: 130 },
    { weekStart: '2026-02-23', leads: 12, appointments: 5, emailOpened: 106 },
    { weekStart: '2026-03-02', leads: 18, appointments: 7, emailOpened: 130 },
    { weekStart: '2026-03-09', leads: 23, appointments: 9, emailOpened: 158 },
    { weekStart: '2026-03-16', leads: 19, appointments: 8, emailOpened: 150 },
    { weekStart: '2026-03-23', leads: 25, appointments: 10, emailOpened: 163 },
    { weekStart: '2026-03-30', leads: 28, appointments: 12, emailOpened: 177 },
  ],
  totals: {
    totalReach: 68400,
    totalLeads: 342,
    totalAppointments: 89,
    totalEmailsSent: 5840,
  },
};

// ============================================================
// Stato sincronizzazione GHL
// ============================================================

export const mockSyncStatuses: GHLSyncStatus[] = [
  { clientId: 'client-1', lastSync: '2026-03-30T08:00:00Z', status: 'ok' },
  { clientId: 'client-2', lastSync: '2026-03-30T08:01:00Z', status: 'ok' },
  { clientId: 'client-3', lastSync: '2026-03-30T07:55:00Z', status: 'error', errorMessage: 'API key scaduta' },
  { clientId: 'client-4', lastSync: null, status: 'never' },
];

// ============================================================
// Spese settimanali
// ============================================================

export const mockWeeklySpends = [
  { clientId: 'client-1', weekStart: '2026-03-30', amount: 380, updatedAt: '2026-03-31T10:00:00Z', updatedBy: 'admin-1' },
  { clientId: 'client-1', weekStart: '2026-03-23', amount: 370, updatedAt: '2026-03-24T10:00:00Z', updatedBy: 'admin-1' },
  { clientId: 'client-2', weekStart: '2026-03-30', amount: 450, updatedAt: '2026-03-31T10:00:00Z', updatedBy: 'admin-1' },
  { clientId: 'client-3', weekStart: '2026-03-30', amount: 290, updatedAt: '2026-03-31T10:00:00Z', updatedBy: 'admin-1' },
];

// ============================================================
// Helper: get dashboard data per un cliente
// ============================================================

export function getMockDashboardData(clientId: string): DashboardData | null {
  const client = mockClients.find((c) => c.id === clientId);
  if (!client) return null;

  // Per il cliente demo usiamo dati completi, per gli altri dati ridotti
  if (clientId === 'client-1') {
    return {
      client,
      weeklyNote: mockWeeklyNote,
      ads: mockCurrentAds,
      adsHistory: mockAdsHistory,
      whatsapp: mockWhatsAppStats,
      conversations: mockConversations,
      email: mockCurrentEmail,
      emailHistory: mockEmailHistory,
    };
  }

  // Dati generici per altri clienti
  return {
    client,
    weeklyNote: {
      id: `note-${clientId}`,
      clientId,
      weekStart: '2026-03-30',
      content: `Settimana positiva per ${client.businessName}. Le campagne stanno procedendo bene e stiamo vedendo un buon interesse nella vostra zona. Continuiamo a lavorare per portarvi sempre più clienti!`,
      isRead: true,
      generatedAt: '2026-03-30T08:00:00Z',
    },
    ads: { weekStart: '2026-03-30', leads: 15, reach: 4200, spend: 320 },
    adsHistory: [
      { weekStart: '2026-02-23', leads: 8, reach: 2800, spend: 280 },
      { weekStart: '2026-03-02', leads: 10, reach: 3200, spend: 300 },
      { weekStart: '2026-03-09', leads: 13, reach: 3600, spend: 310 },
      { weekStart: '2026-03-16', leads: 11, reach: 3400, spend: 290 },
      { weekStart: '2026-03-23', leads: 14, reach: 3900, spend: 310 },
      { weekStart: '2026-03-30', leads: 15, reach: 4200, spend: 320 },
    ],
    whatsapp: { totalDatabase: 2100, contacted: 520, replied: 180, appointments: 45, activeConversations: 22 },
    conversations: [],
    email: { weekStart: '2026-03-30', sent: 380, openRate: 29, clicks: 52, replies: 11 },
    emailHistory: [
      { weekStart: '2026-02-23', sent: 280, openRate: 25, clicks: 35, replies: 7 },
      { weekStart: '2026-03-02', sent: 310, openRate: 27, clicks: 40, replies: 8 },
      { weekStart: '2026-03-09', sent: 340, openRate: 28, clicks: 44, replies: 9 },
      { weekStart: '2026-03-16', sent: 350, openRate: 26, clicks: 42, replies: 8 },
      { weekStart: '2026-03-23', sent: 370, openRate: 30, clicks: 48, replies: 10 },
      { weekStart: '2026-03-30', sent: 380, openRate: 29, clicks: 52, replies: 11 },
    ],
  };
}

export function getMockAndamentoData(clientId: string): AndamentoData {
  if (clientId === 'client-1') return mockAndamentoData;

  return {
    weeklyHistory: mockAndamentoData.weeklyHistory.map((w) => ({
      ...w,
      leads: Math.round(w.leads * 0.6),
      appointments: Math.round(w.appointments * 0.5),
      emailOpened: Math.round(w.emailOpened * 0.7),
    })),
    totals: {
      totalReach: 42000,
      totalLeads: 198,
      totalAppointments: 45,
      totalEmailsSent: 3800,
    },
  };
}
