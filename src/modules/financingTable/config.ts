
import React from 'react';
import FinancingTablePage from './FinancingTablePage';
import { TableCellsIcon } from '../../constants/icons'; 
import { PageConfig } from '../../../types';

// Cette config est pour le contenu de l'onglet "Tableau de financement" dans TresorerieModulePage
export const financingTableConfig: PageConfig = {
  id: 'tableau_financement', // ID utilisé par TresorerieModulePage pour cet onglet
  title: 'Tableau de financement',
  icon: TableCellsIcon,
  component: FinancingTablePage,
  description: "Visualisez et analysez votre tableau de financement prévisionnel et réel."
};
