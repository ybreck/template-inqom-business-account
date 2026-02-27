
import React, { useState, useMemo } from 'react';
import { ProAccountTransaction, ProTransactionStatus, ProTransactionType } from './types';
import { mockProAccountTransactions, mockProAccountDetails } from './data';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, CalendarDaysIcon, ArrowDownTrayIcon } from '../../../src/constants/icons'; 

const formatCurrency = (amount: number, currency: string = 'EUR') => {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency });
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const ProAccountTransactionCard: React.FC<{ transaction: ProAccountTransaction }> = ({ transaction }) => {
  const isCredit = transaction.amount > 0;
  
  let statusBadgeStyle = 'bg-gray-100 text-gray-700';
  if (transaction.status === 'Effectué') statusBadgeStyle = 'bg-green-100 text-green-700';
  else if (transaction.status === 'En attente') statusBadgeStyle = 'bg-yellow-100 text-yellow-700';
  else if (transaction.status === 'Annulé' || transaction.status === 'Rejeté') statusBadgeStyle = 'bg-red-100 text-red-700';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-theme-secondary-gray-200">
      <div className="p-3 flex items-center justify-between">
        <div className="flex-1 min-w-0 mr-4">
          <p className="text-sm font-semibold text-theme-text truncate" title={transaction.description}>
            {transaction.description}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-xs text-gray-500">{transaction.type}</p>
            <span className={`px-2 py-0.5 inline-flex text-xxs leading-4 font-semibold rounded-full ${statusBadgeStyle}`}>
              {transaction.status}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <p className={`text-lg font-bold ${isCredit ? 'text-green-600' : 'text-red-600'} w-32 text-right`}>
            {isCredit ? '+' : ''}{formatCurrency(transaction.amount, mockProAccountDetails.currency)}
          </p>
        </div>
      </div>
    </div>
  );
};


const ProAccountTransactionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ProTransactionType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<ProTransactionStatus | 'all'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredTransactions = mockProAccountTransactions.filter(tx => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = tx.description.toLowerCase().includes(searchTermLower) ||
                          (tx.thirdPartyName && tx.thirdPartyName.toLowerCase().includes(searchTermLower)) ||
                          (tx.reference && tx.reference.toLowerCase().includes(searchTermLower)) ||
                          tx.amount.toString().includes(searchTermLower);
    
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;

    const txDate = new Date(tx.date);
    const matchesStartDate = !startDate || txDate >= new Date(startDate);
    const matchesEndDate = !endDate || txDate <= new Date(endDate);

    return matchesSearch && matchesType && matchesStatus && matchesStartDate && matchesEndDate;
  }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const transactionTypes: ProTransactionType[] = Array.from(new Set(mockProAccountTransactions.map(tx => tx.type)));
  const transactionStatuses: ProTransactionStatus[] = Array.from(new Set(mockProAccountTransactions.map(tx => tx.status)));

  const groupedTransactions = useMemo(() => {
    return filteredTransactions.reduce((acc: Record<string, ProAccountTransaction[]>, tx) => {
      const dateKey = tx.date; // YYYY-MM-DD
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(tx);
      return acc;
    }, {});
  }, [filteredTransactions]);

  const sortedGroupedDates = useMemo(() => Object.keys(groupedTransactions).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()), [groupedTransactions]);

  const formatDateHeader = (dateString: string) => {
    const parts = dateString.split('-').map(Number);
    const date = new Date(parts[0], parts[1] - 1, parts[2]); // Y, M-1, D
    
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    
    if (date.getTime() === today.getTime()) {
      return "Aujourd'hui";
    }
    if (date.getTime() === yesterday.getTime()) {
      return "Hier";
    }
    
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    };

    if (date.getFullYear() !== today.getFullYear()) {
      options.year = 'numeric';
    }
    
    const formattedDate = date.toLocaleDateString('fr-FR', options);
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };


  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Search */}
          <div className="lg:col-span-2">
            <label htmlFor="search-transactions" className="block text-xs font-medium text-gray-700 mb-1">Rechercher</label>
            <div className="relative">
              <input
                type="text"
                id="search-transactions"
                placeholder="Description, tiers, montant..."
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-theme-primary-500 focus:border-theme-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label htmlFor="start-date" className="block text-xs font-medium text-gray-700 mb-1">Date de début</label>
            <div className="relative">
                 <input 
                    type="date" 
                    id="start-date"
                    className="w-full pl-8 pr-2 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-theme-primary-500 focus:border-theme-primary-500"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <CalendarDaysIcon className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div>
            <label htmlFor="end-date" className="block text-xs font-medium text-gray-700 mb-1">Date de fin</label>
             <div className="relative">
                <input 
                    type="date" 
                    id="end-date"
                    className="w-full pl-8 pr-2 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-theme-primary-500 focus:border-theme-primary-500"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <CalendarDaysIcon className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          
           {/* Filters Type & Status */}
          <div>
            <label htmlFor="filter-type" className="block text-xs font-medium text-gray-700 mb-1">Type d'opération</label>
            <select 
                id="filter-type"
                value={filterType} 
                onChange={e => setFilterType(e.target.value as ProTransactionType | 'all')}
                className="w-full py-2 px-3 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-theme-primary-500 focus:border-theme-primary-500"
            >
                <option value="all">Tous les types</option>
                {transactionTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="filter-status" className="block text-xs font-medium text-gray-700 mb-1">Statut</label>
             <select 
                id="filter-status"
                value={filterStatus} 
                onChange={e => setFilterStatus(e.target.value as ProTransactionStatus | 'all')}
                className="w-full py-2 px-3 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-theme-primary-500 focus:border-theme-primary-500"
            >
                <option value="all">Tous les statuts</option>
                {transactionStatuses.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="lg:col-span-2 flex items-end space-x-2">
            <button className="flex-1 sm:flex-initial flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 border border-gray-300">
              <AdjustmentsHorizontalIcon className="w-4 h-4 mr-1.5" />
              Plus de filtres
            </button>
            <button className="flex-1 sm:flex-initial flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600">
              <ArrowDownTrayIcon className="w-4 h-4 mr-1.5" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sortedGroupedDates.length > 0 ? (
          sortedGroupedDates.map(date => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-gray-600 bg-slate-100/75 backdrop-blur-sm px-4 py-1.5 rounded-md sticky top-0 z-10">
                {formatDateHeader(date)}
              </h3>
              <div className="mt-2 space-y-2">
                {groupedTransactions[date].map(transaction => (
                  <ProAccountTransactionCard key={transaction.id} transaction={transaction} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow-md">
            <p>Aucune transaction ne correspond à vos critères.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProAccountTransactionsPage;
