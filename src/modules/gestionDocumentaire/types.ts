import { ModuleComponentProps as GlobalModuleComponentProps } from '../../../types';

export type DocumentStatus = 'À classer' | 'Classé';
export type DocumentType = 'Facture Achat' | 'Facture Vente' | 'Note de Frais' | 'Relevé Bancaire' | 'Bulletin de Paie' | 'Social' | 'Juridique' | 'Autre' | null;

export interface EventLogEntry {
  timestamp: string; // ISO string
  user: string;
  action: string;
  details?: string;
}

export interface DocumentToClassify {
  id: string;
  fileName: string;
  uploadDate: string; // ISO string
  source: 'Email' | 'Upload Manuel' | 'Collecteur';
  status: DocumentStatus;
  type: DocumentType;
  fileUrl?: string; // link to view the doc
  previewUrl?: string; // url for a small preview image
  isArchived?: boolean; // track legal archiving status
  eventLog: EventLogEntry[];
}

// Re-export ModuleComponentProps for local use if needed
export type ModuleComponentProps = GlobalModuleComponentProps;