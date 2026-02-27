import { CashFlowDataPoint, Activity, ActivityClient } from './types';

export const mockCashFlowData: CashFlowDataPoint[] = [
  { month: 'Mars', actual: 85000 },
  { month: 'Avril', actual: 92000 },
  { month: 'Mai', actual: 78000 },
  { month: 'Juin', actual: 115230 },
  { month: 'Juil', actual: 115230, forecast: 115230 }, // Transition point
  { month: 'Août', forecast: 125000 },
  { month: 'Sept', forecast: 118000 },
  { month: 'Oct', forecast: 135000 },
  { month: 'Nov', forecast: 142000 },
  { month: 'Déc', forecast: 130000 },
];

export const mockActivities: Activity[] = [
    { id: 'activity_1', name: 'Prestations de service' },
    { id: 'activity_2', name: 'Vente de licences' },
    { id: 'activity_3', name: 'Formation & Conseil' },
];

export const mockActivityClients: Record<string, ActivityClient[]> = {
    'activity_1': [
        { id: 'client_A', name: 'Alpha SARL' },
        { id: 'client_C', name: 'Gamma Services' },
    ],
    'activity_2': [
        { id: 'client_B', name: 'Beta Industries' },
        { id: 'client_E', name: 'Epsilon Tech' },
    ],
    'activity_3': [
        { id: 'client_D', name: 'Delta Solutions' },
    ],
};

// Data for KPIs per activity
export const mockKpisByActivity: Record<string, { ca: number; nbFactures: number; retard: number; facturesRetard: number; }> = {
  'activity_1': { ca: 25300, nbFactures: 15, retard: 1250, facturesRetard: 2 },
  'activity_2': { ca: 18500, nbFactures: 8, retard: 0, facturesRetard: 0 },
  'activity_3': { ca: 9800, nbFactures: 12, retard: 450, facturesRetard: 1 },
};