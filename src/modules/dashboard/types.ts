
import React from 'react';
import { ModuleComponentProps as GlobalModuleComponentProps } from '../../../types';


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

// Re-export ModuleComponentProps for local use if needed
// This will now include activeBrand and themeColors from the global definition
export type ModuleComponentProps = GlobalModuleComponentProps;