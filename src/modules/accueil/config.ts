import React from 'react';
import AccueilPage from './AccueilPage';
import { HomeIcon } from '../../constants/icons'; // Adjusted path
import { PageConfig } from '../../../types';

export const accueilConfig: PageConfig = {
  id: 'accueil', // Ensure ID matches if it's used for keys/navigation
  title: 'Accueil',
  icon: HomeIcon,
  component: AccueilPage,
  description: "Page d'accueil principale de l'application."
};
