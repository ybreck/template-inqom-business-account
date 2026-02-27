
import React from 'react';
import EtatsComptablesModulePage from './EtatsComptablesModulePage';
import { DocumentDuplicateIcon, DocumentTextIcon, ChartBarIcon } from '../../constants/icons';
import { PageConfig } from '../../../types';

export const etatsComptablesModuleConfig: PageConfig = {
  id: 'etats_comptables',
  title: 'Etats Comptables',
  icon: DocumentDuplicateIcon,
  component: EtatsComptablesModulePage,
  description: "Consultez vos états comptables, compte de résultat et plaquette."
};

export const etatsConfig: PageConfig = {
  id: 'etats',
  title: 'Etats',
  icon: DocumentTextIcon,
  description: "Consultation de vos états comptables."
};

export const compteDeResultatConfig: PageConfig = {
  id: 'compte_de_resultat',
  title: 'Compte de résultat',
  icon: ChartBarIcon,
  description: "Consultation de votre compte de résultat."
};

export const plaquetteConfig: PageConfig = {
  id: 'plaquette',
  title: 'Plaquette',
  icon: DocumentTextIcon,
  description: "Consultation de votre plaquette comptable."
};
