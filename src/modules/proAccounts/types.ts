
import { ModuleComponentProps as GlobalModuleComponentProps } from '../../../types';

export interface ProAccountDetails {
  accountId: string;
  accountName: string;
  iban: string;
  bic?: string;
  accountHolder?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  balance: number;
  currency: string;
  overdraftLimit?: number;
}

export type ProTransactionType = 
  | 'Virement entrant' 
  | 'Virement sortant' 
  | 'Paiement par carte' 
  | 'Prélèvement émis' 
  | 'Prélèvement reçu' 
  | 'Frais bancaires' 
  | 'Dépôt espèces'
  | 'Retrait espèces';

export type ProTransactionStatus = 'Effectué' | 'En attente' | 'Annulé' | 'Rejeté';

export interface ProAccountTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  valueDate?: string; // YYYY-MM-DD - Date de valeur
  description: string;
  amount: number; // positive for credit, negative for debit
  type: ProTransactionType;
  status: ProTransactionStatus;
  reference?: string; // Référence de la transaction
  thirdPartyName?: string; // Nom du tiers (bénéficiaire/émetteur)
  thirdPartyIban?: string;
  beneficiaryName?: string; // Specifically for outgoing transfers if thirdPartyName is too generic
  balanceAfterTransaction?: number; 
  cardId?: string; // Optional: Link transaction to a card
}


// Beneficiary type for transfers
export interface Beneficiary {
  id: string;
  name: string;
  iban: string;
  bankName?: string; // Optional
  addedDate: string; // YYYY-MM-DD
  isFavorite?: boolean;
}

// Form data for creating/editing a beneficiary
export interface BeneficiaryFormData {
  name: string;
  iban: string;
  bankName?: string;
}

// Form data for new transfer
export interface NewTransferFormData {
  beneficiaryId: string;
  amount: number | string; // string for input, number for submission
  executionDate: string; // YYYY-MM-DD
  reference: string;
  reason?: string;
}

// Direct Debit Mandate type
export interface DirectDebitMandate {
  id: string;
  creditorName: string; // From company settings (simulated here if we are the creditor)
  creditorId: string; // SEPA Creditor Identifier (ICS) - From company settings
  mandateReference: string; // UMR - Unique Mandate Reference (Generated)
  
  debtorName: string; // Debtor being debited
  debtorIban: string; 
  debtorCountry: string; // Country of the debtor

  mandateLanguage: string; // Language of the mandate document
  mandateDisplayName: string; // User-friendly name for this mandate

  status: 'Actif' | 'Révoqué' | 'Expiré' | 'En attente de signature' | 'Généré';
  creationDate: string; // YYYY-MM-DD
  lastUsedDate?: string; // YYYY-MM-DD
  frequency?: 'Ponctuel' | 'Mensuel' | 'Trimestriel' | 'Annuel';
  nextPaymentDate?: string; // YYYY-MM-DD
  nextPaymentAmount?: number;
  mandateType: 'CORE' | 'B2B'; 
  detailsLink?: string; 
  pdfLink?: string; // Link to the generated PDF
}

// Payment Card type
export interface PaymentCard {
  id: string;
  type: 'Physique' | 'Virtuelle';
  last4Digits: string;
  cardholderName: string;
  expiryDate: string; // MM/YY
  status: 'Active' | 'Bloquée' | 'Expirée' | 'Annulée';
  isContactlessEnabled?: boolean;
  spendingLimitMonth?: number;
  currentMonthSpending?: number; // Added to track spending
  spendingLimitTransaction?: number;
  associatedAccountIban: string;
}

// Re-export ModuleComponentProps for local use if needed
export type ModuleComponentProps = GlobalModuleComponentProps;