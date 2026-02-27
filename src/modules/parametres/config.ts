
import React from 'react';
import ParametresPage from './ParametresPage';
import { CogIcon } from '../../constants/icons';
import { PageConfig } from '../../../types';

export const parametresConfig: PageConfig = {
  id: 'parametres',
  title: 'Paramètres entreprise',
  icon: CogIcon,
  component: ParametresPage,
  description: "Configurez les informations de votre entreprise, les utilisateurs, les préférences et les intégrations."
};
