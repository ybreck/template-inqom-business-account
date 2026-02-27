

import React from 'react';
import AchatsModulePage from './AchatsModulePage';
import SupplierInvoiceListPage from '../supplierInvoices/SupplierInvoiceListPage';
import SupplierListPage from './SupplierListPage';
import SupplierPaymentListPage from './SupplierPaymentListPage';
import SupplierPaymentEditorPage from './SupplierPaymentEditorPage';
import IKListPage from './IKListPage';
import NotesFraisListPage from './NotesFraisListPage';
import { ShoppingCartIcon, ClipboardDocumentListIcon, ArchiveBoxIcon, ReceiptPercentIcon, ClipboardDocumentCheckIcon, CarIcon, UserGroupIcon, ArrowPathIcon, PlusCircleIcon } from '../../constants/icons';
import { PageConfig } from '../../../types';

export const achatsModuleConfig: PageConfig = {
  id: 'achats',
  title: 'Achats',
  icon: ShoppingCartIcon,
  component: AchatsModulePage,
  description: "Gérez l'ensemble de votre cycle d'achats."
};

export const achatsFacturesFournisseursConfig: PageConfig = {
  id: 'factures_fournisseurs',
  title: 'Factures',
  icon: ClipboardDocumentListIcon,
  component: SupplierInvoiceListPage,
  description: "Gérez et suivez vos factures fournisseurs."
};

export const achatsFournisseursConfig: PageConfig = {
  id: 'fournisseurs',
  title: 'Fournisseurs',
  icon: UserGroupIcon,
  component: SupplierListPage,
  description: "Gérez votre base de données fournisseurs."
};

export const achatsPaiementsConfig: PageConfig = {
  id: 'paiements_fournisseurs',
  title: 'Paiements',
  icon: ArrowPathIcon,
  component: SupplierPaymentListPage,
  description: "Gérez vos lots de paiements fournisseurs."
};

export const achatsNouveauPaiementConfig: PageConfig = {
  id: 'supplier_payment_editor',
  title: 'Nouveau Paiement',
  icon: PlusCircleIcon,
  component: SupplierPaymentEditorPage,
  description: "Créez un nouveau lot de paiements."
};

export const achatsNotesFraisConfig: PageConfig = {
  id: 'notes_frais',
  title: 'Notes de frais',
  icon: ReceiptPercentIcon,
  component: NotesFraisListPage,
  description: "Soumettez, validez et gérez les notes de frais de vos collaborateurs."
};

export const achatsIKConfig: PageConfig = {
  id: 'ik',
  title: 'Indemnités Kilométriques',
  icon: CarIcon,
  component: IKListPage,
  description: "Suivez et gérez les indemnités kilométriques."
};