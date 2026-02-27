import { ModuleComponentProps as GlobalModuleComponentProps, PAStatus, InvoiceStatusHistoryEntry as GlobalStatusHistoryEntry, InvoiceCommunicationEntry as GlobalCommunicationEntry } from '../../../types';

// Re-export or use global types directly
export type ModuleComponentProps = GlobalModuleComponentProps;
export type { PAStatus };

// Specific types for Supplier Invoices
export type InvoiceStatusHistoryEntry = GlobalStatusHistoryEntry;
export type InvoiceCommunicationEntry = GlobalCommunicationEntry;


export interface SupplierInvoice {
  id: string;
  invoiceNumber: string;
  supplierName: string;
  issueDate: string; // Date d'émission par le fournisseur
  dueDate: string; // Date d'échéance pour paiement
  receptionDate?: string; // Date de réception chez nous (via PA ou manuelle)
  totalAmountTTC: number;
  status: PAStatus; // Réutilise PAStatus, interprété pour le côté fournisseur
  statusHistory?: InvoiceStatusHistoryEntry[];
  communicationHistory?: InvoiceCommunicationEntry[];
  rejectionReason?: string; // Si nous la rejetons en interne
  paymentDate?: string; // Date à laquelle nous l'avons payée
  assignedTo?: string; // Pour validation interne
}

export interface InvoiceLineItem { // Can be shared or defined locally if different
  id: string;
  description: string;
  quantity: number;
  unitPrice: number; // HT
  taxRate: number; // e.g., 0.20 for 20%
}

export interface EditableSupplierInvoice {
  id: string;
  supplierName: string;
  supplierAddress?: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  receptionDate?: string;
  lineItems: InvoiceLineItem[];
  notes?: string;
}