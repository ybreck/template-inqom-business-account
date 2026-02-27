import React from 'react';
import PilotageModulePage from './PilotageModulePage';
import DashboardPage from '../dashboard/DashboardPage'; 
import PrevisionnelTresoreriePage from './PrevisionnelTresoreriePage';
import SuiviParActivitePage from './SuiviParActivitePage';
import { ChartPieIcon, CheckCircleIcon, PresentationChartLineIcon, AdjustmentsHorizontalIcon } from '../../constants/icons';
import { PageConfig } from '../../../types';

export const pilotageModuleConfig: PageConfig = {
  id: 'pilotage',
  title: 'Pilotage',
  icon: ChartPieIcon,
  component: PilotageModulePage,
  description: "Analysez vos données par centre de coût/profit, réel et prévisionnel."
};

export const pilotageReelConfig: PageConfig = {
  id: 'reel',
  title: 'Réel',
  icon: CheckCircleIcon,
  component: DashboardPage, 
  description: "Consultez vos données analytiques réelles et mesurez vos performances passées."
};

export const pilotagePrevisionnelConfig: PageConfig = {
  id: 'previsionnel',
  title: 'Prévisionnel',
  icon: PresentationChartLineIcon,
  component: PrevisionnelTresoreriePage,
  description: "Établissez et suivez votre prévisionnel de trésorerie."
};

export const pilotageSuiviActiviteConfig: PageConfig = {
  id: 'suivi_par_activite',
  title: 'Suivi par activité',
  icon: AdjustmentsHorizontalIcon,
  component: SuiviParActivitePage,
  description: "Analysez vos métriques par secteur d'activité."
};
