import { Quote, QuoteStatus, Client, Product, BankAccount } from '../../../../types';

// FIX: Type 'string' is not assignable to type '{ street: string; postalCode: string; city: string; region: string; country: string; hasDifferentDeliveryAddress: boolean; }'.
export const mockClients: Client[] = [
  { 
    id: 'cli_1', 
    name: 'Alpha SARL', 
    type: 'Entreprise',
    siren: '111111111',
    nic: '00011',
    vatNumber: 'FR11111111111',
    reference: 'C001',
    notes: 'Client historique.',
    address: { street: '1 Rue de la Paix', postalCode: '75002', city: 'Paris', region: 'Île-de-France', country: 'France', hasDifferentDeliveryAddress: false },
    primaryEmails: 'contact@alpha.sarl',
    ccEmails: '',
    bccEmails: '',
    phone: '0102030405',
    paymentTerms: '30 jours',
    invoiced: 15000,
    paid: 15000
  },
  { 
    id: 'cli_2', 
    name: 'Beta Industries', 
    type: 'Entreprise',
    siren: '222222222',
    nic: '00022',
    vatNumber: 'FR22222222222',
    reference: 'C002',
    notes: '',
    address: { street: '10 Avenue des Champs-Élysées', postalCode: '75008', city: 'Paris', region: 'Île-de-France', country: 'France', hasDifferentDeliveryAddress: false },
    primaryEmails: 'compta@beta.ind',
    ccEmails: '',
    bccEmails: '',
    phone: '0102030406',
    paymentTerms: '30 jours',
    invoiced: 25000,
    paid: 20000
  },
  { 
    id: 'cli_3', 
    name: 'Gamma Services', 
    type: 'Entreprise',
    siren: '333333333',
    nic: '00033',
    vatNumber: 'FR33333333333',
    reference: 'C003',
    notes: '',
    address: { street: '25 Boulevard Haussmann', postalCode: '75009', city: 'Paris', region: 'Île-de-France', country: 'France', hasDifferentDeliveryAddress: false },
    primaryEmails: 'factures@gamma.serv',
    ccEmails: '',
    bccEmails: '',
    phone: '0102030407',
    paymentTerms: '30 jours',
    invoiced: 8000,
    paid: 8000
  },
  { 
    id: 'cli_4', 
    name: 'Delta Solutions', 
    type: 'Entreprise',
    siren: '444444444',
    nic: '00044',
    vatNumber: 'FR44444444444',
    reference: 'C004',
    notes: '',
    address: { street: '50 Rue du Faubourg Saint-Honoré', postalCode: '75008', city: 'Paris', region: 'Île-de-France', country: 'France', hasDifferentDeliveryAddress: false },
    primaryEmails: 'support@delta.sol',
    ccEmails: '',
    bccEmails: '',
    phone: '0102030408',
    paymentTerms: '30 jours',
    invoiced: 5000,
    paid: 0
  },
];

// FIX: Added missing 'reference' and 'unit' properties and corrected 'taxRate' to be a percentage.
export const mockProducts: Product[] = [
  // FIX: Line 82: Added missing properties type, category, and description to conform to Product type.
  { id: 'prod_1', name: 'Prestation de conseil - Journée', type: 'Prestation de service', category: 'Service', description: 'Journée de prestation de conseil.', reference: 'SERV-CONS-J', unit: 'Jour', unitPrice: 850, taxRate: 20 },
  // FIX: Line 84: Added missing properties type, category, and description to conform to Product type.
  { id: 'prod_2', name: 'Licence Logiciel Pro - Annuelle', type: 'Prestation de service', category: 'Service', description: 'Licence annuelle pour le logiciel professionnel.', reference: 'LIC-PRO-AN', unit: 'Unité', unitPrice: 1200, taxRate: 20 },
  // FIX: Line 86: Added missing properties type, category, and description to conform to Product type.
  { id: 'prod_3', name: 'Développement Spécifique - Heure', type: 'Prestation de service', category: 'Service', description: 'Heure de développement spécifique.', reference: 'SERV-DEV-H', unit: 'Heure', unitPrice: 110, taxRate: 20 },
  // FIX: Line 88: Added missing properties type, category, and description to conform to Product type.
  { id: 'prod_4', name: 'Frais de déplacement', type: 'Prestation de service', category: 'Service', description: 'Remboursement des frais de déplacement.', reference: 'FRAIS-DEPL', unit: 'Unité', unitPrice: 1, taxRate: 20 },
  // FIX: Line 90: Added missing properties type, category, and description to conform to Product type.
  { id: 'prod_5', name: 'Matériel Informatique - Unité A', type: 'Livraison de biens', category: 'Produit finis', description: 'Unité A de matériel informatique.', reference: 'MAT-INF-A', unit: 'Unité', unitPrice: 1500, taxRate: 20 },
];

export const mockBankAccounts: BankAccount[] = [
    { id: 'bank_1', bankName: 'BNP Paribas', iban: 'FR76 3000 4000 0512 3456 7890 185', bic: 'BNPAFRPPXXX', isDefault: true },
    { id: 'bank_2', bankName: 'Crédit Agricole', iban: 'FR76 1009 6000 4036 4746 4212 F23', bic: 'AGRIFRPPXXX', isDefault: false },
];

export const mockQuotes: Quote[] = [
  { 
    id: 'DEV24-001', 
    quoteNumber: 'DEV24-001', 
    clientName: 'Alpha SARL', 
    issueDate: '2024-07-15', 
    expiryDate: '2024-08-14', 
    totalAmountTTC: 1500.00, 
    status: 'ACCEPTE' as QuoteStatus, 
    statusHistory: [
      { id: 'sh1-q001', date: '2024-07-15T09:00:00Z', status: 'Créé (BROUILLON)', changedBy: 'Système' },
      { id: 'sh2-q001', date: '2024-07-15T10:00:00Z', status: 'Envoyé (ENVOYE)', changedBy: 'Marcel GENIALLY' },
      { id: 'sh3-q001', date: '2024-07-20T14:00:00Z', status: 'Accepté (ACCEPTE)', changedBy: 'Client Alpha SARL', notes: 'Acceptation par email.' },
    ],
  },
  { 
    id: 'DEV24-002', 
    quoteNumber: 'DEV24-002', 
    clientName: 'Nouveau Prospect Inc.', 
    issueDate: '2024-07-20', 
    expiryDate: '2024-08-19', 
    totalAmountTTC: 3500.00, 
    status: 'ENVOYE' as QuoteStatus,
    communicationHistory: [
      { id: 'ch1-q002', date: '2024-07-21T10:00:00Z', type: 'Email', summary: 'Email de suivi envoyé au prospect.', user: 'Sophie D.' },
    ] 
  },
  { 
    id: 'DEV24-003', 
    quoteNumber: 'DEV24-003', 
    clientName: 'Gamma Services', 
    issueDate: '2024-07-25', 
    expiryDate: '2024-08-24', 
    totalAmountTTC: 780.75, 
    status: 'BROUILLON' as QuoteStatus,
  },
  { 
    id: 'DEV24-004', 
    quoteNumber: 'DEV24-004', 
    clientName: 'Delta Solutions', 
    issueDate: '2024-07-01', 
    expiryDate: '2024-07-31', 
    totalAmountTTC: 2100.00, 
    status: 'REFUSE' as QuoteStatus, 
    statusHistory: [
        { id: 'sh1-q004', date: '2024-07-01T00:00:00Z', status: 'Créé (BROUILLON)', changedBy: 'Marcel GENIALLY'},
        { id: 'sh2-q004', date: '2024-07-01T10:00:00Z', status: 'Envoyé (ENVOYE)', changedBy: 'Marcel GENIALLY'},
        { id: 'sh3-q004', date: '2024-07-15T10:00:00Z', status: 'Refusé (REFUSE)', changedBy: 'Client Delta Solutions', notes: 'Budget trop élevé.'},
    ],
  },
  { 
    id: 'DEV24-005', 
    quoteNumber: 'DEV24-005', 
    clientName: 'Epsilon Tech', 
    issueDate: '2024-06-10', 
    expiryDate: '2024-07-10', 
    totalAmountTTC: 550.20, 
    status: 'ANNULE' as QuoteStatus,
    statusHistory: [
        { id: 'sh1-q005', date: '2024-06-10T09:00:00Z', status: 'Créé (BROUILLON)', changedBy: 'Système'},
        { id: 'sh2-q005', date: '2024-06-12T10:00:00Z', status: 'Annulé (ANNULE)', changedBy: 'Aline P.', notes: 'Erreur de saisie.'},
    ],
  },
];
