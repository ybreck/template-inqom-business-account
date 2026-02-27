import React from 'react';
import DocumentsComptablesPage from './DocumentsComptablesPage';
import { DocumentDuplicateIcon } from '../../constants/icons';
import { PageConfig } from '../../../types';

export const documentsComptablesModuleConfig: PageConfig = {
  id: 'documents_comptables',
  title: 'Documents Comptables',
  icon: DocumentDuplicateIcon,
  component: DocumentsComptablesPage,
  description: "Consultez et gérez vos documents comptables."
};
