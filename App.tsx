

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PlaceholderPage from './components/PlaceholderPage';
import InqomCopilotWidget from './components/InqomCopilotWidget'; 

import { PageConfig as AppSpecificPageConfig, NavItem as AppSpecificNavItem, ModuleComponentProps } from './types';

// Import module configurations
import { accueilConfig } from './src/modules/accueil/config';
// dashboardConfig is still needed for Pilotage > Réel, but not directly in sidebar
import { dashboardConfig } from './src/modules/dashboard/config'; 
import { ventesModuleConfig } from './src/modules/ventes/config';
import { facturationModuleConfig } from './src/modules/facturation/config'; // New Facturation module
import { achatsModuleConfig } from './src/modules/achats/config';
import { gestionDocModuleConfig } from './src/modules/gestionDocumentaire/config';
import { 
  proAccountsMainConfig, 
  proAccountNewTransferFormConfig
} from './src/modules/proAccounts/config';
import { bankPageConfig } from './src/modules/bank/config';
import { pilotageModuleConfig } from './src/modules/pilotage/config';
import { conversationsConfig } from './src/modules/conversations/config'; 
import { taxesConfig } from './src/modules/taxes/config';
import { documentsComptablesModuleConfig } from './src/modules/documentsComptables/config';
import { paMarketingPageConfig } from './src/modules/pdpMarketing/config';
import { assistanceConfig } from './src/modules/assistance/config';
import { parametresConfig } from './src/modules/parametres/config';


import {
  HomeIcon, ChartBarIcon, DocumentTextIcon, ChatBubbleLeftRightIcon, LockClosedIcon,
  FolderPlusIcon, DocumentDuplicateIcon, ClipboardDocumentListIcon,
  KeyIcon, SquaresPlusIcon, CogIcon, QuestionMarkCircleIcon, BuildingLibraryIcon,
  BanknotesIcon, CalendarDaysIcon, TagIcon, UserGroupIcon, PlusCircleIcon, 
  ShoppingCartIcon, ArchiveBoxIcon, ReceiptPercentIcon, ClipboardDocumentCheckIcon,
  CreditCardIcon, TableCellsIcon, ArrowsRightLeftIcon, PresentationChartLineIcon,
  ChartPieIcon, CheckCircleIcon, AdjustmentsHorizontalIcon, ArrowPathIcon,
  ScaleIcon, CarIcon
} from './src/constants/icons';

// Theme color definitions
const INQOM_THEME_CSS_VARS = {
  '--color-primary-50': '#EAECFC',
  '--color-primary-100': '#D5D6F8',
  '--color-primary-200': '#ACADF2',
  '--color-primary-300': '#8283EC',
  '--color-primary-400': '#5859E6',
  '--color-primary-500': '#2F30E0',
  '--color-primary-600': '#2A2BC8',
  '--color-primary-700': '#2526B2',
  '--color-primary-800': '#20219C',
  '--color-primary-900': '#1B1C86',
  '--color-text': '#333333',
  '--color-primary-contrast-text': '#FFFFFF',
};

const CABINET_THEME_CSS_VARS = {
  '--color-primary-50': '#E0F5FF',
  '--color-primary-100': '#B3E5FC',
  '--color-primary-200': '#81D4FA',
  '--color-primary-300': '#4FC3F7',
  '--color-primary-400': '#29B6F6',
  '--color-primary-500': '#00A2E1',
  '--color-primary-600': '#0091EA',
  '--color-primary-700': '#0082D0',
  '--color-primary-800': '#0073B7',
  '--color-primary-900': '#00649D',
  '--color-text': '#333333', 
  '--color-primary-contrast-text': '#FFFFFF',
};

const INQOM_CHART_COLORS = {
  primary: '#2F30E0',
  secondary: '#54595F', 
};

const CABINET_CHART_COLORS = {
  primary: '#00A2E1',
  secondary: '#54595F', 
};


const baseSidebarNavigationStructure: AppSpecificNavItem[] = [
  { id: 'accueil', name: 'Accueil', icon: <HomeIcon /> },
  { id: 'banque', name: 'Banques', icon: <BuildingLibraryIcon /> },
  {
    id: 'facturation', name: 'Facturation', icon: <DocumentDuplicateIcon />,
    children: [
      { id: 'facturation_factures', name: 'Factures', icon: <DocumentTextIcon /> },
      { id: 'facturation_devis', name: 'Devis', icon: <ClipboardDocumentListIcon /> },
      { id: 'facturation_clients', name: 'Clients', icon: <UserGroupIcon /> },
      { id: 'facturation_abonnements', name: 'Abonnements', icon: <CalendarDaysIcon /> },
      { id: 'facturation_produits', name: 'Produits', icon: <TagIcon /> },
    ]
  },
  {
    id: 'pa', name: 'PA', icon: <SquaresPlusIcon />, isDropdown: true,
    children: [
      {
        id: 'ventes', name: 'Ventes', icon: <BanknotesIcon />,
        children: [
          { id: 'ventes_facturation', name: 'Factures', icon: <DocumentTextIcon /> },
          { id: 'ventes_clients', name: 'Clients', icon: <UserGroupIcon /> },
          { id: 'ventes_prelevements', name: 'Prélèvements', icon: <ArrowPathIcon /> },
        ]
      },
      { 
        id: 'achats', name: 'Achats', icon: <ShoppingCartIcon />,
        children: [
          { id: 'factures_fournisseurs', name: 'Factures', icon: <ClipboardDocumentListIcon /> },
          { id: 'paiements_fournisseurs', name: 'Paiements', icon: <ArrowPathIcon /> },
          { id: 'fournisseurs', name: 'Fournisseurs', icon: <UserGroupIcon /> },
          { id: 'notes_frais', name: 'Notes de frais', icon: <ReceiptPercentIcon /> },
          { id: 'ik', name: 'Indemnités Kilométriques', icon: <CarIcon /> },
        ] 
      },
    ]
  },
  { 
    id: 'gestion_documentaire', name: 'Gestion Documentaire', icon: <FolderPlusIcon />,
    children: [
      { id: 'mes_documents', name: 'Mes documents', icon: <DocumentDuplicateIcon />, badge: 16 },
      { id: 'coffre_fort', name: 'Coffre-fort', icon: <LockClosedIcon /> },
    ]
  },
  {
    id: 'comptes_pro', name: 'Comptes Pro', icon: <CreditCardIcon />,
    children: [ 
      { id: 'comptes_pro_synthese', name: 'Synthèse', icon: <PresentationChartLineIcon /> },
      { id: 'comptes_pro_operations', name: 'Opérations', icon: <ClipboardDocumentListIcon /> },
      { id: 'comptes_pro_virements', name: 'Virements', icon: <ArrowsRightLeftIcon /> },
      { id: 'comptes_pro_beneficiaires_liste', name: 'Bénéficiaires', icon: <UserGroupIcon /> },
      { id: 'comptes_pro_prelevements', name: 'Prélèvements', icon: <ArrowPathIcon /> },
      { id: 'comptes_pro_cartes', name: 'Cartes', icon: <CreditCardIcon /> },
      { id: 'comptes_pro_membres', name: 'Membres', icon: <UserGroupIcon /> },
    ]
  },
  {
    id: 'pilotage', name: 'Pilotage', icon: <ChartPieIcon />,
    children: [
      { id: 'reel', name: 'Réel', icon: <CheckCircleIcon /> }, 
      { id: 'previsionnel', name: 'Prévisionnel', icon: <PresentationChartLineIcon /> },
      { id: 'suivi_par_activite', name: 'Suivi par activité', icon: <AdjustmentsHorizontalIcon /> },
    ]
  },
  { id: 'documents_comptables', name: 'Documents comptables', icon: <DocumentDuplicateIcon /> },
  { id: 'taxes', name: 'Taxes', icon: <ScaleIcon /> },
  { id: 'conversations', name: 'Messagerie', icon: <ChatBubbleLeftRightIcon /> }, 
  { id: 'parametres', name: 'Paramètres entreprise', icon: <CogIcon /> },
  { id: 'assistance', name: 'Besoin d’assistance ?', icon: <QuestionMarkCircleIcon /> },
];

const pageComponentRegistry: Record<string, AppSpecificPageConfig> = {
  'accueil': accueilConfig,
  'dashboard': dashboardConfig, 
  'ventes': ventesModuleConfig,
  'facturation': facturationModuleConfig,
  'achats': achatsModuleConfig,
  'gestion_documentaire': gestionDocModuleConfig,
  'comptes_pro': proAccountsMainConfig, 
  'banque': bankPageConfig,
  'pilotage': pilotageModuleConfig, 
  'conversations': conversationsConfig, 
  'taxes': taxesConfig,
  'documents_comptables': documentsComptablesModuleConfig,
  'assistance': assistanceConfig,
  'parametres': parametresConfig,
  
  'comptes_pro_virements_nouveau': proAccountNewTransferFormConfig,

  'facturation_electronique_pa': paMarketingPageConfig,
  
  // Placeholders for new tabs so navigation works
  'caisse': { title: 'Caisse', icon: ArchiveBoxIcon, description: "Gérez votre caisse enregistreuse." },
  'ik': { title: 'Indemnités Kilométriques', icon: CarIcon, description: "Suivez et gérez les indemnités kilométriques." },

};

const defaultSubPageForMain: Record<string, string> = {
  'ventes': 'ventes_facturation',
  'facturation': 'facturation_factures',
  'achats': 'factures_fournisseurs',
  'gestion_documentaire': 'mes_documents',
  'comptes_pro': 'comptes_pro_synthese',
  'pilotage': 'reel', // UPDATED
  'conversations': 'conversations_chat', 
};


const App: React.FC = () => {
  const [activeBrand, setActiveBrand] = useState<'inqom' | 'cabinet'>('inqom');
  const [activeMainPageId, setActiveMainPageId] = useState<string>('accueil'); 
  const [activeSubPageId, setActiveSubPageId] = useState<string | null>('accueil');
  const [isDafViewEnabled, setIsDafViewEnabled] = useState(false);
  
  useEffect(() => {
    const root = document.documentElement;
    const newThemeVars = activeBrand === 'cabinet' ? CABINET_THEME_CSS_VARS : INQOM_THEME_CSS_VARS;
    for (const [key, value] of Object.entries(newThemeVars)) {
      root.style.setProperty(key, value);
    }
    document.title = activeBrand === 'cabinet' ? 'Votre Cabinet' : 'Inqom Gestion';
  }, [activeBrand]);

  const handleMainNavigate = (pageId: string) => {
    if (pageId.startsWith('http')) {
      window.open(pageId, '_blank');
      return;
    }
    
    // When clicking on 'PA', navigate to 'Ventes' by default
    if (pageId === 'pa') {
        pageId = 'ventes';
    }

    const defaultSubId = defaultSubPageForMain[pageId];

    if (pageId !== activeMainPageId) {
      // Clicked a new main page. Set main page and its default sub-page.
      setActiveMainPageId(pageId);
      if (defaultSubId) {
          setActiveSubPageId(defaultSubId);
      } else {
          // For modules that are their own page (e.g., 'accueil')
          setActiveSubPageId(pageId);
      }
    } else {
      // Re-clicked the same main page. Reset to its default sub-page.
      if (defaultSubId && activeSubPageId !== defaultSubId) {
         setActiveSubPageId(defaultSubId);
      }
    }
  };

  const handleSubNavigate = (subPageId: string) => {
    let newMainPageId = activeMainPageId;
    const subPageBase = subPageId.split('?')[0]; 
    const parentModuleCandidate = subPageBase.split('_')[0];

    // Check if the prefix of the sub-page ID matches a registered main module ID
    if (pageComponentRegistry[parentModuleCandidate] && baseSidebarNavigationStructure.some(nav => nav.id === parentModuleCandidate)) {
        newMainPageId = parentModuleCandidate;
    } else if (pageComponentRegistry[subPageBase] && baseSidebarNavigationStructure.some(nav => nav.id === subPageBase)) {
        // Fallback for cases where sub-page ID is a main page ID itself
        newMainPageId = subPageBase;
    } else if (subPageBase === 'mes_documents') { // Special case for new documents page
        newMainPageId = 'gestion_documentaire';
    } else {
        // If no direct parent match, check nested structure
        baseSidebarNavigationStructure.forEach(item => {
            if (item.children) {
                item.children.forEach(child => {
                    if (child.id === subPageBase) {
                        newMainPageId = item.id;
                    }
                });
            }
        });
    }


    // Set both states. React will batch these updates.
    if (newMainPageId !== activeMainPageId) {
        setActiveMainPageId(newMainPageId); 
    }
    setActiveSubPageId(subPageId); 
  };
  
  const currentChartColors = activeBrand === 'cabinet' ? CABINET_CHART_COLORS : INQOM_CHART_COLORS;

  const renderActivePageContent = () => {
    // If the marketing page is active, we render it full-width without the header.
    // However, the current structure has the header outside the page content.
    // For simplicity, we'll render it inside the main content area.
    if (activeSubPageId === 'facturation_electronique_pa') {
       const PageComponentToRender = pageComponentRegistry['facturation_electronique_pa'].component;
        if(PageComponentToRender) {
            return <PageComponentToRender onMainNavigate={handleMainNavigate} activeBrand={activeBrand} />;
        }
    }

    const props: ModuleComponentProps = {
      onMainNavigate: handleMainNavigate,
      onSubNavigate: handleSubNavigate,
      activeSubPageId: activeSubPageId, 
      activeBrand: activeBrand, 
      themeColors: currentChartColors,
      isDafViewEnabled: isDafViewEnabled,
      onToggleDafView: () => setIsDafViewEnabled(prev => !prev)
    };

    let pageIdForRegistry = activeMainPageId;
    
    // Handle special case where user clicks on a page that is part of a module (e.g. 'banque')
    // but the main pageId is still the module itself. In our new setup, 'banque' IS the main pageId.
    const mainModuleConfig = pageComponentRegistry[pageIdForRegistry];

    if (mainModuleConfig?.component) {
        const PageComponentToRender = mainModuleConfig.component;
        if (typeof PageComponentToRender === 'function') {
            return <PageComponentToRender {...props} />;
        } else {
            console.error(`Configuration error: component for page ID "${pageIdForRegistry}" is not a function. Received:`, PageComponentToRender);
        }
    }
    
    const title = mainModuleConfig?.title || "Page non trouvée";
    const description = mainModuleConfig?.description || `Le contenu pour l'identifiant "${pageIdForRegistry}" n'est pas disponible.`;
    
    let IconToRenderFn: React.FC<React.SVGProps<SVGSVGElement>> = QuestionMarkCircleIcon;
    if (mainModuleConfig && mainModuleConfig.icon && typeof mainModuleConfig.icon === 'function') {
        IconToRenderFn = mainModuleConfig.icon;
    } else if (mainModuleConfig && mainModuleConfig.icon) { 
        console.warn(`Invalid icon configuration for pageId "${pageIdForRegistry}". Expected a function component for the icon. Using default.`);
    }
    
    const iconElement = React.createElement(IconToRenderFn);

    return (
      <PlaceholderPage
        title={title}
        description={description}
        icon={iconElement}
      />
    );
  };
  
  return (
    <div id="app-container" className="flex h-screen max-w-screen-2xl mx-auto my-0 shadow-2xl">
      <Sidebar 
        activePageId={activeMainPageId} 
        onNavigate={handleMainNavigate} 
        navItems={baseSidebarNavigationStructure}
        activeBrand={activeBrand}
        setActiveBrand={setActiveBrand}
        isDafViewEnabled={isDafViewEnabled}
      />
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        {activeSubPageId !== 'facturation_electronique_pa' && <Header activeBrand={activeBrand} onSubNavigate={handleSubNavigate} />}
        <main className={`flex-1 ${activeSubPageId !== 'facturation_electronique_pa' ? 'p-6' : ''}`}>
          {renderActivePageContent()}
        </main>
      </div>
      <InqomCopilotWidget />
    </div>
  );
};

export default App;