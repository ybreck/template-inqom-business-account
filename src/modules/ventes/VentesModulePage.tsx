

import React from 'react';
import { ModuleComponentProps, NavItem, Client, Product, DirectDebitBatch } from '../../../types';
import PlaceholderPage from '../../../components/PlaceholderPage';
import ClientInvoiceListPage from '../clientInvoices/ClientInvoiceListPage';
import NewInvoiceEditorPage from '../clientInvoices/NewInvoiceEditorPage';
import InvoiceDetailPage from '../clientInvoices/InvoiceDetailPage';
import QuoteListPage from './QuoteListPage';
import NewQuoteEditorPage from './NewQuoteEditorPage';
import QuoteDetailPage from './QuoteDetailPage';
import SubscriptionListPage from './SubscriptionListPage';
import SubscriptionDetailPage from './SubscriptionDetailPage'; 
import ClientListPage from './ClientListPage'; 
import ClientDetailPage from './ClientDetailPage';
import NewSubscriptionEditorPage from './NewSubscriptionEditorPage';
import ProductListPage from './ProductListPage';
import ProductDetailPage from './ProductDetailPage';
import DirectDebitListPage from './DirectDebitListPage';
import DirectDebitEditorPage from './DirectDebitEditorPage';
import DirectDebitDetailPage from './DirectDebitDetailPage';
import VentesParametresPage from './VentesParametresPage';
import { mockClients } from './data/clients';
import { mockProducts } from './data/products';
import { mockDirectDebits } from './data/directDebits';


import { 
  ventesFacturationConfig,
  ventesNouvelleFactureConfig,
  ventesPrelevementsConfig,
  ventesParametresConfig,
} from './config';
import { QuestionMarkCircleIcon, UserGroupIcon, CalendarDaysIcon, TagIcon, ArrowPathIcon, DocumentTextIcon } from '../../constants/icons';

const VentesModulePage: React.FC<ModuleComponentProps> = ({ onSubNavigate, activeSubPageId, onMainNavigate }) => {
  
  if (activeSubPageId === 'ventes_parametres') {
    return <VentesParametresPage onSubNavigate={onSubNavigate} />;
  }

  const moduleTabs: NavItem[] = [
    { id: 'ventes_facturation', name: 'Factures', icon: <DocumentTextIcon className="w-5 h-5" /> },
    { id: 'ventes_clients', name: 'Clients', icon: <UserGroupIcon className="w-5 h-5" /> },
    { id: 'ventes_prelevements', name: 'Prélèvements', icon: <ArrowPathIcon className="w-5 h-5" /> },
  ];
  
  const isCreatingInvoice = activeSubPageId?.startsWith(ventesNouvelleFactureConfig.id);
  const isCreatingCreditNote = activeSubPageId?.includes('type=credit_note');
  const isClientDetail = activeSubPageId?.startsWith('client_detail?id=');
  const isDirectDebitEditor = activeSubPageId?.startsWith('direct_debit_editor?id=');
  const isDirectDebitDetail = activeSubPageId?.startsWith('direct_debit_detail?id=');


  if (isCreatingInvoice) {
    const newDocTab: NavItem = {
      id: activeSubPageId || '',
      name: isCreatingCreditNote ? '↳ Nouvel Avoir' : `↳ ${ventesNouvelleFactureConfig.title}`,
      icon: ventesNouvelleFactureConfig.icon ? React.createElement(ventesNouvelleFactureConfig.icon as React.FC<React.SVGProps<SVGSVGElement>>, {className: "w-5 h-5"}) : <QuestionMarkCircleIcon className="w-5 h-5" />
    };
    const parentTabIndex = moduleTabs.findIndex(tab => tab.id === 'ventes_facturation');
    if (parentTabIndex !== -1) {
      moduleTabs.splice(parentTabIndex + 1, 0, newDocTab);
    } else {
      moduleTabs.push(newDocTab);
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
    const parentTabIndex = moduleTabs.findIndex(tab => tab.id === 'ventes_clients');
    if (parentTabIndex !== -1) {
      moduleTabs.splice(parentTabIndex + 1, 0, clientDetailTab);
    } else {
      moduleTabs.push(clientDetailTab);
    }
  } else if (isDirectDebitEditor || isDirectDebitDetail) {
    const id = activeSubPageId.split('?id=')[1].split('&')[0];
    const isNew = id === 'new';
    const batch = !isNew ? mockDirectDebits.find((d: DirectDebitBatch) => d.id === id) : null;
    const tabName = isNew ? 'Nouveau Prélèvement' : (batch ? batch.name : 'Prélèvement');
    const finalTabName = isDirectDebitDetail ? `↳ ${tabName}` : `↳ ${isNew ? 'Nouveau' : 'Éditer'}: ${batch ? batch.name : ''}`;


    const directDebitTab: NavItem = {
      id: activeSubPageId,
      name: finalTabName,
      icon: React.createElement(ArrowPathIcon, {className: "w-5 h-5"})
    };
    const parentTabIndex = moduleTabs.findIndex(tab => tab.id === 'ventes_prelevements');
    if (parentTabIndex !== -1) {
      moduleTabs.splice(parentTabIndex + 1, 0, directDebitTab);
    } else {
      moduleTabs.push(directDebitTab);
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
    if (activeSubPageId && activeSubPageId.startsWith('direct_debit_detail?id=')) {
        return <DirectDebitDetailPage {...propsForSubPages} />;
    }
    if (activeSubPageId && activeSubPageId.startsWith('direct_debit_editor?id=')) {
        return <DirectDebitEditorPage {...propsForSubPages} />;
    }
    if (activeSubPageId === ventesParametresConfig.id) {
        return <VentesParametresPage {...propsForSubPages} />;
    }

    switch (activeSubPageId) {
      case 'ventes_facturation':
        return <ClientInvoiceListPage {...propsForSubPages} context="ventes" />;
      case 'ventes_prelevements':
        return <DirectDebitListPage {...propsForSubPages} />;
      case 'ventes_clients':
        return <ClientListPage {...propsForSubPages} />;
      default:
        // Fallback to the first tab if activeSubPageId is not recognized
        return <ClientInvoiceListPage {...propsForSubPages} context="ventes" />;
    }
  };
  
  let tabIdToHighlight = activeSubPageId;
  if (activeSubPageId) {
    if (activeSubPageId.startsWith('invoice_detail?id=')) {
        tabIdToHighlight = 'ventes_facturation';
    } else if (activeSubPageId.startsWith('direct_debit_detail?id=')) {
        tabIdToHighlight = activeSubPageId;
    } else if (activeSubPageId.startsWith('direct_debit_editor?id=')) {
        tabIdToHighlight = activeSubPageId;
    } else if (!moduleTabs.some(tab => tab.id === activeSubPageId)) {
      // Fallback for detail pages without dynamic tabs, highlight parent
      if (activeSubPageId.startsWith('client_detail')) tabIdToHighlight = 'ventes_clients';
      else tabIdToHighlight = 'ventes_facturation';
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
      </div>
      <div className="flex-1 pt-0 p-6">
        {renderActiveTabContent()}
      </div>
    </div>
  );
};

export default VentesModulePage;