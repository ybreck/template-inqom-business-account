
import React, { useState } from 'react';
import { ModuleComponentProps } from './types';
import ModuleTabs from '../../../components/ModuleTabs'; 
import PlaceholderPage from '../../../components/PlaceholderPage'; 
import ProAccountOverviewPage from './ProAccountOverviewPage';
import ProAccountTransactionsPage from './ProAccountTransactionsPage';
import ProAccountTransferListPage from './ProAccountTransferListPage';
import ProAccountTransfersPage from './ProAccountTransfersPage'; 
import ProAccountBeneficiaryListPage from './ProAccountBeneficiaryListPage'; 
import ProAccountAddEditBeneficiaryPage from './ProAccountAddEditBeneficiaryPage'; 
import ProAccountDirectDebitsPage from './ProAccountDirectDebitsPage';
import ProAccountCreateMandatePage from './ProAccountCreateMandatePage'; // Import Create Mandate Page
import ProAccountCardsPage from './ProAccountCardsPage'; // Import Cards Page
import ProAccountAddCardPage from './ProAccountAddCardPage'; // Import Add Card Page
import ProAccountCardTransactionsPage from './ProAccountCardTransactionsPage'; // Import Card Transactions Page
import { ProAccountOnboarding } from './ProAccountOnboarding';


import {
  proAccountOverviewConfig,
  proAccountTransactionsConfig,
  proAccountTransferListConfig,
  proAccountNewTransferFormConfig, 
  proAccountDirectDebitsConfig,
  proAccountCreateMandateConfig, // Import Create Mandate Config
  proAccountCardsConfig,
  proAccountAddCardConfig, // Import Add Card Config
  proAccountCardTransactionsConfig, // Import Card Transactions Config
  proAccountBeneficiaryListConfig,
  proAccountAddEditBeneficiaryFormConfig 
} from './config';

import { QuestionMarkCircleIcon, CreditCardIcon } from '../../constants/icons'; 


const ProAccountMainPage: React.FC<ModuleComponentProps> = ({ onSubNavigate, activeSubPageId, onMainNavigate }) => {
  const [isActivated, setIsActivated] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);

  if (isOnboarding) {
    return (
      <ProAccountOnboarding 
        onComplete={() => {
          setIsOnboarding(false);
          setIsActivated(true);
        }}
        onCancel={() => setIsOnboarding(false)}
      />
    );
  }

  if (!isActivated) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white rounded-xl shadow-sm border border-slate-200 m-6">
        <div className="w-24 h-24 bg-theme-primary-50 rounded-full flex items-center justify-center mb-6">
          <CreditCardIcon className="w-12 h-12 text-theme-primary-600" />
        </div>
        <h2 className="text-3xl font-semibold text-slate-900 mb-4">Activez votre Compte Pro</h2>
        <p className="text-slate-600 max-w-lg mb-8 text-lg">
          Gérez vos finances, effectuez des virements et suivez vos dépenses en temps réel avec le Compte Pro Inqom.
        </p>
        <button
          onClick={() => setIsOnboarding(true)}
          className="px-8 py-3 bg-theme-primary-600 text-white font-medium rounded-lg hover:bg-theme-primary-700 transition-colors shadow-sm text-lg"
        >
          Activer mon Compte Pro
        </button>
      </div>
    );
  }
  
  const baseTabConfigs = [
    proAccountOverviewConfig,
    proAccountTransactionsConfig,
    proAccountTransferListConfig, 
    proAccountDirectDebitsConfig, // Parent of Create Mandate
    proAccountCardsConfig, // Parent of Add Card and Card Transactions
    proAccountBeneficiaryListConfig 
  ];

  const baseTabsMapped = baseTabConfigs.map(config => ({
    id: config.id || 'undefined-id', // Ensure id is always defined
    name: config.title,
    icon: React.createElement(config.icon as React.FC<React.SVGProps<SVGSVGElement>>, { className: "w-5 h-5" })
  }));

  let finalTabsToDisplay = [...baseTabsMapped];
  let tabIdToHighlightInModuleTabs = activeSubPageId;

  // Dynamically add "Nouveau Virement" tab
  if (activeSubPageId === proAccountNewTransferFormConfig.id) {
    const newTransferDynamicTab = {
      id: proAccountNewTransferFormConfig.id,
      name: `↳ ${proAccountNewTransferFormConfig.title}`,
      icon: React.createElement(proAccountNewTransferFormConfig.icon as React.FC<React.SVGProps<SVGSVGElement>>, { className: "w-5 h-5" })
    };
    const parentListTabIndex = finalTabsToDisplay.findIndex(tab => tab.id === proAccountTransferListConfig.id);
    if (parentListTabIndex !== -1) {
      finalTabsToDisplay.splice(parentListTabIndex + 1, 0, newTransferDynamicTab);
    } else {
      finalTabsToDisplay.push(newTransferDynamicTab);
    }
    tabIdToHighlightInModuleTabs = proAccountNewTransferFormConfig.id;
  }
  // Dynamically add "Créer Mandat" tab
  else if (activeSubPageId === proAccountCreateMandateConfig.id) {
    const createMandateDynamicTab = {
      id: proAccountCreateMandateConfig.id,
      name: `↳ ${proAccountCreateMandateConfig.title}`,
      icon: React.createElement(proAccountCreateMandateConfig.icon as React.FC<React.SVGProps<SVGSVGElement>>, { className: "w-5 h-5" })
    };
    const parentDirectDebitsTabIndex = finalTabsToDisplay.findIndex(tab => tab.id === proAccountDirectDebitsConfig.id);
    if (parentDirectDebitsTabIndex !== -1) {
      finalTabsToDisplay.splice(parentDirectDebitsTabIndex + 1, 0, createMandateDynamicTab);
    } else {
      finalTabsToDisplay.push(createMandateDynamicTab);
    }
    tabIdToHighlightInModuleTabs = proAccountCreateMandateConfig.id;
  }
  // Dynamically add "Ajouter une Carte" tab
  else if (activeSubPageId === proAccountAddCardConfig.id) {
    const addCardDynamicTab = {
        id: proAccountAddCardConfig.id,
        name: `↳ ${proAccountAddCardConfig.title}`,
        icon: React.createElement(proAccountAddCardConfig.icon as React.FC<React.SVGProps<SVGSVGElement>>, {className: "w-5 h-5"})
    };
    const parentCardsTabIndex = finalTabsToDisplay.findIndex(tab => tab.id === proAccountCardsConfig.id);
    if (parentCardsTabIndex !== -1) {
        finalTabsToDisplay.splice(parentCardsTabIndex + 1, 0, addCardDynamicTab);
    } else {
        finalTabsToDisplay.push(addCardDynamicTab);
    }
    tabIdToHighlightInModuleTabs = proAccountAddCardConfig.id;
  }
  // Dynamically add "Transactions Carte X" tab
  else if (activeSubPageId && activeSubPageId.startsWith(proAccountCardTransactionsConfig.id)) {
     const cardId = activeSubPageId.split('?cardId=')[1] || '...';
     const cardTransactionsDynamicTab = {
        id: activeSubPageId, // Keep the full ID with param for selection
        name: `↳ Transactions Carte ...${cardId.slice(-4)}`, // Example dynamic title
        icon: React.createElement(proAccountCardTransactionsConfig.icon as React.FC<React.SVGProps<SVGSVGElement>>, {className: "w-5 h-5"})
     };
     const parentCardsTabIndex = finalTabsToDisplay.findIndex(tab => tab.id === proAccountCardsConfig.id);
     if (parentCardsTabIndex !== -1) {
        finalTabsToDisplay.splice(parentCardsTabIndex + 1, 0, cardTransactionsDynamicTab);
     } else {
        finalTabsToDisplay.push(cardTransactionsDynamicTab);
     }
     tabIdToHighlightInModuleTabs = activeSubPageId; // Highlight the specific transaction tab
  }
  // Highlight parent tab for "Add/Edit Beneficiary" form
  else if (activeSubPageId === proAccountAddEditBeneficiaryFormConfig.id) {
    tabIdToHighlightInModuleTabs = proAccountBeneficiaryListConfig.id;
  }
  // Default highlight if activeSubPageId is not a main tab or handled form
  else if (!baseTabConfigs.some(config => config.id === activeSubPageId)) {
    // If activeSubPageId is something like "comptes_pro_carte_transactions?cardId=xxx" but not yet added dynamically (e.g. initial load)
    // then we want to highlight the parent "Cartes" tab.
    if (activeSubPageId && activeSubPageId.startsWith(proAccountCardTransactionsConfig.id)) {
        tabIdToHighlightInModuleTabs = proAccountCardsConfig.id;
    } else {
        tabIdToHighlightInModuleTabs = baseTabConfigs.length > 0 ? (baseTabConfigs[0].id || '') : '';
    }
  }


  const renderActiveTabContent = () => {
    const propsForSubPages: ModuleComponentProps = { onSubNavigate, onMainNavigate, activeSubPageId };
    
    // Handle card transactions page specifically due to param
    if (activeSubPageId && activeSubPageId.startsWith(proAccountCardTransactionsConfig.id)) {
        return <ProAccountCardTransactionsPage {...propsForSubPages} />;
    }

    switch (activeSubPageId) {
      case proAccountOverviewConfig.id:
        return <ProAccountOverviewPage {...propsForSubPages} />;
      case proAccountTransactionsConfig.id:
        return <ProAccountTransactionsPage />; 
      case proAccountTransferListConfig.id:
        return <ProAccountTransferListPage {...propsForSubPages} />;
      case proAccountNewTransferFormConfig.id: 
        return <ProAccountTransfersPage {...propsForSubPages} />;
      case proAccountDirectDebitsConfig.id:
        return <ProAccountDirectDebitsPage {...propsForSubPages} />;
      case proAccountCreateMandateConfig.id: // Content for create mandate form
        return <ProAccountCreateMandatePage {...propsForSubPages} />;
      case proAccountCardsConfig.id:
        return <ProAccountCardsPage {...propsForSubPages} />;
      case proAccountAddCardConfig.id:
        return <ProAccountAddCardPage {...propsForSubPages} />;
      // CardTransactions handled above
      case proAccountBeneficiaryListConfig.id: 
        return <ProAccountBeneficiaryListPage {...propsForSubPages} />;
      case proAccountAddEditBeneficiaryFormConfig.id: 
        return <ProAccountAddEditBeneficiaryPage {...propsForSubPages} />;
      default:
        const currentConfig = baseTabConfigs.find(conf => conf.id === activeSubPageId);
        if (currentConfig && currentConfig.component) {
           const ComponentToRender = currentConfig.component;
           return <ComponentToRender {...propsForSubPages} />;
        }
         if (currentConfig) {
          return (
            <PlaceholderPage 
                title={currentConfig.title} 
                icon={currentConfig.icon ? React.createElement(currentConfig.icon as React.FC<React.SVGProps<SVGSVGElement>>) : undefined} 
                description={currentConfig.description || "Contenu en cours de développement."}
            />
          );
        }
        return (
            <PlaceholderPage 
                title="Onglet non trouvé" 
                icon={<QuestionMarkCircleIcon />} 
                description="Le contenu de cet onglet n'est pas disponible ou l'identifiant est incorrect."
            />
        );
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <ModuleTabs
        tabs={finalTabsToDisplay}
        activeTabId={tabIdToHighlightInModuleTabs || (baseTabConfigs.length > 0 ? (baseTabConfigs[0].id || '') : '')}
        onTabClick={(tabId) => {
          if (onSubNavigate) {
            onSubNavigate(tabId);
          }
        }}
      />
      <div className="flex-1 pt-0 p-6">
        {renderActiveTabContent()}
      </div>
    </div>
  );
};

export default ProAccountMainPage;