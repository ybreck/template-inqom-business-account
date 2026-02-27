import { VatSummary, Deadline, EReporting, EReportingHistoryEntry, DeclarationHistoryEntry } from './types';

export const vatSummaryData: VatSummary = {
    collected: 1672.67,
    deductible: -4123.45,
    credit: 2450.78,
};

export const deadlinesData: Deadline[] = [
    {
        id: 'deadline_1',
        title: 'TVA Mensuelle - Juillet',
        subtitle: 'Déclaration CA3',
        status: 'Prévu',
        amount: 2450.78,
        amountLabel: 'Crédit à recevoir',
        calculationBasis: 'Calcul en temps réel (e-invoicing)',
        dueDate: '24/08/2025',
        hasChat: false,
    },
    {
        id: 'deadline_2',
        title: 'Acompte d\'Impôt Société',
        subtitle: '2ème acompte 2025',
        status: 'Prévu',
        amount: 1800.00,
        amountLabel: 'Montant à payer',
        calculationBasis: 'Basé sur N-1',
        dueDate: '15/09/2025',
        hasChat: true,
    },
    {
        id: 'deadline_3',
        title: 'Acompte CVAE',
        subtitle: '2ème acompte 2025',
        status: 'Prévu',
        amount: 600.00,
        amountLabel: 'Montant à payer',
        calculationBasis: 'Basé sur N-1',
        dueDate: '15/09/2025',
        hasChat: true,
    },
];

export const eReportingData: EReporting = {
    status: 'Activé',
    transactionsThisMonth: 42,
    nextTransmissionDate: '10/09/2025',
};

export const mockEreportingHistory: EReportingHistoryEntry[] = [
  {
    id: 'history_6',
    title: 'Accusé de réception Admin.',
    description: 'Flux e-reporting pour Juillet 2025 accepté et intégré. ID de lot: ADM-202508-XYZ987.',
    author: 'Administration Fiscale',
    timestamp: '2025-08-10T13:05:20Z',
    statusType: 'ADMIN_ACK',
  },
  {
    id: 'history_5',
    title: 'Transmission PA > Admin.',
    description: 'Transmission du flux e-reporting vers l\'administration fiscale. ID de transmission PA: PA-TX-202508-456789.',
    author: 'PA "InqomConnect"',
    timestamp: '2025-08-10T13:01:15Z',
    statusType: 'PA_TO_ADMIN',
  },
  {
    id: 'history_4',
    title: 'Accusé de réception PA',
    description: 'Flux e-reporting pour Juillet 2025 reçu et validé par la PA. Prêt pour transmission.',
    author: 'PA "InqomConnect"',
    timestamp: '2025-08-10T12:05:12Z',
    statusType: 'PA_ACK',
  },
  {
    id: 'history_3',
    title: 'Envoi vers la PA',
    description: 'Envoi du flux e-reporting à la PA "InqomConnect". ID de transmission: SYS-202508-123456.',
    author: 'Système',
    timestamp: '2025-08-10T12:01:45Z',
    statusType: 'SENT_TO_PA',
  },
  {
    id: 'history_2',
    title: 'Validation par l\'utilisateur',
    description: 'Validation manuelle du flux e-reporting avant transmission à la PA.',
    author: 'Genially Marcel',
    timestamp: '2025-08-09T17:30:00Z',
    statusType: 'USER_VALIDATION',
  },
  {
    id: 'history_1',
    title: 'Génération du flux',
    description: 'Génération automatique du flux e-reporting pour la période de Juillet 2025. 42 transactions incluses.',
    author: 'Système',
    timestamp: '2025-08-09T16:00:00Z',
    statusType: 'FLUX_GENERATION',
  },
];

export const mockDeclarationsHistory: DeclarationHistoryEntry[] = [
    {
      id: 'decl_1',
      name: 'E-reporting - Juillet 2025',
      type: 'Flux de transactions',
      status: 'Déposé',
      date: '10/08/2025',
      details: '42 transactions',
    },
    {
      id: 'decl_2',
      name: 'TVA Mensuelle - Juin 2025',
      type: 'Déclaration CA3',
      status: 'Payée',
      date: '24/07/2025',
      details: 2109.34,
    },
    {
      id: 'decl_3',
      name: 'E-reporting - Juin 2025',
      type: 'Flux de transactions',
      status: 'Rejeté',
      date: '11/07/2025',
      details: '-',
      rejectionReason: 'Rejet par l\'administration: Format de données invalide pour 2 transactions.',
    },
    {
      id: 'decl_4',
      name: 'TVA Mensuelle - Mai 2025',
      type: 'Déclaration CA3',
      status: 'Payée',
      date: '23/06/2025',
      details: 1987.12,
    },
    {
      id: 'decl_5',
      name: 'Acompte d\'Impôt Société',
      type: '1er acompte 2025',
      status: 'Payée',
      date: '15/06/2025',
      details: 1800.00,
    },
    {
      id: 'decl_6',
      name: 'Acompte CVAE',
      type: '1er acompte 2025',
      status: 'Payée',
      date: '15/06/2025',
      details: 600.00,
    },
    {
      id: 'decl_7',
      name: 'TVA Mensuelle - Avril 2025',
      type: 'Déclaration CA3',
      status: 'Payée',
      date: '25/05/2025',
      details: 2344.80,
    },
  ];
