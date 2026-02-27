interface AccountingDocument {
  id: string;
  name: string;
  status: 'to_sign' | 'signed' | 'none';
}

interface DocumentGroup {
  year: number;
  count: number;
  documents: AccountingDocument[];
}

const documents2024: AccountingDocument[] = [
  { id: 'doc-24-1', name: 'Plaquette comptable 2024', status: 'to_sign' },
  { id: 'doc-24-2', name: 'Bilan 2024', status: 'none' },
  { id: 'doc-24-3', name: 'Compte de résultat 2024', status: 'none' },
];

const documents2023: AccountingDocument[] = [
  { id: 'doc-23-1', name: 'Plaquette comptable 2023', status: 'signed' },
  { id: 'doc-23-2', name: 'Bilan 2023', status: 'signed' },
  { id: 'doc-23-3', name: 'Compte de résultat 2023', status: 'signed' },
];

const documents2022: AccountingDocument[] = [
    { id: 'doc-22-1', name: 'Plaquette comptable 2022', status: 'signed' },
    { id: 'doc-22-2', name: 'Bilan 2022', status: 'signed' },
    { id: 'doc-22-3', name: 'Compte de résultat 2022', status: 'signed' },
];

export const documentGroups: DocumentGroup[] = [
    {
        year: 2024,
        count: 3,
        documents: documents2024,
    },
    {
        year: 2023,
        count: 3,
        documents: documents2023,
    },
    {
        year: 2022,
        count: 3,
        documents: documents2022,
    }
];
