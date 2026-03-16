
import { NotificationItem } from '../../types';

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-overdue-F2023002',
    type: 'invoice_overdue_sales',
    title: 'Facture en retard',
    description: 'La facture F2023002 pour Beta Industries est en retard de paiement. Il est conseillé de relancer le client.',
    status: 'pending',
    timestamp: '2024-07-29T10:00:00Z',
    relatedData: {
      invoiceId: 'F2023002',
      invoiceNumber: 'F2023002',
      clientName: 'Beta Industries',
      amount: 350.00
    },
    urgent: true,
  },
  {
    id: 'notif-new-SINV-NEW-01',
    type: 'invoice_received_supplier',
    title: 'Nouvelle facture fournisseur',
    description: 'Vous avez reçu une nouvelle facture de Matériel Pro via la PDP. Elle est prête à être validée.',
    status: 'pending',
    timestamp: '2024-07-29T09:30:00Z',
    relatedData: {
      invoiceId: 'SINV-NEW-01',
      invoiceNumber: 'FSUP-NEW-456',
      supplierName: 'Matériel Pro',
      amount: 255.99
    },
    urgent: false,
  },
  {
    id: 'missing_doc_Synergy_260525',
    type: 'missing_document',
    title: 'Transaction à justifier',
    description: 'Justificatif requis pour la transaction du 26/05/2025 pour Synergy Systems (10 000,00 €).',
    status: 'pending',
    timestamp: '2024-07-28T14:00:00Z',
    relatedData: {
      thirdPartyName: 'Synergy Systems',
      transactionDate: '26/05/2025',
      amount: '10 000,00 €',
    },
    urgent: true,
  },
  {
    id: 'approval_request_001',
    type: 'approval_request',
    title: 'Approbation Note de Frais',
    description: 'Note de frais de J. Dupont pour un montant de 75,50 € est en attente de votre validation.',
    status: 'pending',
    timestamp: '2024-07-27T11:00:00Z',
    relatedData: { 
        employee: 'Jean Dupont', 
        amount: 75.50 
    },
    urgent: false,
  },
   {
    id: 'message-001',
    type: 'message',
    title: 'Nouveau message de Mike Houston',
    description: 'Peux-tu me confirmer si tu l\'as bien reçue et si tout est en ordre pour le référencement ? Merci beaucoup !',
    status: 'pending',
    timestamp: '2024-07-26T18:00:00Z',
    relatedData: {
      fromUser: 'Mike Houston',
      fromUserTitle: 'COGEP Accou...',
      avatarInitial: 'MH',
    },
    urgent: true,
  },
];

export const addNotification = (notification: NotificationItem) => {
  if (!mockNotifications.some(n => n.id === notification.id)) {
    mockNotifications.unshift(notification);
  }
};
