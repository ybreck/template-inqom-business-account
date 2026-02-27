

import React, { useState, useEffect } from 'react'; // Added useEffect
import Sidebar from '../components/Sidebar'; 
import Header from '../components/Header';   
import PlaceholderPage from '../components/PlaceholderPage'; 
import PDPActivationModal from './modules/pdpActivation/PDPActivationModal';

import { PageConfig as AppSpecificPageConfig, NavItem, ModuleComponentProps } from './types'; 

// Import module configurations
import { accueilConfig as rootAccueilConfig, dashboardConfig } from './modules/dashboard/config'; // Renamed to avoid conflict
import { clientInvoiceListConfig, newInvoiceEditorConfig } from './modules/clientInvoices/config';
import { financingTableConfig } from './modules/financingTable/config';
import { conversationsConfig } from './modules/conversations/config';
import { proAccountCardsConfig } from './modules/proAccounts/config'; 
import { bankPageConfig } from './modules/bank/config'; 
import { accueilConfig as appAccueilConfig } from './modules/accueil/config'; // Specific accueil config for this app


import {
  HomeIcon, ChartBarIcon, DocumentTextIcon, ChatBubbleLeftRightIcon, LockClosedIcon,
  FolderPlusIcon, DocumentDuplicateIcon, ClipboardDocumentListIcon,
  KeyIcon, SquaresPlusIcon, CogIcon, QuestionMarkCircleIcon, BuildingLibraryIcon,
  BanknotesIcon, CalendarDaysIcon, TagIcon, UserGroupIcon, PlusCircleIcon, 
  ShoppingCartIcon, ArchiveBoxIcon, ReceiptPercentIcon, ClipboardDocumentCheckIcon,
  CreditCardIcon, TableCellsIcon, ArrowsRightLeftIcon, PresentationChartLineIcon,
  ChartPieIcon, CheckCircleIcon, AdjustmentsHorizontalIcon, ArrowPathIcon
} from '../constants/icons'; 

// Copied from root App.tsx for theme switching in src/App.tsx
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
  '--color-theme-secondary-gray-50': '#F9FAFB', // Example, adjust as needed
  '--color-theme-secondary-gray-100': '#F3F4F6',
  '--color-theme-secondary-gray-200': '#E5E7EB',
  '--color-theme-secondary-gray-300': '#D1D5DB',
  '--color-theme-secondary-gray-400': '#9CA3AF',
  '--color-theme-secondary-gray-500': '#6B7280',
  '--color-theme-secondary-gray-600': '#4B5563',
  '--color-theme-secondary-gray-700': '#374151',
};

const CABINET_THEME_CSS_VARS = {
  '--color-primary-50': '#E0F5FF',
  '--color-primary-100': '#B3E5FC',
  '--color-primary-200': '#81D4FA',
  '--color-primary-300': '#4FC3F7',
  '--color-primary-400': '#29B6F6',
  '--color-primary-500': '#00A2E1', // Cogep Blue 500 (Primary)
  '--color-primary-600': '#0091EA', // Cogep Blue 600
  '--color-primary-700': '#0082D0',
  '--color-primary-800': '#0073B7',
  '--color-primary-900': '#00649D',
  '--color-text': '#333333',
  '--color-primary-contrast-text': '#FFFFFF',
  '--color-theme-secondary-gray-50': '#F9FAFB', // Assuming same secondary grays
  '--color-theme-secondary-gray-100': '#F3F4F6',
  '--color-theme-secondary-gray-200': '#E5E7EB',
  '--color-theme-secondary-gray-300': '#D1D5DB',
  '--color-theme-secondary-gray-400': '#9CA3AF',
  '--color-theme-secondary-gray-500': '#6B7280',
  '--color-theme-secondary-gray-600': '#4B5563',
  '--color-theme-secondary-gray-700': '#374151',
};

const INQOM_CHART_COLORS = {
  primary: '#2F30E0',
  secondary: '#54595F', 
};

const CABINET_CHART_COLORS = {
  primary: '#00A2E1',
  secondary: '#54595F',
};


const sidebarNavigationStructure: NavItem[] = [
  { id: 'accueil', name: 'Accueil', icon: <HomeIcon /> },
  { id: 'dashboard', name: 'Tableau de bord', icon: <ChartBarIcon /> },
  {
    id: 'ventes', name: 'Ventes', icon: <BanknotesIcon />, isDropdown: true,
    children: [
      { id: 'ventes_facturation', name: 'Facturation', icon: <DocumentTextIcon /> },
      { id: 'create_invoice', name: 'Nouvelle Facture', icon: <PlusCircleIcon /> },
      { id: 'abonnements', name: 'Abonnements', icon: <CalendarDaysIcon /> },
      { id: 'produits', name: 'Produits', icon: <TagIcon /> },
      { id: 'clients', name: 'Clients', icon: <UserGroupIcon /> },
    ]
  },
  { 
    id: 'achats', name: 'Achats', icon: <ShoppingCartIcon />, isDropdown: true,
    children: [
      { id: 'factures_fournisseurs', name: 'Factures fournisseurs', icon: <ClipboardDocumentListIcon /> },
      { id: 'gestion_achats', name: 'Gestion des achats', icon: <ArchiveBoxIcon /> },
      { id: 'notes_frais', name: 'Notes de frais', icon: <ReceiptPercentIcon /> },
      { id: 'demandes_achat', name: 'Demandes d\'achat', icon: <ClipboardDocumentCheckIcon /> },
    ] 
  },
  { 
    id: 'gestion_documentaire', name: 'Gestion Documentaire', icon: <FolderPlusIcon />, isDropdown: true,
    children: [
      { id: 'collectes', name: 'Collectes', icon: <FolderPlusIcon /> },
      { id: 'classer_docs', name: 'Classer mes documents', icon: <DocumentDuplicateIcon />, badge: 16 },
      { id: 'coffre_fort', name: 'Coffre-fort', icon: <LockClosedIcon /> },
    ]
  },
  {
    id: 'comptes_pro', name: 'Comptes Pro', icon: <CreditCardIcon />, isDropdown: true,
    children: [ 
      { id: 'comptes_pro_synthese', name: 'Synthèse', icon: <PresentationChartLineIcon /> },
      { id: 'comptes_pro_operations', name: 'Opérations', icon: <ClipboardDocumentListIcon /> },
      { id: 'comptes_pro_virements', name: 'Virements', icon: <ArrowsRightLeftIcon /> },
      { id: 'comptes_pro_prelevements', name: 'Prélèvements', icon: <ArrowPathIcon /> },
      { id: 'comptes_pro_cartes', name: 'Cartes', icon: <CreditCardIcon /> }, // Changed from cartes_bancaires
      { id: 'comptes_pro_beneficiaires_liste', name: 'Bénéficiaires', icon: <UserGroupIcon /> },
    ]
  },
  {
    id: 'tresorerie', name: 'Trésorerie', icon: <BuildingLibraryIcon />, isDropdown: true,
    children: [
      { id: 'banque', name: 'Banque', icon: <BuildingLibraryIcon /> },
      { id: 'tableau_financement', name: 'Tableau de financement', icon: <TableCellsIcon /> },
      { id: 'encaissement_decaissement', name: 'Encaissement / Décaissement', icon: <ArrowsRightLeftIcon /> },
      { id: 'previsions_tresorerie', name: 'Prévisions', icon: <PresentationChartLineIcon /> },
    ]
  },
  {
    id: 'analytique', name: 'Analytique', icon: <ChartPieIcon />, isDropdown: true,
    children: [
      { id: 'reel', name: 'Réel', icon: <CheckCircleIcon /> },
      { id: 'previsionnel_analytique', name: 'Prévisionnel', icon: <PresentationChartLineIcon /> },
      { id: 'comparatif_mensuel', name: 'Comparatif mensuel', icon: <AdjustmentsHorizontalIcon /> },
    ]
  },
  { id: 'conversations', name: 'Conversations', icon: <ChatBubbleLeftRightIcon /> }, // Changed from Messagerie
  { id: 'parametres', name: 'Paramètres entreprise', icon: <CogIcon /> },
  { id: 'assistance', name: 'Besoin d’assistance ?', icon: <QuestionMarkCircleIcon /> },
];


const pageConfigs: Record<string, AppSpecificPageConfig> = {
  'accueil': appAccueilConfig, // Use specific accueilConfig for src/App
  'dashboard': dashboardConfig,
  'ventes_facturation': clientInvoiceListConfig,
  'create_invoice': newInvoiceEditorConfig,
  'tableau_financement': financingTableConfig,
  'conversations': conversationsConfig,
  'comptes_pro_cartes': proAccountCardsConfig, 
  'banque': bankPageConfig, 
  
  'abonnements': {
    title: 'Abonnements',
    icon: CalendarDaysIcon,
    description: "Gérez vos abonnements clients et les facturations récurrentes."
  },
  'produits': {
    title: 'Produits',
    icon: TagIcon,
    description: "Consultez et gérez votre catalogue de produits et services."
  },
  'clients': {
    title: 'Clients',
    icon: UserGroupIcon,
    description: "Gérez votre base de données clients et leurs informations."
  },
  'factures_fournisseurs': {
    title: 'Factures fournisseurs',
    icon: ClipboardDocumentListIcon,
    description: "Suivez, gérez et réglez vos factures fournisseurs."
  },
  'gestion_achats': {
    title: 'Gestion des achats',
    icon: ArchiveBoxIcon,
    description: "Gérez vos processus d'achats, des commandes aux réceptions."
  },
  'notes_frais': {
    title: 'Notes de frais',
    icon: ReceiptPercentIcon,
    description: "Soumettez, validez et gérez les notes de frais de vos collaborateurs."
  },
  'demandes_achat': {
    title: 'Demandes d\'achat',
    icon: ClipboardDocumentCheckIcon,
    description: "Créez, suivez et approuvez les demandes d'achat internes."
  },
  'collectes': {
    title: 'Collectes',
    icon: FolderPlusIcon,
    description: "Gérez la collecte automatisée ou manuelle de vos documents (ex: factures d'achat)."
  },
  'classer_docs': {
    title: 'Classer mes documents',
    icon: DocumentDuplicateIcon,
    description: "Organisez, classez et archivez vos documents numériques de manière structurée."
  },
  'coffre_fort': {
    title: 'Coffre-fort',
    icon: LockClosedIcon,
    description: "Stockez vos documents les plus sensibles dans un espace numérique sécurisé."
  },
  'encaissement_decaissement': {
    title: 'Encaissement / Décaissement',
    icon: ArrowsRightLeftIcon,
    description: "Suivez en détail vos flux de trésorerie entrants (encaissements) et sortants (décaissements)."
  },
  'previsions_tresorerie': {
    title: 'Prévisions de Trésorerie',
    icon: PresentationChartLineIcon,
    description: "Établissez, ajustez et suivez vos prévisions de trésorerie à court et moyen terme."
  },
  'reel': {
    title: 'Réel (Analytique)',
    icon: CheckCircleIcon,
    description: "Consultez vos données analytiques réelles et mesurez vos performances passées."
  },
  'previsionnel_analytique': {
    title: 'Prévisionnel (Analytique)',
    icon: PresentationChartLineIcon,
    description: "Définissez et suivez vos budgets et prévisions analytiques par centre de coût/profit."
  },
  'comparatif_mensuel': {
    title: 'Comparatif mensuel',
    icon: AdjustmentsHorizontalIcon,
    description: "Comparez vos performances (réel vs prévisionnel) sur une base mensuelle."
  },
  'parametres': {
    title: 'Paramètres entreprise',
    icon: CogIcon,
    description: "Configurez les informations de votre entreprise, les utilisateurs, les préférences et les intégrations."
  },
  'assistance': {
    title: 'Besoin d’assistance ?',
    icon: QuestionMarkCircleIcon,
    description: "Accédez à notre centre d'aide, FAQ, ou contactez notre support client."
  }
};


const App: React.FC = () => {
  const [showPdpModal, setShowPdpModal] = useState(true);
  const [activePageId, setActivePageId] = useState<string>('dashboard');
  const [activeBrand, setActiveBrand] = useState<'inqom' | 'cabinet'>('inqom'); // Added brand state
  const [isDafViewEnabled, setIsDafViewEnabled] = useState(false);

  // Added useEffect for theme switching
  useEffect(() => {
    const root = document.documentElement;
    const newThemeVars = activeBrand === 'cabinet' ? CABINET_THEME_CSS_VARS : INQOM_THEME_CSS_VARS;
    for (const [key, value] of Object.entries(newThemeVars)) {
      root.style.setProperty(key, value);
    }
    // Optionally set document title based on brand for src/App.tsx as well
    document.title = activeBrand === 'cabinet' ? 'Votre Cabinet (src)' : 'Inqom Gestion (src)';
  }, [activeBrand]);


  const handleClosePdpModal = () => {
    setShowPdpModal(false);
  };

  const handleNavigate = (pageId: string) => {
    if (pageId.startsWith('http')) {
      window.open(pageId, '_blank');
    } else {
      setActivePageId(pageId);
    }
  };
  
  const currentChartColors = activeBrand === 'cabinet' ? CABINET_CHART_COLORS : INQOM_CHART_COLORS;

  const renderActivePage = () => {
    const config = pageConfigs[activePageId];

    if (config) {
      if (config.component) {
        const PageComponent = config.component;
        const componentProps: ModuleComponentProps = {
          onMainNavigate: handleNavigate, 
          onSubNavigate: handleNavigate,  
          activeSubPageId: activePageId,
          activeBrand: activeBrand, // Pass activeBrand
          themeColors: currentChartColors, // Pass chart colors
          isDafViewEnabled: isDafViewEnabled,
          onToggleDafView: () => setIsDafViewEnabled(prev => !prev),
        };
        return <PageComponent {...componentProps} />;
      } else {
        const IconComponent = config.icon;
        return (
          <PlaceholderPage
            title={config.title}
            description={config.description}
            icon={IconComponent ? <IconComponent /> : undefined}
          />
        );
      }
    }
    return (
      <PlaceholderPage
        title="Page non trouvée"
        description={`Le contenu pour l'identifiant de page "${activePageId}" n'est pas disponible.`}
        icon={<QuestionMarkCircleIcon />}
      />
    );
  };

  return (
    <div className="flex h-screen max-w-screen-2xl mx-auto my-0 shadow-2xl">
      <Sidebar 
        activePageId={activePageId} 
        onNavigate={handleNavigate} 
        navItems={sidebarNavigationStructure} 
        activeBrand={activeBrand} // Pass activeBrand
        setActiveBrand={setActiveBrand} // Pass setActiveBrand
        isDafViewEnabled={isDafViewEnabled}
      />
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <Header activeBrand={activeBrand} /> {/* Pass activeBrand */}
        <main className="flex-1 p-6">
          {renderActivePage()}
        </main>
      </div>
      <PDPActivationModal 
        isOpen={showPdpModal} 
        onClose={handleClosePdpModal} 
        activeBrand={activeBrand} // Pass activeBrand
      />
    </div>
  );
};

export default App;