import React from 'react';
import { ModuleComponentProps, NotificationItem } from '../../../types';
import { mockNotifications } from '../../data/notifications';
import {
  CogIcon,
  BellIcon,
  DocumentArrowUpIcon,
  BanknotesIcon,
  ArrowUpIcon,
  EyeIcon, 
  UserCircleIcon, 
  DocumentMagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftEllipsisIcon,
  BuildingLibraryIcon,
  CreditCardIcon
} from '../../constants/icons'; 


const ActionIcon: React.FC<{ type: NotificationItem['type'] }> = ({ type }) => {
  switch (type) {
    case 'invoice_overdue_sales':
      return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
    case 'invoice_received_supplier':
      return <DocumentArrowUpIcon className="w-5 h-5 text-blue-600" />; // Or DocumentArrowDownTrayIcon
    case 'missing_document':
      return <DocumentMagnifyingGlassIcon className="w-5 h-5 text-orange-600" />;
    case 'message':
      return <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-green-600" />;
    default:
      return <BellIcon className="w-5 h-5 text-gray-600" />;
  }
};


const AccueilPage: React.FC<ModuleComponentProps> = ({ onMainNavigate, onSubNavigate }) => {
  
  const pendingNotifications = mockNotifications.filter(n => n.status === 'pending');
  
  const handleTodoItemClick = (item: NotificationItem) => {
    if (onMainNavigate && onSubNavigate) {
       switch(item.type) {
         case 'invoice_overdue_sales':
           onMainNavigate('ventes');
           onSubNavigate(`invoice_detail?id=${item.relatedData.invoiceId}`);
           break;
         case 'invoice_received_supplier':
           onMainNavigate('achats');
           onSubNavigate(`supplier_invoice_detail?id=${item.relatedData.invoiceId}`);
           break;
         case 'missing_document':
         case 'approval_request':
         case 'message':
           onMainNavigate('conversations');
           onSubNavigate(`conversations_actions_a_faire?itemId=${item.id}`);
           break;
         default:
            onMainNavigate('conversations');
            onSubNavigate(`conversations_actions_a_faire?itemId=${item.id}`);
       }
    }
  };

  const parseCurrency = (str: string | number) => parseFloat(String(str).replace(/\s/g, '').replace('€', ''));

  const accounts = [
    { name: 'Compte Courant Principal', balance: 1150000, icon: <BuildingLibraryIcon className="w-5 h-5 text-theme-primary-500" /> },
    { name: 'Livret Pro', balance: 45000, icon: <BanknotesIcon className="w-5 h-5 text-green-500" /> },
    { name: 'Compte Carte Affaires', balance: 5000, icon: <CreditCardIcon className="w-5 h-5 text-sky-500" /> }
  ];
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="space-y-8 p-1"> 
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-theme-text">Accueil</h1>
      </div>

      {/* Welcome Message */}
      <p className="text-lg text-gray-700">
        Bienvenue Yann ! Collaborez efficacement et suivez vos performances.
      </p>

      {/* Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Déposer vos factures d'achat */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-6">
          <div className="flex-shrink-0">
            <DocumentArrowUpIcon className="w-20 h-20 text-theme-primary-500 opacity-75" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-theme-text mb-1">Déposer vos factures d'achat</h2>
            <p className="text-sm text-gray-500 mb-4">Puis retrouvez-les dans l'onglet Achats</p>
            <button className="px-5 py-2.5 text-sm font-medium text-[color:var(--color-primary-contrast-text)] bg-theme-primary-500 rounded-lg hover:bg-theme-primary-600 transition-colors">
              Sélectionner un fichier
            </button>
          </div>
        </div>

        {/* Card 2: Déposez ou créez vos factures de vente */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-6">
          <div className="flex-shrink-0">
             <BanknotesIcon className="w-20 h-20 text-theme-primary-500 opacity-75" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-theme-text mb-1">Déposez ou créez vos factures de vente</h2>
            <p className="text-sm text-gray-500 mb-4">Puis suivez leur paiement dans l'onglet Ventes</p>
            <div className="flex space-x-3">
              <button className="px-5 py-2.5 text-sm font-medium text-[color:var(--color-primary-contrast-text)] bg-theme-primary-500 rounded-lg hover:bg-theme-primary-600 transition-colors">
                Sélectionner un fichier
              </button>
              <button 
                onClick={() => onSubNavigate?.('facturation_create_invoice')}
                className="px-5 py-2.5 text-sm font-medium text-theme-primary-600 bg-theme-primary-100 rounded-lg hover:bg-theme-primary-200 transition-colors">
                Créer une facture
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Actions à faire & Solde des comptes */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Actions à faire */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-theme-text flex items-center">
              Actions à faire
              <span className="ml-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">{pendingNotifications.length}</span>
            </h3>
            <button 
              onClick={() => onSubNavigate?.('conversations_actions_a_faire')}
              className="text-sm text-theme-primary-500 hover:underline">Voir tout</button>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {pendingNotifications.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleTodoItemClick(item)}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && handleTodoItemClick(item)}
              >
                <div className="flex items-center space-x-3 flex-grow min-w-0">
                  <span className="flex-shrink-0 w-8 h-8 bg-white text-theme-primary-600 rounded-full flex items-center justify-center text-sm font-semibold border">
                    <ActionIcon type={item.type} />
                  </span>
                  
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-theme-text truncate">{item.title}</p>
                    <p className="text-xs text-gray-500 truncate">{item.description}</p>
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center space-x-3 ml-3">
                  {item.urgent && <span className="w-2.5 h-2.5 bg-red-500 rounded-full" title="Urgent"></span>}
                </div>
              </div>
            ))}
             {pendingNotifications.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Aucune action requise. Bravo !</p>
            )}
          </div>
        </div>

        {/* Soldes des comptes bancaires */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 flex flex-col h-full">
          <div className="flex-grow">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-theme-text">Soldes des comptes bancaires</h3>
            </div>
            <div className="text-center my-4">
                <p className="text-sm text-gray-500">Solde total</p>
                <p className="text-3xl font-bold text-theme-text">
                    {totalBalance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </p>
            </div>
            
            <div className="space-y-3 border-t pt-4">
              {accounts.map(account => (
                <div key={account.name} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                          {account.icon}
                      </span>
                      <span className="text-sm text-gray-600">{account.name}</span>
                  </div>
                  <span className="text-base font-semibold text-theme-text">
                    {account.balance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-auto pt-6">
            <button 
              onClick={() => onMainNavigate?.('banque')}
              className="w-full px-5 py-2.5 text-sm font-medium text-theme-primary-600 bg-theme-primary-100 rounded-lg hover:bg-theme-primary-200 transition-colors">
              Consulter les opérations
            </button>
          </div>
        </div>
      </div>

      {/* Votre activité */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-theme-text">Votre activité - Juin 2025</h3>
          <button 
            onClick={() => onMainNavigate?.('dashboard')}
            className="text-sm text-theme-primary-500 hover:underline">Voir le tableau de bord</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Entrées d'argent", value: '10 000 €', target: '12000' },
            { title: "Sorties d'argent", value: '2 000 €', target: '1500' },
            { title: 'Total Ventes', value: '42 580 €', target: '25000' },
            { title: 'Total achats', value: '5 000 €', target: '5000' },
          ].map((item, index) => {
            const valueNum = parseCurrency(item.value);
            const targetNum = parseCurrency(item.target);
            const completionPercentage = targetNum > 0 ? (valueNum / targetNum) * 100 : 0;
            const targetFormatted = targetNum.toLocaleString('fr-FR');
            
            return (
                <div key={index} className="bg-slate-50 p-4 rounded-lg flex flex-col">
                  <div className="flex-grow">
                    <p className="text-sm text-gray-600">{item.title}</p>
                    <p className="text-2xl font-semibold text-theme-text mt-1">{item.value}</p>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="text-gray-500">Objectif: {targetFormatted} €</span>
                      <span className="font-semibold text-theme-primary-600">{completionPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-theme-primary-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min(completionPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default AccueilPage;