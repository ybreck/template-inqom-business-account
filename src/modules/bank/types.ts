import React from 'react';
import { ModuleComponentProps as GlobalModuleComponentProps } from '../../../types';


export type BankTransactionStatus = 'Justifié' | 'À justifier' | 'Partiellement justifié' | '' | null;

export interface BankTransaction {
  id: string;
  accountId: string; // Link to a BankAccount
  description: string;
  date: string; // YYYY-MM-DD
  amount: number; // Positive for income, negative for expense
  status: BankTransactionStatus;
  paymentMethod?: string;
  analyticalCode?: string; // Code analytique
  attachmentRequired?: boolean; // If justification document is needed/present
  needsReconciliation?: boolean;
  reference?: string;
}

export interface BankGraphDataPoint {
  name: string; // Typically a date or time point
  value: number;
  color?: string; // Optional color for the line/area
}

export interface BankKPIData {
  id: string;
  title: string;
  amount: number;
  graphData: BankGraphDataPoint[];
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
}

export interface BankAccount {
    id: string;
    accountName: string;
    bankName: string;
    balance: number;
    iban: string;
    bic: string;
    status: 'Actif' | 'Inactif';
    logo: React.FC<React.SVGProps<SVGSVGElement>>;
    lastUpdated: string;
}

// Re-export ModuleComponentProps for local use if needed
// This will now include activeBrand and themeColors from the global definition
export type ModuleComponentProps = GlobalModuleComponentProps;