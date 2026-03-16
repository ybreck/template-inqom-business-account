import React from 'react';

// Props for components rendered by App.tsx's main content area or by module shells
export interface ModuleComponentProps {
  onMainNavigate?: (pageId: string) => void;    // For navigating to a different top-level page/module
  onSubNavigate?: (subPageId: string) => void; // For navigating to a different tab/sub-page within the current module
  activeSubPageId?: string | null;             // The ID of the currently active sub-page/tab
  activeBrand?: 'inqom' | 'cabinet';             // Active brand for theming
  themeColors?: { primary: string; secondary: string }; // Direct hex colors for charts etc.
  isDafViewEnabled?: boolean;                  // Optional state for DAF view toggle
  onToggleDafView?: () => void;                  // Optional handler for DAF view toggle
}

export interface NavItem {
  id: string; // Unique identifier for each nav item
  name: string;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>; 
  active?: boolean; // To be deprecated in favor of activePageId in App.tsx
  badge?: number;
  isDropdown?: boolean; // Indicates if this item itself is a dropdown parent
  href?: string; 
  children?: NavItem[]; // For nested navigation items
  isOpen?: boolean; // For parent items, to set initial open/closed state
}

// Configuration for pages, used in pageComponentRegistry in App.tsx
export interface PageConfig {
  id?: string; // Optional ID, often matches the key in pageComponentRegistry
  title: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>; // Icon component for placeholders or tabs
  description?: string; // Description for placeholders
  component?: React.FC<ModuleComponentProps>; // The React component to render for this page/module shell
  children?: PageConfig[]; // For modules that have sub-pages defined structurally (less common with current App.tsx)
}


export interface InvoiceSummaryData {
  title: string;
  totalNonCategorized: string;
  infoTooltip?: string;
  enRetard: {
    total: string;
    segments: Array<{ label: string; value: number; amount: string; color: string }>;
  };
  aVenir: {
    total: string;
    segments: Array<{ label: string; value: number; amount: string; color: string }>;
  };
}

export interface MonthlyInvoiceData {
  month: string;
  clients: number;
  fournisseurs: number;
}

export type PAStatus = 
  // Statuts Ventes (Émetteur)
  | 'BROUILLON'                 // Créée
  | 'APPROUVEE_INTERNE'         // Approuvée (par nous, avant dépôt PA)
  | 'ANNULEE'                   // Annulée (par nous)
  | 'DEPOSEE_PA'               // Déposée (à notre PA)
  | 'REJETEE_PA'               // Rejetée (par notre PA ou l'administration via PA)
  | 'VALIDEE_PA'               // Transmise (par notre PA au client / PA client)
  | 'TELECHARGEE_CLIENT'        // Reçue (par client ou PA client) - Pour ventes, c'est le client qui reçoit
  | 'REFUSEE_CLIENT'            // Refusée (par client)
  | 'PAYEE'                     // Payée (par le client)
  | 'PARTIELLEMENT_PAYEE'       // Partiellement payée (par le client)
  | 'ENCAISSEE'                 // Encaissée (étape financière finale pour ventes)
  | 'EN_RETARD'                 // Facture client en retard de paiement
  | 'STATUT_CLIENT_INDISPONIBLE'// Cas où le statut du client n'est pas connu pour ventes

  // Statuts Achats (Récepteur - notre perspective quand on reçoit une facture fournisseur)
  | 'RECU_PA_ACHAT'            // Facture reçue de la PA du fournisseur
  | 'APPROUVEE_ACHAT'           // Facture fournisseur validée par nous
  | 'REJETEE_ACHAT'             // Facture fournisseur rejetée par nous (ex: litige)
  | 'PAYEE_ACHAT'               // Facture payée au fournisseur (inclut cas "en retard")
  | 'PARTIELLEMENT_PAYEE_ACHAT' // Facture partiellement payée au fournisseur
  | 'ANNULEE_ACHAT';            // Facture annulée par le fournisseur / ou par nous après accord


export interface ClientInvoice {
  id: string; 
  invoiceNumber: string;
  clientName: string;
  issueDate: string; 
  dueDate: string; 
  totalAmountTTC: number;
  status: PAStatus;
  pdpTransmissionDate?: string; 
  rejectionReason?: string;
  reminderSent?: boolean;
}

export interface Client {
  id:string;
  name: string; // Raison Sociale
  type: 'Entreprise' | 'Entreprise étrangère' | 'Particulier';
  
  // general info
  siren: string;
  nic: string;
  vatNumber: string;
  reference: string;
  notes: string;
  
  // address
  address: {
    street: string;
    postalCode: string;
    city: string;
    region: string;
    country: string;
    hasDifferentDeliveryAddress: boolean;
  };
  
  // contact
  primaryEmails: string;
  ccEmails: string;
  bccEmails: string;
  phone: string;
  
  // payment
  paymentTerms: string;
  iban?: string;
  bic?: string;
  mandateType?: 'CORE' | 'B2B' | 'Aucun';
  mandateRum?: string;
  mandateSignatureDate?: string; // YYYY-MM-DD
  excludeFromReminders?: boolean;

  // list view specific data
  invoiced: number;
  paid: number;
}

export interface Product {
  id: string;
  name: string;
  type: 'Livraison de biens' | 'Prestation de service';
  category: 'Produit finis' | 'Matière première' | 'Service';
  reference: string;
  description: string;
  unitPrice: number; // HT
  unit: 'Unité' | 'Heure' | 'Jour';
  taxRate: number; // as percentage, e.g. 20 for 20%
}

export interface BankAccount {
  id: string;
  bankName: string;
  iban: string;
  bic: string;
  isDefault: boolean;
}

// FIX: Export ProductLine and SectionLine to allow for more specific type usage in components.
export interface ProductLine {
  type: 'product';
  id: string; 
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; 
  discount: number;
  discountType: 'percentage' | 'amount';
}

export interface SectionLine {
  type: 'section';
  id: string;
  description: string;
}

export type InvoiceLineItem = ProductLine | SectionLine;


export interface EditableInvoice {
  id: string; 
  clientId?: string;
  clientName: string;
  clientAddress: string;
  invoiceNumber: string;
  issueDate: string; 
  dueDate: string; 
  deliveryDate?: string;
  lineItems: InvoiceLineItem[];
  documentDiscount: number;
  documentDiscountType: 'percentage' | 'amount';
  bankAccountId?: string;
  freeFieldContent: string;
  latePenaltiesText: string;
  discountConditionsText: string;
}

export type QuoteStatus = 
  | 'BROUILLON'
  | 'ENVOYE'
  | 'ACCEPTE'
  | 'REFUSE'
  | 'ANNULE';

export type SubscriptionStatus = 'Actif' | 'En pause' | 'Résilié';

export interface SubscriptionInvoice {
    id: string;
    status: 'Encaissée' | 'En attente' | 'En retard';
    issueDate: string; // YYYY-MM-DD
    dueDate: string; // YYYY-MM-DD
    amountTTC: number;
}

export interface SubscriptionProduct {
    id: string;
    name: string;
    reference: string;
    unit: string;
    unitPriceHT: number;
    tva: number; // as a percentage, e.g. 20 for 20%
}

export interface Subscription {
  id: string;
  name: string;
  status: SubscriptionStatus;
  creationDate: string; // YYYY-MM-DD
  invoiceCount: number;
  amountHT: number;
  amountTTC: number;
  // Detail page fields
  startDate?: string;
  endDate?: string;
  paymentMethod?: 'Virement' | 'Prélèvement';
  recurrence?: 'Tous les mois' | 'Tous les trimestres' | 'Tous les ans';
  paymentConditions?: 'Paiement sous 25 jours' | 'Comptant';
  finalizationMode?: 'Brouillon' | 'Validé';
  invoicesIssued?: { objective: number; current: number };
  invoicesToIssue?: number;
  totalBilled?: { objective: number; current: number };
  remainingToBill?: number;
  pastInvoices?: SubscriptionInvoice[];
  futureInvoices?: SubscriptionInvoice[];
  products?: SubscriptionProduct[];
}

export interface EditableSubscription {
  id: string; 
  name: string; // Nom de l'abonnement
  clientId?: string;
  clientName: string;
  clientAddress: string;

  // Subscription specific settings
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD, optional for indefinite
  paymentMethod: 'Virement' | 'Prélèvement';
  recurrence: 'Tous les mois' | 'Tous les trimestres' | 'Tous les ans';
  paymentConditions: string;
  finalizationMode: 'Brouillon' | 'Validé';
  
  // Invoice template part
  lineItems: InvoiceLineItem[];
  documentDiscount: number;
  documentDiscountType: 'percentage' | 'amount';
  bankAccountId?: string;
  freeFieldContent: string;
  latePenaltiesText: string;
  discountConditionsText: string;
}

export interface Quote {
  id: string; 
  quoteNumber: string;
  clientName: string;
  issueDate: string; 
  expiryDate: string; 
  totalAmountTTC: number;
  status: QuoteStatus;
  invoiceId?: string; 
  statusHistory?: InvoiceStatusHistoryEntry[];
  communicationHistory?: InvoiceCommunicationEntry[];
}

export interface EditableQuote {
  id: string; 
  clientId?: string;
  clientName: string;
  clientAddress: string;
  quoteNumber: string;
  issueDate: string; 
  expiryDate: string; 
  lineItems: InvoiceLineItem[];
  deliveryDate?: string;
  documentDiscount: number;
  documentDiscountType: 'percentage' | 'amount';
  bankAccountId?: string;
  freeFieldContent: string;
  latePenaltiesText: string;
  discountConditionsText: string;
}

export type DirectDebitStatus = 'En préparation' | 'Prélevé';

export interface DirectDebitInvoice {
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  dueDate: string;
  totalAmount: number;
  amountToDebit: number;
}

export interface DirectDebitBatch {
  id: string;
  name: string;
  destinationAccountId: string;
  status: DirectDebitStatus;
  invoiceCount: number;
  creationDate: string; // YYYY-MM-DD
  debitDate?: string; // YYYY-MM-DD
  totalAmountTTC: number;
  invoices: DirectDebitInvoice[];
}

export interface KPIScorecardProps {
  title: string;
  value: string;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  change?: string; 
  changeType?: 'positive' | 'negative' | 'neutral';
  description?: string;
}

export interface MonthlyDataPoint {
  month: string;
  value: number;
}

export interface ChatMessage {
  id: string;
  sender: string; 
  text: string;
  timestamp: string; 
  isUserMessage: boolean; 
}

export interface ConversationThread {
  id: string;
  contactName: string;
  contactTag: string; 
  isFavorite: boolean;
  lastMessagePreview: string;
  lastMessageDate: string; 
  messages: ChatMessage[];
  unread?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string; 
  category: string; 
  content: string;
  imageUrl?: string;
  link?: string; 
  read?: boolean; 
}


// Specific types for Supplier Invoices, similar to Client Invoices
export interface InvoiceStatusHistoryEntry {
  id: string;
  date: string; // ISO string
  status: string; 
  changedBy: string; // User name or "Système"
  notes?: string;
}

export interface InvoiceCommunicationEntry {
  id: string;
  date: string; // ISO string
  type: 'Email' | 'Appel' | 'Notification Système' | 'Relance Fournisseur' | 'Relance Client';
  summary: string;
  user?: string; // User who initiated or "Système"
}


export interface SupplierInvoice {
  id: string;
  invoiceNumber: string;
  supplierName: string;
  issueDate: string;
  dueDate: string;
  receptionDate?: string; // Date we received it
  totalAmountTTC: number;
  status: PAStatus; // Reusing PAStatus, interpreted for supplier side
  statusHistory?: InvoiceStatusHistoryEntry[];
  communicationHistory?: InvoiceCommunicationEntry[];
  rejectionReason?: string; // If we reject it internally
}

export interface EditableSupplierInvoice {
  id: string; 
  supplierName: string;
  supplierAddress?: string; // Optional
  invoiceNumber: string;
  issueDate: string; 
  dueDate: string; 
  receptionDate?: string;
  lineItems: InvoiceLineItem[]; // Reusing InvoiceLineItem
}

// ===== SUPPLIERS & PAYMENTS =====
export interface Supplier {
  id: string;
  name: string; // Raison Sociale
  type: 'Entreprise' | 'Entreprise étrangère' | 'Particulier';
  siren: string;
  reference: string;
  notes: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  primaryEmails: string;
  phone: string;
  paymentTerms: string;
  iban?: string;
  bic?: string;
  due: number;    // Montant dû
  paid: number;   // Montant payé
}

export type SupplierPaymentStatus = 'En préparation' | 'Payé';

export interface SupplierPaymentInvoice {
  invoiceId: string;
  invoiceNumber: string;
  supplierName: string;
  dueDate: string;
  totalAmount: number;
  amountToPay: number;
}

export interface SupplierPaymentBatch {
  id: string;
  name: string;
  sourceAccountId: string; // From which account we are paying
  status: SupplierPaymentStatus;
  invoiceCount: number;
  creationDate: string; // YYYY-MM-DD
  paymentDate?: string; // YYYY-MM-DD
  totalAmountTTC: number;
  invoices: SupplierPaymentInvoice[];
}


// ===== NOTIFICATIONS / ACTIONS A FAIRE =====
export type NotificationType =
  | 'invoice_overdue_sales'
  | 'invoice_received_supplier'
  | 'missing_document'
  | 'approval_request'
  | 'message'
  | 'pro_account_onboarding';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  status: 'pending' | 'archived';
  timestamp: string; // ISO date string
  relatedData: {
    // Sales invoice
    invoiceId?: string;
    invoiceNumber?: string;
    clientName?: string;
    // Supplier invoice
    supplierName?: string;
    // Common
    amount?: number | string;
    // Message
    fromUser?: string;
    fromUserTitle?: string;
    avatarInitial?: string;
    time?: string;
    // Missing doc
    thirdPartyName?: string;
    transactionDate?: string;
    // Approval request
    employee?: string;
  };
  urgent?: boolean;
}

// ===== MILEAGE ALLOWANCES =====
export type MileageAllowanceStatus = 'À valider' | 'Approuvée' | 'Remboursée' | 'Rejetée';

export interface MileageAllowance {
  id: string;
  collaboratorName: string;
  reason: string;
  amount: number;
  distance: number;
  status: MileageAllowanceStatus;
  creationDate: string; // YYYY-MM-DD
  travelDate: string; // YYYY-MM-DD
  reimbursementDate?: string; // YYYY-MM-DD
}

// ===== EXPENSE REPORTS =====
export type ExpenseReportStatus = 'À valider' | 'Approuvée' | 'Remboursée' | 'Rejetée';

export interface ExpenseReport {
  id: string;
  collaboratorName: string;
  category: string;
  amount: number;
  status: ExpenseReportStatus;
  creationDate: string; // YYYY-MM-DD
  period: string; // e.g., 'août 2024'
  reimbursementDate?: string; // YYYY-MM-DD
}

export interface ExpenseReportLineItem {
  id: string;
  type: string; // 'Restaurant', 'Transport', 'Hôtel', 'Autre'
  date: string; // YYYY-MM-DD
  motif: string;
  ht: number;
  tvaRate: number; // As percentage e.g. 20 for 20%
  ttc: number;
}

export interface EditableExpenseReport {
    id: string;
    collaboratorName: string;
    emissionDate: string; // YYYY-MM-DD
    lineItems: ExpenseReportLineItem[];
    attachments: File[];
}

export interface CompanyInfo {
  name: string;
  siren: string;
  vatNumber: string;
}
