// ============================================================
// GHL (GoHighLevel) API Integration
// ============================================================
// Tutte le fonti dati vengono da GHL. NON collegare Meta API.
// Ogni funzione accetta locationId e apiKey del cliente specifico.
//
// GHL API Base URL: https://services.leadconnectorhq.com
// Auth: Header "Authorization: Bearer {apiKey}"
// Docs: https://highlevel.stoplight.io/docs/integrations
// ============================================================

import type { AdsData, WhatsAppStats, Conversation, EmailData } from '@/types';

const GHL_BASE_URL = 'https://services.leadconnectorhq.com';

// Helper per le chiamate GHL
async function ghlFetch(endpoint: string, apiKey: string) {
  // TODO: Implementare quando si collegano le API GHL reali
  // const response = await fetch(`${GHL_BASE_URL}${endpoint}`, {
  //   headers: {
  //     'Authorization': `Bearer ${apiKey}`,
  //     'Version': '2021-07-28',
  //     'Content-Type': 'application/json',
  //   },
  // });
  // if (!response.ok) throw new Error(`GHL API error: ${response.status}`);
  // return response.json();
  console.log(`[GHL] Would fetch: ${GHL_BASE_URL}${endpoint}`);
  return null;
}

/**
 * Lead settimanali da form Meta
 *
 * GHL riceve i lead dai Meta Lead Form automaticamente.
 * Endpoint: GET /contacts/
 * Filtri: tag "lead_form", dateAdded >= weekStart
 *
 * TODO: Implementare con GHL API reale
 * - GET /contacts/?locationId={locationId}&query=&tags[]=lead_form
 * - Filtrare per dateAdded >= weekStart e dateAdded < weekEnd
 * - Contare i risultati per il numero di lead
 * - Sommare le impressions dal campo custom "reach" se disponibile
 */
export async function getWeeklyLeads(
  locationId: string,
  apiKey: string,
  weekStart: string
): Promise<AdsData> {
  // TODO: Sostituire con chiamata GHL reale
  await ghlFetch(`/contacts/?locationId=${locationId}&tags[]=lead_form`, apiKey);

  // Mock data - rimuovere quando collegato a GHL
  return {
    weekStart,
    leads: 28,
    reach: 6200,
    spend: 0, // La spesa viene inserita manualmente dall'admin
  };
}

/**
 * Statistiche pipeline WhatsApp (riattivazione clienti dormienti)
 *
 * L'agente AI su WhatsApp crea opportunità nella pipeline GHL.
 * Endpoint: GET /opportunities/search
 * Filtri: pipelineId per la pipeline "Riattivazione WhatsApp"
 *
 * TODO: Implementare con GHL API reale
 * - GET /opportunities/search?location_id={locationId}&pipeline_id={pipelineId}
 * - Contare opportunità per stage:
 *   - "Contattato" → contacted
 *   - "Ha risposto" → replied
 *   - "Appuntamento fissato" → appointments
 *   - "In conversazione" → activeConversations
 * - Il totale database viene dal conteggio contatti con tag "database_cliente"
 */
export async function getPipelineStats(
  locationId: string,
  apiKey: string
): Promise<WhatsAppStats> {
  // TODO: Sostituire con chiamata GHL reale
  await ghlFetch(`/opportunities/search?location_id=${locationId}`, apiKey);

  return {
    totalDatabase: 3475,
    contacted: 847,
    replied: 312,
    appointments: 89,
    activeConversations: 43,
  };
}

/**
 * Conversazioni recenti WhatsApp
 *
 * Recupera le ultime conversazioni gestite dall'agente AI.
 * Endpoint: GET /conversations/
 * Ordine: lastMessageDate DESC, limit 5
 *
 * TODO: Implementare con GHL API reale
 * - GET /conversations/?locationId={locationId}&sort=desc&sortBy=last_message_date&limit=5
 * - Per ogni conversazione, recuperare anche i messaggi:
 *   GET /conversations/{conversationId}/messages
 * - Mappare lo status dalla pipeline stage dell'opportunità collegata
 */
export async function getRecentConversations(
  locationId: string,
  apiKey: string
): Promise<Conversation[]> {
  // TODO: Sostituire con chiamata GHL reale
  await ghlFetch(`/conversations/?locationId=${locationId}&sort=desc&limit=5`, apiKey);

  return []; // Mock data viene gestito separatamente
}

/**
 * Metriche email settimanali
 *
 * Statistiche delle campagne email inviate tramite GHL.
 * Endpoint: GET /campaigns/ o /emails/
 *
 * TODO: Implementare con GHL API reale
 * - GET /campaigns/?locationId={locationId}
 * - Filtrare campagne per data >= weekStart
 * - Per ogni campagna, ottenere statistiche:
 *   - emails sent (inviate)
 *   - open rate (tasso apertura)
 *   - click count (click)
 *   - reply count (risposte)
 * - Aggregare i totali per la settimana
 */
export async function getEmailMetrics(
  locationId: string,
  apiKey: string,
  weekStart: string
): Promise<EmailData> {
  // TODO: Sostituire con chiamata GHL reale
  await ghlFetch(`/campaigns/?locationId=${locationId}`, apiKey);

  return {
    weekStart,
    sent: 520,
    openRate: 34,
    clicks: 89,
    replies: 23,
  };
}

/**
 * Sync completo settimanale per un cliente
 *
 * Chiamato ogni lunedì alle 8:00 dal cron job.
 * Recupera tutti i dati da GHL e li salva nel DB.
 *
 * TODO: Implementare salvataggio su DB reale
 */
export async function syncClientData(
  locationId: string,
  apiKey: string,
  weekStart: string
) {
  const [leads, pipeline, conversations, email] = await Promise.all([
    getWeeklyLeads(locationId, apiKey, weekStart),
    getPipelineStats(locationId, apiKey),
    getRecentConversations(locationId, apiKey),
    getEmailMetrics(locationId, apiKey, weekStart),
  ]);

  return { leads, pipeline, conversations, email };
}
