

import React from 'react';
import { ModuleComponentProps, NavItem, SupplierPaymentBatch } from '../../../types';
import ModuleTabs from '../../../components/ModuleTabs';
import PlaceholderPage from '../../../components/PlaceholderPage';
import SupplierInvoiceListPage from '../supplierInvoices/SupplierInvoiceListPage';
import SupplierInvoiceDetailPage from '../supplierInvoices/SupplierInvoiceDetailPage';
import SupplierListPage from './SupplierListPage';
import SupplierDetailPage from './SupplierDetailPage';
import SupplierPaymentListPage from './SupplierPaymentListPage';
import SupplierPaymentEditorPage from './SupplierPaymentEditorPage';
import SupplierPaymentDetailPage from './SupplierPaymentDetailPage';
import { mockSupplierPayments } from './data/supplierPayments';
import IKListPage from './IKListPage';
import NotesFraisListPage from './NotesFraisListPage';
import { 
  achatsFacturesFournisseursConfig,
  achatsFournisseursConfig,
  achatsPaiementsConfig,
  achatsNotesFraisConfig,
  achatsIKConfig
} from './config';
import { QuestionMarkCircleIcon, ArrowPathIcon } from '../../constants/icons';

const AchatsModulePage: React.FC<ModuleComponentProps> = ({ onSubNavigate, activeSubPageId, onMainNavigate }) => {
  
  const baseTabs = [
    achatsFacturesFournisseursConfig,
    achatsPaiementsConfig,
    achatsFournisseursConfig,
    achatsNotesFraisConfig,
    achatsIKConfig
  ];

  const moduleTabs: NavItem[] = baseTabs.map(config => ({
    id: config.id || '',
    name: config.title,
    icon: config.icon ? React.createElement(config.icon, {className: "w-5 h-5"}) : <QuestionMarkCircleIcon className="w-5 h-5" />
  }));

  const isPaymentEditor = activeSubPageId?.startsWith('supplier_payment_editor?id=');
  const isPaymentDetail = activeSubPageId?.startsWith('supplier_payment_detail?id=');

  if (isPaymentEditor || isPaymentDetail) {
    const id = activeSubPageId.split('?id=')[1].split('&')[0];
    const isNew = id === 'new';
    const batch = !isNew ? mockSupplierPayments.find((p: SupplierPaymentBatch) => p.id === id) : null;
    const tabName = isNew ? 'Nouveau Paiement' : (batch ? batch.name : 'Paiement');
    const finalTabName = isPaymentDetail ? `↳ ${tabName}` : `↳ ${isNew ? 'Nouveau' : 'Éditer'}: ${batch ? batch.name : ''}`;

    const paymentTab: NavItem = {
      id: activeSubPageId,
      name: finalTabName,
      icon: React.createElement(ArrowPathIcon, {className: "w-5 h-5"})
    };
    const parentTabIndex = moduleTabs.findIndex(tab => tab.id === achatsPaiementsConfig.id);
    if (parentTabIndex !== -1) {
      moduleTabs.splice(parentTabIndex + 1, 0, paymentTab);
    } else {
      moduleTabs.push(paymentTab);
    }
  }

  const renderActiveTabContent = () => {
    const propsForSubPages: ModuleComponentProps = { onSubNavigate, onMainNavigate, activeSubPageId };
    
    if (activeSubPageId && activeSubPageId.startsWith('supplier_invoice_detail?id=')) {
      return <SupplierInvoiceDetailPage {...propsForSubPages} />;
    }
    if (activeSubPageId && activeSubPageId.startsWith('supplier_detail?id=')) {
      return <SupplierDetailPage {...propsForSubPages} />;
    }
    if (activeSubPageId && activeSubPageId.startsWith('supplier_payment_detail?id=')) {
      return <SupplierPaymentDetailPage {...propsForSubPages} />;
    }
    if (activeSubPageId && activeSubPageId.startsWith('supplier_payment_editor?id=')) {
      return <SupplierPaymentEditorPage {...propsForSubPages} />;
    }

    switch (activeSubPageId) {
      case achatsFacturesFournisseursConfig.id:
        return <SupplierInvoiceListPage {...propsForSubPages} />;
      case achatsFournisseursConfig.id:
        return <SupplierListPage {...propsForSubPages} />;
      case achatsPaiementsConfig.id:
        return <SupplierPaymentListPage {...propsForSubPages} />;
      case achatsNotesFraisConfig.id:
         return <NotesFraisListPage {...propsForSubPages} />;
      case achatsIKConfig.id:
        return <IKListPage {...propsForSubPages} />;
      default:
        // Fallback to the default tab
        return <SupplierInvoiceListPage {...propsForSubPages} />;
    }
  };
  
  let tabIdToHighlight = activeSubPageId;
  if (activeSubPageId) {
      if (activeSubPageId.startsWith('supplier_invoice_detail?id=')) {
        tabIdToHighlight = achatsFacturesFournisseursConfig.id;
      } else if (activeSubPageId.startsWith('supplier_detail?id=')) {
        tabIdToHighlight = achatsFournisseursConfig.id;
      } else if (activeSubPageId.startsWith('supplier_payment_detail?id=')) {
        tabIdToHighlight = activeSubPageId;
      } else if (activeSubPageId.startsWith('supplier_payment_editor?id=')) {
        tabIdToHighlight = activeSubPageId;
      } else if (!baseTabs.some(c => c.id === activeSubPageId)) {
        tabIdToHighlight = achatsFacturesFournisseursConfig.id;
      }
  }


  return (
    <div className="flex flex-col h-full">
      <ModuleTabs
        tabs={moduleTabs}
        activeTabId={tabIdToHighlight || achatsFacturesFournisseursConfig.id || ''}
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

export default AchatsModulePage;