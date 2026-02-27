// Import shared props for page components
import { ModuleComponentProps as GlobalModuleComponentProps, PAStatus, BankAccount as GlobalBankAccount } from '../../../types'; // Import PAStatus from global

export interface InvoiceStatusHistoryEntry {
  id: string;
  date: string; // ISO string
  status: string; // Could be PAStatus or custom like "Relance envoyée"
  changedBy: string; // User name or "Système"
  notes?: string;
}

export interface InvoiceCommunicationEntry {
  id: string;
  date: string; // ISO string
  type: 'Email' | 'Appel' | 'Notification Système' | 'Relance Client';
  summary: string;
  user?: string; // User who initiated or "Système"
}

export interface ClientInvoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  totalAmountTTC: number;
  status: PAStatus; // Uses global PAStatus
  pdpTransmissionDate?: string;
  rejectionReason?: string;
  statusHistory?: InvoiceStatusHistoryEntry[];
  communicationHistory?: InvoiceCommunicationEntry[];
  // FIX: Added optional reminderSent property to track manual reminders
  reminderSent?: boolean;
}

// FIX: Changed InvoiceLineItem to a discriminated union to support both product and section lines.
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

// Re-export ModuleComponentProps for local use if needed, or components can import from global types
export type ModuleComponentProps = GlobalModuleComponentProps;
// Export PAStatus locally if needed, though it's better to import from global types.ts
export type { PAStatus };
export type BankAccount = GlobalBankAccount;