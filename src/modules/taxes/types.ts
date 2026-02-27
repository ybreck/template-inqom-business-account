import { ModuleComponentProps as GlobalModuleComponentProps } from '../../../types';

export interface VatSummary {
    collected: number;
    deductible: number;
    credit: number;
}

export interface Deadline {
    id: string;
    title: string;
    subtitle: string;
    status: 'Prévu';
    amount: number;
    amountLabel: 'Crédit à recevoir' | 'Montant à payer';
    calculationBasis: string;
    dueDate: string;
    hasChat: boolean;
}

export interface EReporting {
    status: 'Activé';
    transactionsThisMonth: number;
    nextTransmissionDate: string;
}

export type ModuleComponentProps = GlobalModuleComponentProps;

export type EReportingStatusType = 'ADMIN_ACK' | 'PA_TO_ADMIN' | 'PA_ACK' | 'SENT_TO_PA' | 'USER_VALIDATION' | 'FLUX_GENERATION';

export interface EReportingHistoryEntry {
    id: string;
    title: string;
    description: string;
    author: string;
    timestamp: string; // ISO string for sorting, will be formatted for display
    statusType: EReportingStatusType;
}

export type DeclarationStatus = 'Déposé' | 'Payée' | 'Rejeté';

export interface DeclarationHistoryEntry {
  id: string;
  name: string;
  type: string;
  status: DeclarationStatus;
  date: string; // "DD/MM/YYYY"
  details: string | number;
  rejectionReason?: string;
}
