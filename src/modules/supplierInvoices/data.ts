

import { SupplierInvoice, PAStatus } from './types';

export const mockSupplierInvoices: SupplierInvoice[] = [
  {
    id: 'SINV-NEW-01',
    invoiceNumber: 'FSUP-NEW-456',
    supplierName: 'Matériel Pro',
    issueDate: '2024-07-28',
    dueDate: '2024-08-28',
    receptionDate: '2024-07-29',
    totalAmountTTC: 255.99,
    status: 'RECU_PA_ACHAT' as PAStatus,
    statusHistory: [
      { id: 'shs1-new01', date: '2024-07-29T09:30:00Z', status: 'Reçue PA (RECU_PA_ACHAT)', changedBy: 'Système PA' },
    ],
    communicationHistory: [],
    assignedTo: 'Service Achat'
  },
  {
    id: 'SINV2023001',
    invoiceNumber: 'FSUP001-2023',
    supplierName: 'Fournisseur Express SAS',
    issueDate: '2023-11-01',
    dueDate: '2023-12-01',
    receptionDate: '2023-11-02',
    totalAmountTTC: 450.00,
    status: 'PAYEE_ACHAT' as PAStatus,
    paymentDate: '2023-11-28',
    statusHistory: [
      { id: 'shs1-001', date: '2023-11-02T10:00:00Z', status: 'Reçue PA (RECU_PA_ACHAT)', changedBy: 'Système PA' },
      { id: 'shs2-001', date: '2023-11-03T11:00:00Z', status: 'Approuvée (APPROUVEE_ACHAT)', changedBy: 'Automatique', notes: 'Assignée à Service Compta' },
      { id: 'shs4-001', date: '2023-11-28T16:00:00Z', status: 'Payée (PAYEE_ACHAT)', changedBy: 'Système Bancaire', notes: 'Paiement par virement B2B-00123' },
    ],
    communicationHistory: [
      { id: 'chs1-001', date: '2023-11-06T09:00:00Z', type: 'Email', summary: 'Confirmation de paiement planifié envoyée au fournisseur.', user: 'Service Compta' },
    ],
    assignedTo: 'M. Comptable'
  },
  {
    id: 'SINV2023002',
    invoiceNumber: 'INV-XYZ-789',
    supplierName: 'Solutions Innovantes Ltée',
    issueDate: '2023-11-10',
    dueDate: '2023-12-10',
    receptionDate: '2023-11-11',
    totalAmountTTC: 1250.99,
    // Simulating it was due, but now paid. The user wants "Paiement en Retard" to become "Payée"
    status: 'PAYEE_ACHAT' as PAStatus, 
    paymentDate: '2023-12-15T10:00:00Z', // Paid after due date
    statusHistory: [
      { id: 'shs1-002', date: '2023-11-11T15:00:00Z', status: 'Reçue PA (RECU_PA_ACHAT)', changedBy: 'Système PA' },
      { id: 'shs2-002', date: '2023-11-12T09:30:00Z', status: 'Approuvée (APPROUVEE_ACHAT)', changedBy: 'Chef de Projet A' },
      { id: 'shs3-002', date: '2023-12-11T00:01:00Z', status: 'Était en Retard', changedBy: 'Système', notes: 'Échéance dépassée.' },
      { id: 'shs4-002', date: '2023-12-15T10:00:00Z', status: 'Payée (PAYEE_ACHAT)', changedBy: 'Service Compta', notes: 'Paiement effectué après relance.' },
    ],
    communicationHistory: [
      { id: 'chs1-002', date: '2023-12-11T10:00:00Z', type: 'Notification Système', summary: 'Alerte: Paiement en retard pour facture Solutions Innovantes Ltée.' },
      { id: 'chs2-002', date: '2023-12-12T11:00:00Z', type: 'Email', summary: 'Relance envoyée au service paiement.', user: 'Chef de Projet A' },
    ],
    assignedTo: 'Chef de Projet A'
  },
  {
    id: 'SINV2023003',
    invoiceNumber: 'BIL-0042',
    supplierName: 'Services Pro Actifs',
    issueDate: '2023-11-15',
    dueDate: '2024-01-15',
    receptionDate: '2023-11-16',
    totalAmountTTC: 89.50,
    status: 'APPROUVEE_ACHAT' as PAStatus,
    statusHistory: [
      { id: 'shs1-003', date: '2023-11-16T09:00:00Z', status: 'Reçue PA (RECU_PA_ACHAT)', changedBy: 'Import Manuel' },
      { id: 'shs2-003', date: '2023-11-20T10:00:00Z', status: 'Approuvée (APPROUVEE_ACHAT)', changedBy: 'Valérie Achat' },
    ],
    communicationHistory: [],
    assignedTo: 'Valérie Achat'
  },
  {
    id: 'SINV2023004',
    invoiceNumber: 'FN-2023-512',
    supplierName: 'Matériel Durable Co.',
    issueDate: '2023-11-20',
    dueDate: '2023-12-20',
    receptionDate: '2023-11-21',
    totalAmountTTC: 3200.00,
    status: 'REJETEE_ACHAT' as PAStatus,
    rejectionReason: 'Quantité livrée incorrecte, ne correspond pas à la facture.',
    statusHistory: [
       { id: 'shs1-004', date: '2023-11-21T11:00:00Z', status: 'Reçue PA (RECU_PA_ACHAT)', changedBy: 'Système PA' },
       { id: 'shs2-004', date: '2023-11-23T10:30:00Z', status: 'Rejetée (REJETEE_ACHAT)', changedBy: 'Responsable Logistique', notes: 'Quantité livrée incorrecte, ne correspond pas à la facture.' },
    ],
    communicationHistory: [
      { id: 'chs1-004', date: '2023-11-23T11:00:00Z', type: 'Email', summary: 'Email envoyé à Matériel Durable Co. concernant le litige sur la facture FN-2023-512.', user: 'Responsable Logistique' },
    ],
    assignedTo: 'Responsable Logistique'
  },
   {
    id: 'SINV2023005',
    invoiceNumber: 'SERV-00998',
    supplierName: 'Consulting Experts',
    issueDate: '2023-12-01',
    dueDate: '2023-12-31',
    receptionDate: '2023-12-02',
    totalAmountTTC: 750.00,
    status: 'RECU_PA_ACHAT' as PAStatus, // Changed from EN_VALIDATION_INTERNE as it's the first step
    statusHistory: [
      { id: 'shs1-005', date: '2023-12-02T14:00:00Z', status: 'Reçue PA (RECU_PA_ACHAT)', changedBy: 'Système PA' },
      // No 'Approuvée' yet, as it's still in 'Reçue PA'
    ],
    communicationHistory: [],
    assignedTo: 'Service Juridique'
  },
];