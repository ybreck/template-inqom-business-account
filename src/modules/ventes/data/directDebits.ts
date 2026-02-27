import { DirectDebitBatch } from '../../../../types';

export const mockDirectDebits: DirectDebitBatch[] = [
  {
    id: 'dd_1',
    name: 'Mon prélèvement',
    destinationAccountId: 'bank_1',
    status: 'Prélevé',
    invoiceCount: 2,
    creationDate: '2025-12-12',
    debitDate: '2025-12-12',
    totalAmountTTC: 200000.00,
    invoices: [
        { invoiceId: 'F2023001', invoiceNumber: 'F2023001', clientName: 'Alpha SARL', dueDate: '2023-11-14', totalAmount: 1200.50, amountToDebit: 1200.50 },
        { invoiceId: 'F2023003', invoiceNumber: 'F2023003', clientName: 'Gamma Services', dueDate: '2023-12-01', totalAmount: 780.75, amountToDebit: 780.75 },
    ]
  },
  {
    id: 'dd_2',
    name: 'Ton prélèvement',
    destinationAccountId: 'bank_1',
    status: 'En préparation',
    invoiceCount: 1,
    creationDate: '2025-12-12',
    totalAmountTTC: 100000.00,
    invoices: [
        { invoiceId: 'F2023002', invoiceNumber: 'F2023002', clientName: 'Beta Industries', dueDate: '2023-11-19', totalAmount: 350.00, amountToDebit: 350.00 },
    ]
  },
  {
    id: 'dd_3',
    name: 'Son prélèvement',
    destinationAccountId: 'bank_2',
    status: 'En préparation',
    invoiceCount: 2,
    creationDate: '2025-12-12',
    totalAmountTTC: 10000.00,
    invoices: [
        { invoiceId: 'F2023004', invoiceNumber: 'F2023004', clientName: 'Delta Solutions', dueDate: '2023-12-05', totalAmount: 2100.00, amountToDebit: 2100.00 },
        { invoiceId: 'F2023005', invoiceNumber: 'F2023005', clientName: 'Epsilon Tech', dueDate: '2023-12-10', totalAmount: 550.20, amountToDebit: 550.20 },
    ]
  },
];
