import { SupplierPaymentBatch } from '../../../../types';

export const mockSupplierPayments: SupplierPaymentBatch[] = [
  {
    id: 'spb_1',
    name: 'Paiement Fournisseurs Fin de Mois',
    sourceAccountId: 'bank_1',
    status: 'Payé',
    invoiceCount: 2,
    creationDate: '2025-11-28',
    paymentDate: '2025-11-28',
    totalAmountTTC: 450.00,
    invoices: [
      {
        invoiceId: 'SINV2023001',
        invoiceNumber: 'FSUP001-2023',
        supplierName: 'Fournisseur Express SAS',
        dueDate: '2023-12-01',
        totalAmount: 450.00,
        amountToPay: 450.00,
      },
      // Add another paid invoice if needed
    ]
  },
  {
    id: 'spb_2',
    name: 'Paiements Urgents Semaine 50',
    sourceAccountId: 'bank_1',
    status: 'En préparation',
    invoiceCount: 1,
    creationDate: '2025-12-10',
    totalAmountTTC: 1250.99,
    invoices: [
      {
        invoiceId: 'SINV2023002',
        invoiceNumber: 'INV-XYZ-789',
        supplierName: 'Solutions Innovantes Ltée',
        dueDate: '2023-12-10',
        totalAmount: 1250.99,
        amountToPay: 1250.99,
      },
    ]
  },
];