import { mockClients } from '@/lib/mock-data';
import ClientDetailContent from './client-detail';

export function generateStaticParams() {
  return mockClients.map((client) => ({
    id: client.id,
  }));
}

export default function ClientDetailPage() {
  return <ClientDetailContent />;
}
