import React from 'react';
import VentesModulePage from './VentesModulePage';
import ClientInvoiceListPage from '../clientInvoices/ClientInvoiceListPage';
import NewInvoiceEditorPage from '../clientInvoices/NewInvoiceEditorPage';
import QuoteListPage from './QuoteListPage';
import NewQuoteEditorPage from './NewQuoteEditorPage';
import SubscriptionListPage from './SubscriptionListPage';
import ClientListPage from './ClientListPage';
import NewSubscriptionEditorPage from './NewSubscriptionEditorPage';
import ProductListPage from './ProductListPage';
import DirectDebitListPage from './DirectDebitListPage';
import DirectDebitEditorPage from './DirectDebitEditorPage';
import VentesParametresPage from './VentesParametresPage';

import { BanknotesIcon, DocumentTextIcon, PlusCircleIcon, CalendarDaysIcon, TagIcon, UserGroupIcon, ArchiveBoxIcon, ClipboardDocumentListIcon, ArrowPathIcon, CogIcon } from '../../constants/icons';
import { PageConfig } from '../../../types'; 

// Main shell component for the "Ventes" module
export const ventesModuleConfig: PageConfig = {
  id: 'ventes',
  title: 'Ventes',
  icon: BanknotesIcon,
  component: VentesModulePage,
  description: "Gérez l'ensemble de votre cycle de vente, de la facturation aux produits."
};

// Configurations for individual tabs within the Ventes module
export const ventesFacturationConfig: PageConfig = {
  id: 'ventes_facturation',
  title: 'Factures',
  icon: DocumentTextIcon,
  component: ClientInvoiceListPage,
  description: "Gérez et suivez vos factures clients."
};

export const ventesNouvelleFactureConfig: PageConfig = {
  id: 'facturation_create_invoice',
  title: 'Nouvelle Facture',
  icon: PlusCircleIcon,
  component: NewInvoiceEditorPage,
  description: "Créez une nouvelle facture client."
};

export const ventesDevisConfig: PageConfig = {
  id: 'ventes_devis',
  title: 'Devis',
  icon: ClipboardDocumentListIcon,
  component: QuoteListPage,
  description: "Créez, envoyez et suivez vos devis clients."
};

export const ventesNouveauDevisConfig: PageConfig = {
  id: 'create_quote',
  title: 'Nouveau Devis',
  icon: PlusCircleIcon,
  component: NewQuoteEditorPage,
  description: "Créez un nouveau devis."
};

export const ventesPrelevementsConfig: PageConfig = {
    id: 'ventes_prelevements',
    title: 'Prélèvements',
    icon: ArrowPathIcon,
    component: DirectDebitListPage,
    description: "Gérez vos prélèvements clients."
};

export const ventesNouveauPrelevementConfig: PageConfig = {
    id: 'direct_debit_editor',
    title: 'Nouveau Prélèvement',
    icon: PlusCircleIcon,
    component: DirectDebitEditorPage,
    description: "Créez un nouveau lot de prélèvements."
};

export const ventesAbonnementsConfig: PageConfig = {
  id: 'abonnements',
  title: 'Abonnements',
  icon: CalendarDaysIcon,
  component: SubscriptionListPage,
  description: "Gérez vos abonnements clients et les facturations récurrentes."
};

export const ventesNouvelAbonnementConfig: PageConfig = {
  id: 'create_subscription',
  title: 'Nouvel Abonnement',
  icon: PlusCircleIcon,
  component: NewSubscriptionEditorPage,
  description: "Créez un nouvel abonnement client."
};

export const ventesProduitsConfig: PageConfig = {
  id: 'produits',
  title: 'Produits',
  icon: TagIcon,
  component: ProductListPage,
  description: "Consultez et gérez votre catalogue de produits et services."
};

export const ventesClientsConfig: PageConfig = {
  id: 'clients',
  title: 'Clients',
  icon: UserGroupIcon,
  component: ClientListPage,
  description: "Gérez votre base de données clients et leurs informations."
};

export const ventesCaisseConfig: PageConfig = {
  id: 'caisse',
  title: 'Caisse',
  icon: ArchiveBoxIcon,
  description: "Gérez votre caisse enregistreuse et vos tickets."
};

export const ventesParametresConfig: PageConfig = {
  id: 'ventes_parametres',
  title: 'Paramètres de Vente',
  icon: CogIcon,
  component: VentesParametresPage,
  description: "Configurez les relances automatiques et d'autres paramètres de vente."
};