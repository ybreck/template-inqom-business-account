
import React from 'react';
import { PageConfig } from '../../../types'; // Import root PageConfig
import ProAccountMainPage from './ProAccountMainPage';
import ProAccountOverviewPage from './ProAccountOverviewPage';
import ProAccountAccountPage from './ProAccountAccountPage'; // Import new Account Page
import ProAccountTransactionsPage from './ProAccountTransactionsPage';
// ProAccountTransfersHubPage is removed
import ProAccountTransferListPage from './ProAccountTransferListPage'; // Page for listing transfers
import ProAccountTransfersPage from './ProAccountTransfersPage'; // Form for new transfer
import ProAccountBeneficiaryListPage from './ProAccountBeneficiaryListPage'; 
import ProAccountDirectDebitsPage from './ProAccountDirectDebitsPage';
import ProAccountCreateMandatePage from './ProAccountCreateMandatePage'; // Import the new page component
import ProAccountCardsPage from './ProAccountCardsPage'; // Import new Cards Page
import ProAccountAddCardPage from './ProAccountAddCardPage'; // Import new Add Card Page
import ProAccountCardTransactionsPage from './ProAccountCardTransactionsPage'; // Import new Card Transactions Page
import ProAccountMembersPage from './ProAccountMembersPage'; // Import Members Page


import { 
    CreditCardIcon, PresentationChartLineIcon, ClipboardDocumentListIcon, ArrowsRightLeftIcon, ArrowPathIcon, UserGroupIcon, PlusCircleIcon, DocumentPlusIcon
} from '../../constants/icons'; 

export const proAccountsMainConfig: PageConfig = {
  id: 'comptes_pro', 
  title: 'Comptes Pro', 
  icon: CreditCardIcon,
  component: ProAccountMainPage,
  description: "Gérez votre compte professionnel, vos transactions, virements, prélèvements et cartes."
};

export const proAccountOverviewConfig: PageConfig = {
  id: 'comptes_pro_synthese',
  title: 'Synthèse',
  icon: PresentationChartLineIcon,
  component: ProAccountOverviewPage, 
  description: "Vue d'ensemble de votre compte professionnel, solde et opérations récentes."
};

export const proAccountAccountConfig: PageConfig = {
  id: 'comptes_pro_compte',
  title: 'Compte',
  icon: ClipboardDocumentListIcon, // Using an existing icon
  component: ProAccountAccountPage,
  description: "Détails de votre compte bancaire et téléchargement du RIB."
};

export const proAccountTransferListConfig: PageConfig = {
  id: 'comptes_pro_virements', 
  title: 'Virements', 
  icon: ArrowsRightLeftIcon,
  component: ProAccountTransferListPage, 
  description: "Consultez l'historique de vos virements et effectuez de nouveaux virements."
};

export const proAccountNewTransferFormConfig: PageConfig = {
  id: 'comptes_pro_virements_nouveau', 
  title: 'Nouveau Virement', 
  icon: ArrowsRightLeftIcon, 
  component: ProAccountTransfersPage, 
  description: "Effectuez un nouveau virement SEPA."
};

export const proAccountBeneficiaryListConfig: PageConfig = {
  id: 'comptes_pro_beneficiaires_liste',
  title: 'Bénéficiaires', // Title for the tab
  icon: UserGroupIcon, // Icon for the tab
  component: ProAccountBeneficiaryListPage,
  description: "Gérez votre liste de bénéficiaires pour les virements."
};

export const proAccountCardsConfig: PageConfig = {
  id: 'comptes_pro_cartes',
  title: 'Cartes',
  icon: CreditCardIcon,
  component: ProAccountCardsPage, // Updated component
  description: "Gérez vos cartes de paiement physiques et virtuelles."
};

export const proAccountAddCardConfig: PageConfig = {
  id: 'comptes_pro_carte_ajouter',
  title: 'Ajouter une Carte',
  icon: PlusCircleIcon,
  component: ProAccountAddCardPage,
  description: "Commandez une nouvelle carte de paiement."
};

export const proAccountCardTransactionsConfig: PageConfig = {
  id: 'comptes_pro_carte_transactions', // Base ID, cardId will be appended as param
  title: 'Transactions Carte', // Title can be dynamic in the page itself
  icon: ClipboardDocumentListIcon,
  component: ProAccountCardTransactionsPage,
  description: "Consultez les transactions d'une carte spécifique."
};

export const proAccountMembersConfig: PageConfig = {
  id: 'comptes_pro_membres',
  title: 'Membres',
  icon: UserGroupIcon,
  component: ProAccountMembersPage,
  description: "Gérez les membres et leurs permissions sur le compte pro."
};