import React from 'react';
import FacturationModulePage from './FacturationModulePage';
import { DocumentDuplicateIcon } from '../../constants/icons';
import { PageConfig } from '../../../types'; 

// Main shell component for the "Facturation" module
export const facturationModuleConfig: PageConfig = {
  id: 'facturation',
  title: 'Facturation',
  icon: DocumentDuplicateIcon,
  component: FacturationModulePage,
  description: "Gérez vos devis, factures, abonnements et produits."
};
