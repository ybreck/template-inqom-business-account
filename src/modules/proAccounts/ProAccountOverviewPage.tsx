
import React, { useState, useMemo } from 'react';
import { ProAccountDetails, ProAccountTransaction, ModuleComponentProps } from './types';
import { mockProAccountDetails, mockProAccountTransactions } from './data';
import { CreditCardIcon, DocumentTextIcon } from '../../../src/constants/icons'; 
import { Search, ChevronLeft, ChevronRight, ChevronDown, ArrowUpDown, Download, Copy, Plus } from 'lucide-react';
import TransactionDetailsPanel from './TransactionDetailsPanel';
import NewTransferModal from './NewTransferModal';

const formatCurrency = (amount: number, currency: string = 'EUR') => {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency });
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

type SortConfig = {
  key: keyof ProAccountTransaction | 'thirdParty';
  direction: 'asc' | 'desc';
} | null;

const ProAccountOverviewPage: React.FC<ModuleComponentProps> = ({ onSubNavigate }) => {
  const accountDetails: ProAccountDetails = mockProAccountDetails;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Toutes les transactions');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);

  const [selectedTransaction, setSelectedTransaction] = useState<ProAccountTransaction | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Filter and Search
  const filteredTransactions = useMemo(() => {
    return mockProAccountTransactions.filter(tx => {
      const searchMatch = 
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.beneficiaryName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.thirdPartyName || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      let typeMatch = true;
      if (filterType === 'Passées') {
        typeMatch = new Date(tx.date) < new Date();
      } else if (filterType === 'À venir') {
        typeMatch = new Date(tx.date) >= new Date();
      } else if (filterType === 'Sortantes') {
        typeMatch = tx.amount < 0;
      } else if (filterType === 'Entrantes') {
        typeMatch = tx.amount > 0;
      }

      return searchMatch && typeMatch;
    });
  }, [searchTerm, filterType]);

  // Sort
  const sortedTransactions = useMemo(() => {
    let sortableItems = [...filteredTransactions];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof ProAccountTransaction];
        let bValue: any = b[sortConfig.key as keyof ProAccountTransaction];

        if (sortConfig.key === 'thirdParty') {
           aValue = a.amount < 0 ? a.beneficiaryName || a.thirdPartyName : 'Yann Breck';
           bValue = b.amount < 0 ? b.beneficiaryName || b.thirdPartyName : 'Yann Breck';
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredTransactions, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: keyof ProAccountTransaction | 'thirdParty') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (status: string, date: string) => {
    const isFuture = new Date(date) > new Date();
    if (isFuture || status === 'En attente') {
      return <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-md">À venir</span>;
    }
    if (status === 'Effectué' || status === 'Payée') {
      return <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-md">Payée</span>;
    }
    return <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-md">{status}</span>;
  };

  const getTransactionIcon = (amount: number) => {
    if (amount < 0) {
      return (
        <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-500 shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 transform rotate-180">
          <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
        </svg>
      </div>
    );
  };

  return (
    <div className="flex items-start">
      <div className="flex-1 min-w-0 space-y-6">
        {/* Top Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-theme-primary-50 rounded-2xl flex items-center justify-center shrink-0">
            <CreditCardIcon className="w-8 h-8 text-theme-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{accountDetails.accountName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-slate-500 font-mono">{accountDetails.iban}</p>
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <button className="flex items-center gap-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                <Download className="w-4 h-4" />
                Relevés de compte
              </button>
              <button className="flex items-center gap-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                <DocumentTextIcon className="w-4 h-4" />
                Télécharger le RIB
              </button>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-500 mb-1">Solde actuel</p>
          <p className="text-4xl font-bold text-theme-primary-700">
            {formatCurrency(accountDetails.balance, accountDetails.currency)}
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex flex-1 gap-4 w-full">
          <div className="relative w-64">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full flex items-center justify-between bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              {filterType}
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
            {isFilterOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1">
                {['Toutes les transactions', 'Passées', 'À venir', 'Sortantes', 'Entrantes'].map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      setFilterType(option);
                      setIsFilterOpen(false);
                      setCurrentPage(1);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une transaction"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none"
            />
          </div>
        </div>
        <button 
          onClick={() => setIsTransferModalOpen(true)}
          className="flex items-center gap-2 bg-theme-primary-600 hover:bg-theme-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Effectuer un virement
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium cursor-pointer hover:text-slate-700" onClick={() => handleSort('description')}>
                  <div className="flex items-center gap-1">Nom de la transaction <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:text-slate-700" onClick={() => handleSort('thirdParty')}>
                  <div className="flex items-center gap-1">Bénéficiaire <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:text-slate-700" onClick={() => handleSort('thirdParty')}>
                  <div className="flex items-center gap-1">Émetteur <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:text-slate-700" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-1">Statut <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:text-slate-700" onClick={() => handleSort('type')}>
                  <div className="flex items-center gap-1">Méthode de paiement <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 font-medium cursor-pointer hover:text-slate-700" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 font-medium text-right cursor-pointer hover:text-slate-700" onClick={() => handleSort('amount')}>
                  <div className="flex items-center justify-end gap-1">Montant <ArrowUpDown className="w-3 h-3" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((tx) => {
                  const isDebit = tx.amount < 0;
                  const beneficiary = isDebit ? (tx.beneficiaryName || tx.thirdPartyName || 'Inconnu') : 'Yann Breck';
                  const emitter = isDebit ? 'Yann Breck' : (tx.thirdPartyName || 'Inconnu');
                  
                  return (
                    <tr 
                      key={tx.id} 
                      className="hover:bg-slate-50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedTransaction(tx)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {getTransactionIcon(tx.amount)}
                          <span className="font-medium text-slate-900">{tx.description}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{beneficiary}</td>
                      <td className="px-4 py-3 text-slate-600">{emitter}</td>
                      <td className="px-4 py-3">{getStatusBadge(tx.status, tx.date)}</td>
                      <td className="px-4 py-3 text-slate-600">{tx.type}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(tx.date)}</td>
                      <td className={`px-4 py-3 text-right font-medium ${isDebit ? 'text-red-600' : 'text-green-600'}`}>
                        {isDebit ? '' : '+'}{formatCurrency(tx.amount, accountDetails.currency)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Aucune transaction trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>
              {Math.min((currentPage - 1) * itemsPerPage + 1, sortedTransactions.length)} - {Math.min(currentPage * itemsPerPage, sortedTransactions.length)} sur {sortedTransactions.length}
            </span>
            <div className="flex items-center gap-2">
              <span>Nbr. par page</span>
              <select 
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-slate-300 rounded-md py-1 px-2 outline-none focus:ring-2 focus:ring-theme-primary-500"
              >
                <option value={10}>10</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 2 + i;
                if (pageNum > totalPages) pageNum = totalPages - (4 - i);
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-md text-sm font-medium flex items-center justify-center ${
                    currentPage === pageNum 
                      ? 'bg-theme-primary-600 text-white' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="px-1 text-slate-400">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-8 h-8 rounded-md text-sm font-medium flex items-center justify-center text-slate-600 hover:bg-slate-100"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      </div>

      <TransactionDetailsPanel 
        transaction={selectedTransaction} 
        onClose={() => setSelectedTransaction(null)} 
        isTransfer={false}
      />

      <NewTransferModal 
        isOpen={isTransferModalOpen} 
        onClose={() => setIsTransferModalOpen(false)} 
      />
    </div>
  );
};

export default ProAccountOverviewPage;