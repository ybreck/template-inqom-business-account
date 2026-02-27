

import React from 'react';
import GestionDocModulePage from './GestionDocModulePage';
import ClasserDocsPage from './ClasserDocsPage';
import { FolderPlusIcon, DocumentDuplicateIcon, LockClosedIcon } from '../../constants/icons';
import { PageConfig } from '../../../types';

export const gestionDocModuleConfig: PageConfig = {
  id: 'gestion_documentaire',
  title: 'Gestion Documentaire',
  icon: FolderPlusIcon,
  component: GestionDocModulePage,
  description: "Gérez, classez et sécurisez vos documents d'entreprise."
};

export const mesDocumentsConfig: PageConfig = {
  id: 'mes_documents',
  title: 'Mes documents',
  icon: DocumentDuplicateIcon,
  component: ClasserDocsPage,
  description: "Organisez, classez et archivez vos documents numériques de manière structurée."
};

export const gestionDocCoffreFortConfig: PageConfig = {
  id: 'coffre_fort',
  title: 'Coffre-fort',
  icon: LockClosedIcon,
  description: "Stockez vos documents les plus sensibles dans un espace numérique sécurisé."
};
