import { ProAccountDetails, ProAccountTransaction, Beneficiary, DirectDebitMandate, PaymentCard } from './types';

export const mockProAccountDetails: ProAccountDetails = {
  accountId: 'COGPRO001',
  accountName: 'Compte Pro Principal',
  iban: 'FR7630006000011234567890188',
  balance: 15730.45,
  currency: 'EUR',
  overdraftLimit: 2000,
};

export const mockProAccountTransactions: ProAccountTransaction[] = [
  // Future transaction
  {
    id: 'protx09_1',
    date: '2025-09-05',
    description: 'Virement programmé - Loyer Septembre',
    amount: -1200.00,
    type: 'Virement sortant',
    status: 'En attente',
    reference: 'LOYER-BUR-SEP25'
  },
  // Added for density
  {
    id: 'protx08_10',
    date: '2025-08-28',
    description: 'Paiement CB - Déjeuner client Le Procope',
    amount: -180.40,
    type: 'Paiement par carte',
    status: 'Effectué',
    cardId: 'card001'
  },
  {
    id: 'protx08_11',
    date: '2025-08-27',
    description: 'Virement entrant - Projet Delta',
    amount: 3200.00,
    type: 'Virement entrant',
    status: 'Effectué'
  },
  {
    id: 'protx001_b',
    date: '2025-07-28',
    description: 'Retrait espèces - DAB',
    amount: -200.00,
    type: 'Retrait espèces',
    status: 'Effectué'
  },
  {
    id: 'protx003_b',
    date: '2025-07-26',
    description: 'Paiement Fournisseur - Presta Info SARL',
    amount: -650.00,
    type: 'Virement sortant',
    status: 'Effectué'
  },
  {
    id: 'protx06_1_b',
    date: '2025-06-28',
    description: 'Paiement CB - Achat logiciel',
    amount: -299.00,
    type: 'Paiement par carte',
    status: 'Effectué',
    cardId: 'card002'
  },
  {
    id: 'protx06_2_b',
    date: '2025-06-25',
    description: 'Virement entrant - Client Zeta Corp',
    amount: 1500.00,
    type: 'Virement entrant',
    status: 'Effectué',
  },
  // August 2025
  {
    id: 'protx08_1',
    date: '2025-08-28',
    description: 'Paiement fournisseur - Solutions Cloud SAS',
    amount: -49.99,
    type: 'Paiement par carte',
    status: 'Effectué',
    reference: 'CB-789123',
    cardId: 'card002'
  },
  {
    id: 'protx08_2',
    date: '2025-08-27',
    description: 'Virement entrant - Client Alpha SARL',
    amount: 1250.00,
    type: 'Virement entrant',
    status: 'Effectué',
    reference: 'VIR-CLI-ALPHA-001'
  },
  {
    id: 'protx08_3',
    date: '2025-08-26',
    description: 'Prélèvement URSSAF Août 2025',
    amount: -780.50,
    type: 'Prélèvement émis',
    status: 'Effectué',
    reference: 'URSSAF-AUG25'
  },
  {
    id: 'protx08_4',
    date: '2025-08-22',
    description: 'Paiement CB - Restaurant Le Grand Véfour',
    amount: -250.70,
    type: 'Paiement par carte',
    status: 'Effectué',
    cardId: 'card001'
  },
  {
    id: 'protx08_5',
    date: '2025-08-20',
    description: 'Virement entrant - Client Gamma Services',
    amount: 2500.00,
    type: 'Virement entrant',
    status: 'Effectué'
  },
  {
    id: 'protx08_6',
    date: '2025-08-15',
    description: 'Frais bancaires T3',
    amount: -25.00,
    type: 'Frais bancaires',
    status: 'Effectué'
  },
  {
    id: 'protx08_7',
    date: '2025-08-10',
    description: 'Paiement loyer bureau - Août 2025',
    amount: -1200.00,
    type: 'Virement sortant',
    status: 'Effectué',
    reference: 'LOYER-BUR-AUG25'
  },
  {
    id: 'protx08_8',
    date: '2025-08-05',
    description: 'Abonnement SAS LogicielCompta',
    amount: -99.00,
    type: 'Paiement par carte',
    status: 'Effectué',
    cardId: 'card001'
  },
  {
    id: 'protx08_9',
    date: '2025-08-01',
    description: 'Virement entrant - Client Beta Services',
    amount: 850.75,
    type: 'Virement entrant',
    status: 'Effectué'
  },

  // July 2025
  {
    id: 'protx001',
    date: '2025-07-28',
    description: 'Paiement fournisseur - Solutions Cloud SAS',
    amount: -49.99,
    type: 'Paiement par carte',
    status: 'Effectué',
    reference: 'CB-789123',
    cardId: 'card002'
  },
  {
    id: 'protx002',
    date: '2025-07-27',
    description: 'Virement entrant - Client Alpha SARL',
    amount: 1250.00,
    type: 'Virement entrant',
    status: 'Effectué',
    reference: 'VIR-CLI-ALPHA-001'
  },
  {
    id: 'protx003',
    date: '2025-07-26',
    description: 'Prélèvement URSSAF Juillet 2025',
    amount: -780.50,
    type: 'Prélèvement émis',
    status: 'Effectué',
    reference: 'URSSAF-JUL25'
  },
  {
    id: 'protx004',
    date: '2025-07-25',
    description: 'Frais de tenue de compte',
    amount: -15.00,
    type: 'Frais bancaires',
    status: 'Effectué'
  },
  {
    id: 'protx005',
    date: '2025-07-24',
    description: 'Paiement loyer bureau - Agence Immo Pro',
    amount: -1200.00,
    type: 'Virement sortant',
    status: 'Effectué',
    reference: 'LOYER-BUR-JUL25'
  },
  {
    id: 'protx006',
    date: '2025-07-23',
    description: 'Paiement SAS LogicielCompta',
    amount: -99.00,
    type: 'Paiement par carte',
    status: 'Effectué',
    cardId: 'card001'
  },
  {
    id: 'protx007',
    date: '2025-07-22',
    description: 'Virement entrant - Client Beta Services',
    amount: 850.75,
    type: 'Virement entrant',
    status: 'Effectué'
  },
  {
    id: 'protx008',
    date: '2025-07-21',
    description: 'Achat de fournitures - Bureau Vallée',
    amount: -75.50,
    type: 'Paiement par carte',
    status: 'Effectué',
    cardId: 'card001'
  },
  {
    id: 'protx009',
    date: '2025-07-20',
    description: 'Abonnement SaaS - Adobe Creative Cloud',
    amount: -59.99,
    type: 'Paiement par carte',
    status: 'Effectué',
    cardId: 'card002'
  },
  {
    id: 'protx07_1',
    date: '2025-07-15',
    description: 'Virement entrant - Projet Epsilon',
    amount: 4200.00,
    type: 'Virement entrant',
    status: 'Effectué'
  },
  {
    id: 'protx07_2',
    date: '2025-07-10',
    description: 'Paiement CB - Hotel Plaza (déplacement)',
    amount: -450.00,
    type: 'Paiement par carte',
    status: 'Effectué',
    cardId: 'card001'
  },
  {
    id: 'protx07_3',
    date: '2025-07-05',
    description: 'Prélèvement - Assurance Pro MMA',
    amount: -180.00,
    type: 'Prélèvement émis',
    status: 'Effectué'
  },
  {
    id: 'protx07_4',
    date: '2025-07-02',
    description: 'Virement salaires - Juin 2025',
    amount: -18500.00,
    type: 'Virement sortant',
    status: 'Effectué'
  },

  // June 2025
  {
    id: 'protx06_1',
    date: '2025-06-28',
    description: 'Virement entrant - Facture #2025-052',
    amount: 3200.00,
    type: 'Virement entrant',
    status: 'Effectué'
  },
  {
    id: 'protx06_2',
    date: '2025-06-25',
    description: 'Prélèvement URSSAF Juin 2025',
    amount: -750.00,
    type: 'Prélèvement émis',
    status: 'Effectué'
  },
  {
    id: 'protx06_3',
    date: '2025-06-20',
    description: 'Paiement CB - Amazon Web Services',
    amount: -150.25,
    type: 'Paiement par carte',
    status: 'Effectué',
    cardId: 'card002'
  },
  {
    id: 'protx06_4',
    date: '2025-06-18',
    description: 'Remboursement note de frais - M. GENIALLY',
    amount: -120.50,
    type: 'Virement sortant',
    status: 'Effectué'
  },
  {
    id: 'protx06_5',
    date: '2025-06-15',
    description: 'Virement entrant - Client Omega',
    amount: 5000.00,
    type: 'Virement entrant',
    status: 'Effectué'
  },
  {
    id: 'protx06_6',
    date: '2025-06-12',
    description: 'Paiement Fournisseur - Presta Info SARL',
    amount: -800.00,
    type: 'Virement sortant',
    status: 'Effectué'
  },
  {
    id: 'protx06_7',
    date: '2025-06-10',
    description: 'Paiement Loyer - Juin 2025',
    amount: -1200.00,
    type: 'Virement sortant',
    status: 'Effectué'
  },
  {
    id: 'protx06_8',
    date: '2025-06-05',
    description: 'Paiement CB - Billet de train SNCF Pro',
    amount: -89.90,
    type: 'Paiement par carte',
    status: 'Effectué',
    cardId: 'card001'
  },
  {
    id: 'protx06_9',
    date: '2025-06-02',
    description: 'Virement Salaires - Mai 2025',
    amount: -18500.00,
    type: 'Virement sortant',
    status: 'Effectué'
  },
];


export const mockBeneficiaries: Beneficiary[] = [
  { id: 'ben001', name: 'Fournisseur A SAS', iban: 'FR7612345678901234567890123', bankName: 'BNP Paribas', addedDate: '2023-01-15' },
  { id: 'ben002', name: 'Employé Jean Dupont', iban: 'FR7698765432109876543210987', bankName: 'Société Générale', addedDate: '2023-02-20' },
  { id: 'ben003', name: 'URSSAF', iban: 'FR7611112222333344445555666', addedDate: '2022-11-10' },
];

export const mockDirectDebitMandates: DirectDebitMandate[] = [
  { 
    id: 'ddm001', 
    creditorName: 'EDF Pro', // Example: We are the debtor here
    creditorId: 'FR12ZZZ123456', 
    mandateReference: 'UMR-EDFPRO-001', 
    debtorName: mockProAccountDetails.accountName, // Assuming the pro account is the debtor
    debtorIban: mockProAccountDetails.iban, 
    debtorCountry: 'France',
    mandateLanguage: 'Français',
    mandateDisplayName: 'Mandat EDF Électricité Bureau',
    status: 'Actif', 
    creationDate: '2023-03-01', 
    mandateType: 'CORE',
    frequency: 'Mensuel',
    nextPaymentDate: '2024-08-05',
    nextPaymentAmount: 150.75,
    detailsLink: '#',
    pdfLink: 'mandat_UMR-EDFPRO-001.pdf'
  },
  { 
    id: 'ddm002', 
    creditorName: 'Logiciel SaaS Compta', 
    creditorId: 'FR98ZZZ789012', 
    mandateReference: 'UMR-SAASCOMPTA-002', 
    debtorName: mockProAccountDetails.accountName,
    debtorIban: mockProAccountDetails.iban, 
    debtorCountry: 'France',
    mandateLanguage: 'Français',
    mandateDisplayName: 'Abonnement Logiciel ComptaPro',
    status: 'Actif', 
    creationDate: '2024-01-10',
    mandateType: 'B2B',
    frequency: 'Annuel',
    nextPaymentDate: '2025-01-10',
    nextPaymentAmount: 299.00,
    detailsLink: '#',
    pdfLink: 'mandat_UMR-SAASCOMPTA-002.pdf'
  },
  { 
    id: 'ddm003', 
    creditorName: 'Ancien Fournisseur Eau', 
    creditorId: 'FR70ZZZ654321', 
    mandateReference: 'UMR-OLDWATER-003', 
    debtorName: mockProAccountDetails.accountName,
    debtorIban: mockProAccountDetails.iban, 
    debtorCountry: 'France',
    mandateLanguage: 'Français',
    mandateDisplayName: 'Ancien Contrat Eau (Résilié)',
    status: 'Révoqué', 
    creationDate: '2022-05-15',
    mandateType: 'CORE',
    lastUsedDate: '2023-12-20',
    detailsLink: '#',
    pdfLink: 'mandat_UMR-OLDWATER-003.pdf'
  },
];

export const mockPaymentCards: PaymentCard[] = [
  { 
    id: 'card001', 
    type: 'Physique', 
    last4Digits: '1234', 
    cardholderName: 'Marcel GENIALLY', 
    expiryDate: '12/26', 
    status: 'Active', 
    isContactlessEnabled: true, 
    spendingLimitMonth: 5000, 
    currentMonthSpending: 174.50, // 99 (LogicielCompta) + 75.50 (Bureau Vallee)
    spendingLimitTransaction: 1000,
    associatedAccountIban: mockProAccountDetails.iban 
  },
  { 
    id: 'card002', 
    type: 'Virtuelle', 
    last4Digits: '5678', 
    cardholderName: 'Service Marketing', 
    expiryDate: '08/25', 
    status: 'Active', 
    spendingLimitMonth: 1000, 
    currentMonthSpending: 109.98, // 49.99 (Solutions Cloud) + 59.99 (Adobe)
    spendingLimitTransaction: 200,
    associatedAccountIban: mockProAccountDetails.iban
  },
   { 
    id: 'card003', 
    type: 'Physique', 
    last4Digits: '9012', 
    cardholderName: 'Directeur Achats', 
    expiryDate: '03/24', 
    status: 'Expirée', 
    isContactlessEnabled: true, 
    spendingLimitMonth: 10000,
    currentMonthSpending: 0, 
    spendingLimitTransaction: 2500,
    associatedAccountIban: mockProAccountDetails.iban
  },
];