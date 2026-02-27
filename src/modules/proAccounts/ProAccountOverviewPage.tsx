
import React from 'react';
import { ProAccountDetails, ProAccountTransaction, ModuleComponentProps } from './types';
import { mockProAccountDetails, mockProAccountTransactions } from './data';
import { CreditCardIcon, ArrowsRightLeftIcon, DocumentTextIcon, UserGroupIcon } from '../../../src/constants/icons'; 
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '../dashboard/icons'; 

const formatCurrency = (amount: number, currency: string = 'EUR') => {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency });
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const ProAccountTransactionRow: React.FC<{ transaction: ProAccountTransaction }> = ({ transaction }) => {
  const isCredit = transaction.amount > 0;
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-theme-text truncate w-48 sm:w-auto" title={transaction.description}>{transaction.description}</p>
        <p className="text-xs text-gray-500">{formatDate(transaction.date)} - {transaction.type}</p>
      </div>
      <div className={`text-sm font-semibold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
        {isCredit ? '+' : ''}{formatCurrency(transaction.amount, mockProAccountDetails.currency)}
      </div>
    </div>
  );
};


const ProAccountOverviewPage: React.FC<ModuleComponentProps> = ({ onSubNavigate }) => {
  const accountDetails: ProAccountDetails = mockProAccountDetails;
  const recentTransactions = mockProAccountTransactions.slice(0, 5); 

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-xl rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-theme-text">{accountDetails.accountName}</h2>
            <p className="text-sm text-gray-500">IBAN: {accountDetails.iban}</p>
          </div>
          <div className="mt-4 md:mt-0 text-left md:text-right">
            <p className="text-xs text-gray-500 uppercase">Solde Actuel</p>
            <p className="text-3xl lg:text-4xl font-bold text-theme-primary-600">
              {formatCurrency(accountDetails.balance, accountDetails.currency)}
            </p>
            {accountDetails.overdraftLimit && (
              <p className="text-xs text-gray-500">
                Dont découvert autorisé: {formatCurrency(accountDetails.overdraftLimit, accountDetails.currency)}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button 
            onClick={() => onSubNavigate?.('comptes_pro_virements_nouveau')}
            className="flex items-center justify-center space-x-2 bg-theme-primary-500 hover:bg-theme-primary-600 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-colors duration-150"
            aria-label="Effectuer un nouveau virement"
            >
            <ArrowsRightLeftIcon className="w-5 h-5" />
            <span>Nouveau Virement</span>
          </button>
           <button 
            onClick={() => onSubNavigate?.('comptes_pro_beneficiaires_liste')}
            className="flex items-center justify-center space-x-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-colors duration-150"
            aria-label="Gérer mes bénéficiaires"
            >
            <UserGroupIcon className="w-5 h-5" />
            <span>Gérer Bénéficiaires</span>
          </button>
          <button 
            onClick={() => onSubNavigate?.('comptes_pro_cartes')}
            className="flex items-center justify-center space-x-2 bg-theme-secondary-gray-600 hover:bg-theme-secondary-gray-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-colors duration-150"
            aria-label="Gérer mes cartes"
            >
            <CreditCardIcon className="w-5 h-5" />
            <span>Gérer mes Cartes</span>
          </button>
           <button 
            onClick={() => alert("Fonctionnalité 'Éditer un RIB' à implémenter.")}
            className="flex items-center justify-center space-x-2 bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-colors duration-150" //Kept sm:col-span-2 lg:col-span-1 if specific layout needed
            aria-label="Éditer un RIB"
            >
            <DocumentTextIcon className="w-5 h-5" />
            <span>Éditer un RIB</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow-xl rounded-xl p-6">
        <h3 className="text-lg font-semibold text-theme-text mb-4">Opérations Récentes</h3>
        {recentTransactions.length > 0 ? (
          <div className="space-y-1">
            {recentTransactions.map(tx => (
              <ProAccountTransactionRow key={tx.id} transaction={tx} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Aucune opération récente.</p>
        )}
        {mockProAccountTransactions.length > recentTransactions.length && (
           <div className="mt-6 text-center">
            <button 
                onClick={() => onSubNavigate?.('comptes_pro_operations')}
                className="text-sm font-medium text-theme-primary-600 hover:text-theme-primary-700 hover:underline"
            >
                Voir toutes les opérations &rarr;
            </button>
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-xl rounded-xl p-6">
            <h3 className="text-lg font-semibold text-theme-text mb-2">Entrées du mois</h3>
            <p className="text-3xl font-bold text-green-600 flex items-center">
                <ArrowTrendingUpIcon className="w-7 h-7 mr-2"/>
                {formatCurrency(3560.50, accountDetails.currency)} 
            </p>
            <p className="text-sm text-gray-500 mt-1">+15% par rapport au mois dernier</p>
        </div>
        <div className="bg-white shadow-xl rounded-xl p-6">
            <h3 className="text-lg font-semibold text-theme-text mb-2">Sorties du mois</h3>
            <p className="text-3xl font-bold text-red-600 flex items-center">
                <ArrowTrendingDownIcon className="w-7 h-7 mr-2"/>
                {formatCurrency(2120.90, accountDetails.currency)}
            </p>
            <p className="text-sm text-gray-500 mt-1">-5% par rapport au mois dernier</p>
        </div>
      </div>

    </div>
  );
};

export default ProAccountOverviewPage;