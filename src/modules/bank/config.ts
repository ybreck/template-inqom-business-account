
import React from 'react';
import BankPage from './BankPage';
import { BuildingLibraryIcon } from '../../constants/icons'; // Shared icon
import { PageConfig } from '../../../types';

// Cette config est pour le contenu de l'onglet "Banque" dans TresorerieModulePage
export const bankPageConfig: PageConfig = {
  id: 'banque', 
  title: 'Banque',
  icon: BuildingLibraryIcon, 
  component: BankPage,
  description: "Consultez vos soldes, mouvements et gérez vos opérations bancaires."
};
