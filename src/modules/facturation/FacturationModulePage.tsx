
import React from 'react';
import { ModuleComponentProps, NavItem, Client, Product, Quote, Subscription } from '../../../types';
import PlaceholderPage from '../../../components/PlaceholderPage';
import ClientInvoiceListPage from '../clientInvoices/ClientInvoiceListPage';
import NewInvoiceEditorPage from '../clientInvoices/NewInvoiceEditorPage';
import InvoiceDetailPage from '../clientInvoices/InvoiceDetailPage';
import QuoteListPage from '../ventes/QuoteListPage';
import NewQuoteEditorPage from '../ventes/NewQuoteEditorPage';
import QuoteDetailPage from '../ventes/QuoteDetailPage';
import SubscriptionListPage from '../ventes/SubscriptionListPage';
import SubscriptionDetailPage from '../ventes/SubscriptionDetailPage';
import ClientListPage from '../ventes/ClientListPage';
import ClientDetailPage from '../ventes/ClientDetailPage';
import NewSubscriptionEditorPage from '../ventes/NewSubscriptionEditorPage';
import ProductListPage from '../ventes/ProductListPage';
import ProductDetailPage from '../ventes/ProductDetailPage';
import { mockClients } from '../ventes/data/clients';
import { mockProducts } from '../ventes/data/products';


import { 
  ventesNouvelleFactureConfig,
  ventesAbonnementsConfig,
  ventesNouvelAbonnementConfig,
  ventesNouveauDevisConfig
} from '../ventes/config';
import { QuestionMarkCircleIcon, UserGroupIcon, CalendarDaysIcon, TagIcon, CogIcon, DocumentTextIcon, ClipboardDocumentListIcon } from '../../constants/icons';

const FacturationModulePage: React.FC<ModuleComponentProps> = ({ onSubNavigate, activeSubPageId, onMainNavigate }) => {
  
  const moduleTabs: NavItem[] = [
    { id: 'facturation_factures', name: 'Factures', icon: <DocumentTextIcon className="w-5 h-5" /> },
    { id: 'facturation_devis', name: 'Devis', icon: <ClipboardDocumentListIcon className="w-5 h-5" /> },
    { id: 'facturation_clients', name: 'Clients', icon: <UserGroupIcon className="w-5 h-5" /> },
    { id: 'facturation_abonnements', name: 'Abonnements', icon: <CalendarDaysIcon className="w-5 h-5" /> },
    { id: 'facturation_produits', name: 'Produits', icon: <TagIcon className="w-5 h-5" /> },
  ];
  
  const isCreatingInvoice = activeSubPageId?.startsWith(ventesNouvelleFactureConfig.id);
  const isCreatingCreditNote = activeSubPageId?.includes('type=credit_note');
  const isClientDetail = activeSubPageId?.startsWith('client_detail?id=');
  const isProductDetail = activeSubPageId?.startsWith('product_detail?id=');
  const isCreatingSubscription = activeSubPageId === ventesNouvelAbonnementConfig.id;


  if (isCreatingInvoice) {
    const newDocTab: NavItem = {
      id: activeSubPageId || '',
      name: isCreatingCreditNote ? '↳ Nouvel Avoir' : `↳ ${ventesNouvelleFactureConfig.title}`,
      icon: ventesNouvelleFactureConfig.icon ? React.createElement(ventesNouvelleFactureConfig.icon as React.FC<React.SVGProps<SVGSVGElement>>, {className: "w-5 h-5"}) : <QuestionMarkCircleIcon className="w-5 h-5" />
    };
    const parentTabIndex = moduleTabs.findIndex(tab => tab.id === 'facturation_factures');
    if (parentTabIndex !== -1) {
      moduleTabs.splice(parentTabIndex + 1, 0, newDocTab);
    } else {
      moduleTabs.push(newDocTab);
    }
  } else if (activeSubPageId === ventesNouveauDevisConfig.id) {
    const newQuoteTab: NavItem = {
      id: ventesNouveauDevisConfig.id || '',
      name: `↳ ${ventesNouveauDevisConfig.title}`,
      icon: ventesNouveauDevisConfig.icon ? React.createElement(ventesNouveauDevisConfig.icon as React.FC<React.SVGProps<SVGSVGElement>>, {className: "w-5 h-5"}) : <QuestionMarkCircleIcon className="w-5 h-5" />
    };
    const parentTabIndex = moduleTabs.findIndex(tab => tab.id === 'facturation_devis');
    if (parentTabIndex !== -1) {
      moduleTabs.splice(parentTabIndex + 1, 0, newQuoteTab);
    } else {
      moduleTabs.push(newQuoteTab);
    }
  } else if (isCreatingSubscription) {
    const newSubTab: NavItem = {
      id: ventesNouvelAbonnementConfig.id,
      name: `↳ ${ventesNouvelAbonnementConfig.title}`,
      icon: React.createElement(CalendarDaysIcon, {className: "w-5 h-5"})
    };
    const parentTabIndex = moduleTabs.findIndex(tab => tab.id === 'facturation_abonnements');
    if (parentTabIndex !== -1) {
      moduleTabs.splice(parentTabIndex + 1, 0, newSubTab);
    } else {
      moduleTabs.push(newSubTab);
    }
  } else if (isClientDetail) {
    const clientId = activeSubPageId.split('?id=')[1];
    let clientName = 'Nouveau Client';
    if(clientId !== 'new') {
        const client = mockClients.find((c: Client) => c.id === clientId);
        if (client) {
            clientName = client.name;
        } else {
            clientName = 'Client introuvable';
        }
    }
    
    const clientDetailTab: NavItem = {
      id: activeSubPageId,
      name: `↳ ${clientName}`,
      icon: React.createElement(UserGroupIcon, {className: "w-5 h-5"})
    };
    const parentTabIndex = moduleTabs.findIndex(tab => tab.id === 'facturation_clients');
    if (parentTabIndex !== -1) {
      moduleTabs.splice(parentTabIndex + 1, 0, clientDetailTab);
    } else {
      moduleTabs.push(clientDetailTab);
    }
  } else if (isProductDetail) {
    const productId = activeSubPageId.split('?id=')[1];
    let productName = 'Nouveau Produit';
    if(productId !== 'new') {
        const product = mockProducts.find((p: Product) => p.id === productId);
        productName = product ? product.name : 'Produit introuvable';
    }
    
    const productDetailTab: NavItem = {
      id: activeSubPageId,
      name: `↳ ${productName}`,
      icon: React.createElement(TagIcon, {className: "w-5 h-5"})
    };
    const parentTabIndex = moduleTabs.findIndex(tab => tab.id === 'facturation_produits');
    if (parentTabIndex !== -1) {
      moduleTabs.splice(parentTabIndex + 1, 0, productDetailTab);
    } else {
      moduleTabs.push(productDetailTab);
    }
  }


  const renderActiveTabContent = () => {
    const propsForSubPages: ModuleComponentProps = { onSubNavigate, onMainNavigate, activeSubPageId };
    
    if (activeSubPageId && activeSubPageId.startsWith('invoice_detail?id=')) {
      return <InvoiceDetailPage {...propsForSubPages} />;
    }
     if (activeSubPageId && activeSubPageId.startsWith('quote_detail?id=')) {
      return <QuoteDetailPage {...propsForSubPages} />;
    }
     if (activeSubPageId && activeSubPageId.startsWith('subscription_detail?id=')) {
      return <SubscriptionDetailPage {...propsForSubPages} />;
    }
     if (activeSubPageId && activeSubPageId.startsWith('client_detail?id=')) {
      return <ClientDetailPage {...propsForSubPages} />;
    }
    if (activeSubPageId && activeSubPageId.startsWith('product_detail?id=')) {
      return <ProductDetailPage {...propsForSubPages} />;
    }
    if (activeSubPageId && activeSubPageId.startsWith(ventesNouvelleFactureConfig.id)) {
      return <NewInvoiceEditorPage {...propsForSubPages} />;
    }
    if (activeSubPageId === ventesNouvelAbonnementConfig.id) {
        return <NewSubscriptionEditorPage {...propsForSubPages} />;
    }

    switch (activeSubPageId) {
      case 'facturation_factures':
        return <ClientInvoiceListPage {...propsForSubPages} context="facturation" />;
      case 'facturation_devis':
        return <QuoteListPage {...propsForSubPages} />;
      case ventesNouveauDevisConfig.id:
        return <NewQuoteEditorPage {...propsForSubPages} />;
      case 'facturation_abonnements':
        return <SubscriptionListPage {...propsForSubPages} />;
      case 'facturation_produits':
        return <ProductListPage {...propsForSubPages} />;
      case 'facturation_clients':
        return <ClientListPage {...propsForSubPages} />;
      default:
        // Fallback to the first tab if activeSubPageId is not recognized
        return <ClientInvoiceListPage {...propsForSubPages} context="facturation" />;
    }
  };
  
  let tabIdToHighlight = activeSubPageId;
  if (activeSubPageId) {
    if (activeSubPageId.startsWith('invoice_detail?id=')) {
        tabIdToHighlight = 'facturation_factures';
    } else if (activeSubPageId.startsWith('quote_detail?id=')) {
        tabIdToHighlight = 'facturation_devis';
    } else if (activeSubPageId.startsWith('subscription_detail?id=')) {
        tabIdToHighlight = 'facturation_abonnements';
    } else if (!moduleTabs.some(tab => tab.id === activeSubPageId)) {
      // Fallback for detail pages without dynamic tabs, highlight parent
      if (activeSubPageId.startsWith('client_detail')) tabIdToHighlight = 'facturation_clients';
      else if (activeSubPageId.startsWith('product_detail')) tabIdToHighlight = 'facturation_produits';
      else tabIdToHighlight = 'facturation_factures';
    }
  }


  return (
    <div className="flex flex-col h-full">
      <div className="px-6 bg-slate-50 border-b border-gray-200 flex justify-between items-center">
        <nav className="flex space-x-1 -mb-px" aria-label="Tabs">
          {moduleTabs.map((tab) => {
            const isActive = tab.id === tabIdToHighlight;
            return (
              <button
                key={tab.id}
                onClick={() => onSubNavigate?.(tab.id)}
                className={`
                  whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm
                  focus:outline-none transition-colors duration-150
                  ${
                    isActive
                      ? 'border-theme-primary-500 text-theme-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.name}
              </button>
            );
          })}
        </nav>
        <button
            onClick={() => onSubNavigate?.('ventes_parametres')}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-theme-primary-500"
            title="Paramètres de vente"
            aria-label="Paramètres de vente"
        >
            <CogIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-1 pt-0 p-6">
        {renderActiveTabContent()}
      </div>
    </div>
  );
};

export default FacturationModulePage;
