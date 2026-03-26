
import React, { useState } from 'react';
import { ModuleComponentProps } from './types';
import ModuleTabs from '../../../components/ModuleTabs'; 
import PlaceholderPage from '../../../components/PlaceholderPage'; 
import ProAccountOverviewPage from './ProAccountOverviewPage';
import ProAccountTransferListPage from './ProAccountTransferListPage';
import ProAccountTransfersPage from './ProAccountTransfersPage'; 
import ProAccountBeneficiaryListPage from './ProAccountBeneficiaryListPage'; 
import ProAccountCardsPage from './ProAccountCardsPage'; // Import Cards Page
import ProAccountAddCardPage from './ProAccountAddCardPage'; // Import Add Card Page
import ProAccountCardTransactionsPage from './ProAccountCardTransactionsPage'; // Import Card Transactions Page
import { ProAccountOnboarding } from './ProAccountOnboarding';


import {
  proAccountOverviewConfig,
  proAccountAccountConfig,
  proAccountTransferListConfig,
  proAccountNewTransferFormConfig, 
  proAccountCardsConfig,
  proAccountAddCardConfig, // Import Add Card Config
  proAccountCardTransactionsConfig, // Import Card Transactions Config
  proAccountBeneficiaryListConfig,
  proAccountMembersConfig
} from './config';

import { QuestionMarkCircleIcon, CreditCardIcon } from '../../constants/icons'; 


import { mockNotifications, addNotification } from '../../data/notifications';

const ProAccountMainPage: React.FC<ModuleComponentProps> = ({ onSubNavigate, activeSubPageId, onMainNavigate }) => {
  const [isActivated, setIsActivated] = useState(false);
  const [savedStepIndex, setSavedStepIndex] = useState(() => {
    const saved = localStorage.getItem('proAccountOnboardingStep');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isOnboarding, setIsOnboarding] = useState(() => {
    const saved = localStorage.getItem('proAccountOnboardingStep');
    return saved && parseInt(saved, 10) === 6 ? true : false;
  });
  const [hasStartedOnboarding, setHasStartedOnboarding] = useState(() => {
    return localStorage.getItem('proAccountOnboardingStarted') === 'true' || 
           mockNotifications.some(n => n.type === 'pro_account_onboarding' && n.status === 'pending');
  });

  if (isOnboarding) {
    return (
      <ProAccountOnboarding 
        initialStep={hasStartedOnboarding ? savedStepIndex : 0}
        onComplete={() => {
          setIsOnboarding(false);
          setIsActivated(true);
          localStorage.removeItem('proAccountOnboardingStarted');
          localStorage.removeItem('proAccountOnboardingStep');
          // Optional: mark notification as archived if we had a function for it
        }}
        onCancel={(stepIndex) => {
          setIsOnboarding(false);
          setHasStartedOnboarding(true);
          setSavedStepIndex(stepIndex);
          localStorage.setItem('proAccountOnboardingStarted', 'true');
          localStorage.setItem('proAccountOnboardingStep', stepIndex.toString());
          addNotification({
            id: 'notif-pro-account-resume',
            type: 'pro_account_onboarding',
            title: 'Finalisez l\'ouverture de votre Compte Pro',
            description: 'Vous avez commencé l\'activation de votre Compte Pro. Reprenez là où vous vous étiez arrêté pour finaliser l\'ouverture.',
            status: 'pending',
            timestamp: new Date().toISOString(),
            relatedData: {},
            urgent: true,
          });
        }}
      />
    );
  }

  if (!isActivated) {
    return (
      <div className="relative flex flex-col items-center justify-center h-full p-8 text-center bg-white rounded-xl shadow-sm border border-slate-200 m-6">
        {hasStartedOnboarding && (
          <button
            onClick={() => {
              localStorage.removeItem('proAccountOnboardingStarted');
              localStorage.removeItem('proAccountOnboardingStep');
              setHasStartedOnboarding(false);
              setSavedStepIndex(0);
            }}
            className="absolute top-4 right-4 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Réinitialiser
          </button>
        )}
        <div className="w-24 h-24 bg-theme-primary-50 rounded-full flex items-center justify-center mb-6">
          <CreditCardIcon className="w-12 h-12 text-theme-primary-600" />
        </div>
        <h2 className="text-3xl font-semibold text-slate-900 mb-4">
          {hasStartedOnboarding ? "Reprendre l'activation" : "Activez votre Compte Pro"}
        </h2>
        <p className="text-slate-600 max-w-lg mb-8 text-lg">
          {hasStartedOnboarding 
            ? "Vous avez commencé l'activation de votre Compte Pro. Reprenez là où vous vous étiez arrêté pour finaliser l'ouverture." 
            : "Gérez vos finances, effectuez des virements et suivez vos dépenses en temps réel avec le Compte Pro Inqom."}
        </p>
        <button
          onClick={() => setIsOnboarding(true)}
          className="px-8 py-3 bg-theme-primary-600 text-white font-medium rounded-lg hover:bg-theme-primary-700 transition-colors shadow-sm text-lg"
        >
          {hasStartedOnboarding ? "Reprendre l'activation" : "Activer mon Compte Pro"}
        </button>
      </div>
    );
  }
  
  const baseTabConfigs = [
    proAccountOverviewConfig,
    proAccountAccountConfig,
    proAccountCardsConfig, // Parent of Add Card and Card Transactions
    proAccountTransferListConfig,
    proAccountBeneficiaryListConfig,
    proAccountMembersConfig,
  ];

  const baseTabsMapped = baseTabConfigs.map(config => ({
    id: config.id || 'undefined-id', // Ensure id is always defined
    name: config.title,
    icon: React.createElement(config.icon as React.FC<React.SVGProps<SVGSVGElement>>, { className: "w-5 h-5" })
  }));

  let finalTabsToDisplay = [...baseTabsMapped];
  let tabIdToHighlightInModuleTabs = activeSubPageId;

  // Dynamically add "Ajouter une Carte" tab
  if (activeSubPageId === proAccountAddCardConfig.id) {
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
      case proAccountAccountConfig.id:
        return <proAccountAccountConfig.component {...propsForSubPages} />;
      case proAccountTransferListConfig.id:
        return <ProAccountTransferListPage {...propsForSubPages} />;
      case proAccountCardsConfig.id:
        return <ProAccountCardsPage {...propsForSubPages} />;
      case proAccountAddCardConfig.id:
        return <ProAccountAddCardPage {...propsForSubPages} />;
      // CardTransactions handled above
      case proAccountBeneficiaryListConfig.id: 
        return <ProAccountBeneficiaryListPage {...propsForSubPages} />;
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