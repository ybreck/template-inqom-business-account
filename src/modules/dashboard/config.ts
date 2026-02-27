
import React from 'react';
import DashboardPage from './DashboardPage';
import AccueilPage from '../accueil/AccueilPage'; // Import the new AccueilPage
import { ChartBarIcon, HomeIcon } from '../../constants/icons'; // Adjusted path
import { PageConfig } from '../../../types';


export const dashboardConfig: PageConfig = {
  id: 'dashboard', // Ensure ID matches
  title: 'Tableau de bord',
  icon: ChartBarIcon,
  component: DashboardPage,
  description: "Visualisez les indicateurs clés et les résumés de votre activité."
};

// This accueilConfig might be overridden by the one in src/modules/accueil/config.ts
// if App.tsx imports that one specifically for the 'accueil' route.
// For safety, keeping it pointing to AccueilPage.
export const accueilConfig: PageConfig = {
  id: 'accueil', // Ensure ID matches
  title: 'Accueil',
  icon: HomeIcon,
  component: AccueilPage, // UPDATED to use the new AccueilPage
  description: "Page d'accueil principale de l'application."
};
