import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { mockBankAccounts, mockBankTransactions } from './data';
import BankKPICard from './components/BankKPICard';
import BankTransactionCard from './components/BankTransactionCard';
import { AdjustmentsVerticalIcon, ListBulletIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from './icons'; 
import { 
    ChevronDownIcon, 
    CalendarDaysIcon, 
    PlusIcon, 
    EnvelopeIcon, 
    CurrencyEuroIcon, 
    BuildingLibraryIcon,
    MagnifyingGlassIcon,
    FilterIcon,
    ArrowPathIcon
} from '../../constants/icons'; 
import { ModuleComponentProps, BankKPIData, BankGraphDataPoint, BankTransaction, BankTransactionStatus } from './types'; 
import BankManagementPage from './components/BankManagementPage';
import BankAccountDetailPage from './components/BankAccountDetailPage';

const formatCurrency = (value: number) => {
    return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
};


const BankPage: React.FC<ModuleComponentProps> = ({ onSubNavigate, activeSubPageId, themeColors }) => {
  const isDetailView = activeSubPageId?.startsWith('bank_detail?id=');
  const initialTab = isDetailView ? 'management' : 'transactions';
  const [activeTab, setActiveTab] = useState<'transactions' | 'management'>(initialTab);
  
  // State for transactions page
  const [showGraphs, setShowGraphs] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('all');
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleFilters, setVisibleFilters] = useState<string[]>(['status']);
  const [filterValues, setFilterValues] = useState<{
    statuses: BankTransactionStatus[];
    startDate: string;
    endDate: string;
    minAmount: string;
    maxAmount: string;
  }>({
    statuses: [],
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
  });
  const [openFilterPopover, setOpenFilterPopover] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeSubPageId?.startsWith('bank_detail?id=')) {
      setActiveTab('management');
    }
  }, [activeSubPageId]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpenFilterPopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTabClick = (tab: 'transactions' | 'management') => {
    setActiveTab(tab);
    if (onSubNavigate) {
      onSubNavigate('banque');
    }
  };
  
  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccountId(e.target.value);
  };

  const uniqueStatuses = useMemo(() => Array.from(new Set(mockBankTransactions.map(tx => tx.status))).filter((s): s is BankTransactionStatus => s !== null && s !== ''), []);

  const handleStatusFilterChange = (status: BankTransactionStatus) => {
    setFilterValues(prev => {
        const newStatuses = new Set(prev.statuses);
        if (newStatuses.has(status)) {
            newStatuses.delete(status);
        } else {
            newStatuses.add(status);
        }
        return { ...prev, statuses: Array.from(newStatuses) };
    });
  };

  const resetFilters = () => {
    // Keep selectedAccountId as is, reset only other filters
    setVisibleFilters(['status']);
    setFilterValues({
      statuses: [],
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
    });
    setSearchTerm('');
    setOpenFilterPopover(null);
  };
  
  const addFilter = (filterKey: string) => {
    setVisibleFilters(prev => {
        if (prev.includes(filterKey)) return prev;
        return [...prev, filterKey];
    });
    setOpenFilterPopover(null);
  };

  const allFilters: Record<string, string> = {
    date: "Date de transaction",
    amount: 'Montant',
  };

  const getFilterButtonText = useCallback((filterKey: string) => {
    const { statuses } = filterValues;
    switch (filterKey) {
      case 'status':
        if (statuses.length === 0) return 'Statut';
        if (statuses.length === 1) return `Statut: ${statuses[0]}`;
        return `Statuts: ${statuses.length} sélectionnés`;
      default:
        return 'Filtre';
    }
  }, [filterValues]);

  const isFilterActive = (filterKey: string): boolean => {
    const { statuses, startDate, endDate, minAmount, maxAmount } = filterValues;
    switch (filterKey) {
      case 'status': return statuses.length > 0;
      case 'date': return !!startDate || !!endDate;
      case 'amount': return !!minAmount || !!maxAmount;
      default: return false;
    }
  };

  const filteredTransactions = useMemo(() => {
    return mockBankTransactions.filter(tx => {
      const { statuses, startDate, endDate, minAmount, maxAmount } = filterValues;
      const searchTermLower = searchTerm.toLowerCase();

      const matchesSearch = searchTermLower === '' ||
        tx.description.toLowerCase().includes(searchTermLower) ||
        tx.amount.toString().includes(searchTermLower) ||
        (tx.analyticalCode && tx.analyticalCode.toLowerCase().includes(searchTermLower)) ||
        (tx.reference && tx.reference.toLowerCase().includes(searchTermLower));
        
      const matchesStatus = statuses.length === 0 || (tx.status && statuses.includes(tx.status));
      const matchesAccount = selectedAccountId === 'all' || tx.accountId === selectedAccountId;
      
      const txDate = new Date(tx.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if(start) start.setHours(0,0,0,0);
      if(end) end.setHours(23,59,59,999);
      const matchesDate = (!start || txDate >= start) && (!end || txDate <= end);
      
      const min = parseFloat(minAmount);
      const max = parseFloat(maxAmount);
      const matchesMinAmount = !minAmount || isNaN(min) || tx.amount >= min;
      const matchesMaxAmount = !maxAmount || isNaN(max) || tx.amount <= max;

      return matchesSearch && matchesStatus && matchesAccount && matchesDate && matchesMinAmount && matchesMaxAmount;
    });
  }, [searchTerm, filterValues, selectedAccountId]);

  const kpis = useMemo((): BankKPIData[] => {
    const income = filteredTransactions
        .filter(tx => tx.amount > 0)
        .reduce((sum, tx) => sum + tx.amount, 0);

    const outcome = filteredTransactions
        .filter(tx => tx.amount < 0)
        .reduce((sum, tx) => sum + tx.amount, 0);

    const accountsToConsider = selectedAccountId === 'all'
        ? mockBankAccounts
        : mockBankAccounts.filter(acc => acc.id === selectedAccountId);
    const balance = accountsToConsider.reduce((sum, acc) => sum + acc.balance, 0);

    const generateRandomGraphData = (baseValue: number): BankGraphDataPoint[] => {
        return Array.from({ length: 30 }, (_, i) => ({
            name: `Day ${i + 1}`,
            value: Math.floor(Math.random() * (baseValue / 10)) + (baseValue * 0.8),
        }));
    };

    return [
      {
        id: 'income',
        title: "Entrées d'argent (filtrées)",
        amount: income,
        icon: React.createElement(ArrowUpCircleIcon, { className: "w-6 h-6 text-green-500" }),
        graphData: generateRandomGraphData(income).map(d => ({ ...d, color: '#34D399' })),
      },
      {
        id: 'outcome',
        title: "Sorties d'argent (filtrées)",
        amount: Math.abs(outcome),
        icon: React.createElement(ArrowDownCircleIcon, { className: "w-6 h-6 text-red-500" }),
        graphData: generateRandomGraphData(Math.abs(outcome)).map(d => ({ ...d, color: '#F87171' })),
      },
      {
        id: 'balance',
        title: "Solde des comptes sélectionnés",
        amount: balance,
        icon: React.createElement(CurrencyEuroIcon, { className: "w-6 h-6 text-theme-primary-500" }), 
        graphData: generateRandomGraphData(balance), 
      },
    ];

  }, [filteredTransactions, selectedAccountId]);

  const groupedTransactions = useMemo(() => {
    return filteredTransactions.reduce((acc: Record<string, BankTransaction[]>, tx) => {
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
  
  const renderFilterPopoverContent = (filterKey: string) => {
    switch (filterKey) {
      case 'status':
        return (
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Filtrer par statut(s)</label>
            <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
            {uniqueStatuses.map(status => (
                <label key={status} className="flex items-center p-1.5 rounded-md hover:bg-gray-100 cursor-pointer">
                    <input type="checkbox" checked={filterValues.statuses.includes(status)} onChange={() => handleStatusFilterChange(status)} className="h-4 w-4 text-theme-primary-600 border-gray-300 rounded focus:ring-theme-primary-500" />
                    <span className="ml-2 text-sm text-gray-700">{status}</span>
                </label>
            ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const totalBalance = useMemo(() => {
    return mockBankAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  }, []);

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-semibold text-theme-text">Banques</h1>
        <div className="border-b border-gray-200 mt-4">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button 
                  onClick={() => handleTabClick('transactions')}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm ${
                    activeTab === 'transactions' 
                    ? 'border-theme-primary-500 text-theme-primary-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  aria-current={activeTab === 'transactions' ? 'page' : undefined}
                >
                    Transactions
                </button>
                <button 
                  onClick={() => handleTabClick('management')}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm ${
                    activeTab === 'management' 
                    ? 'border-theme-primary-500 text-theme-primary-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  aria-current={activeTab === 'management' ? 'page' : undefined}
                >
                    Gestion des banques
                </button>
            </nav>
        </div>
      </div>
      
      {activeTab === 'transactions' && (
         <div className="space-y-6">
            <div>
                <label htmlFor="account-select" className="sr-only">
                    Sélectionner un compte
                </label>
                <select
                    id="account-select"
                    name="account"
                    onChange={handleAccountChange}
                    value={selectedAccountId}
                    className="mt-1 block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-theme-primary-500 focus:border-theme-primary-500 sm:text-sm rounded-md shadow-sm"
                >
                    <option value="all">Tous les comptes</option>
                    {mockBankAccounts.map(account => (
                        <option key={account.id} value={account.id}>
                            {account.accountName} ({account.bankName})
                        </option>
                    ))}
                </select>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-2">
                  <div className="relative flex-grow">
                      <input
                          type="text"
                          placeholder="Rechercher une transaction..."
                          className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-theme-primary-500 focus:border-theme-primary-500"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                   <button
                      onClick={() => setShowFilters(prev => !prev)}
                      className={`p-2 rounded-md border transition-colors ${showFilters ? 'bg-theme-primary-100 border-theme-primary-300 text-theme-primary-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100'}`}
                      aria-label="Afficher les filtres"
                      aria-expanded={showFilters}
                      >
                      <FilterIcon className="w-5 h-5" />
                  </button>
                  <div className="flex items-center pl-2">
                    <span className="text-sm text-gray-600 mr-2">Graphiques</span>
                    <button
                      onClick={() => setShowGraphs(!showGraphs)}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary-500 ${showGraphs ? 'bg-theme-primary-500' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${showGraphs ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
              </div>
              {showFilters && (
                  <div className="pt-4 mt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center gap-2">
                          <div className="flex flex-wrap items-center gap-3">
                              {visibleFilters.map(filterKey => {
                                  if (filterKey === 'status') {
                                      return (
                                          <div key={filterKey} className="relative">
                                              <button
                                                  onClick={() => setOpenFilterPopover(openFilterPopover === filterKey ? null : filterKey)}
                                                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border rounded-md transition-colors ${
                                                      isFilterActive(filterKey)
                                                      ? 'bg-theme-primary-50 border-theme-primary-300 text-theme-primary-700'
                                                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                                  }`}
                                              >
                                                  <span>{getFilterButtonText(filterKey)}</span>
                                                  <ChevronDownIcon className="w-4 h-4" />
                                              </button>
                                              {openFilterPopover === filterKey && (
                                                  <div ref={popoverRef} className="absolute top-full mt-2 z-20 bg-white rounded-md shadow-lg border border-gray-200 p-4 w-72">
                                                      {renderFilterPopoverContent(filterKey)}
                                                  </div>
                                              )}
                                          </div>
                                      );
                                  }
                                  if (filterKey === 'date') {
                                      return (
                                          <div key={filterKey} className="flex items-center gap-2 p-1 border border-gray-300 rounded-md bg-white">
                                              <label htmlFor="start-date" className="text-sm font-medium text-gray-500 pl-2">Date</label>
                                              <input type="date" id="start-date" value={filterValues.startDate} onChange={e => setFilterValues(prev => ({...prev, startDate: e.target.value}))} className="text-sm border-0 rounded-md bg-gray-50 focus:ring-1 focus:ring-theme-primary-500 p-1"/>
                                              <span className="text-gray-400">au</span>
                                              <input type="date" id="end-date" value={filterValues.endDate} onChange={e => setFilterValues(prev => ({...prev, endDate: e.target.value}))} className="text-sm border-0 rounded-md bg-gray-50 focus:ring-1 focus:ring-theme-primary-500 p-1"/>
                                          </div>
                                      )
                                  }
                                  if (filterKey === 'amount') {
                                      return (
                                          <div key={filterKey} className="flex items-center gap-2 p-1 border border-gray-300 rounded-md bg-white">
                                              <label htmlFor="min-amount" className="text-sm font-medium text-gray-500 pl-2">Montant</label>
                                              <input type="number" id="min-amount" placeholder="Min" value={filterValues.minAmount} onChange={e => setFilterValues(prev => ({...prev, minAmount: e.target.value}))} className="w-24 text-sm border-0 rounded-md bg-gray-50 focus:ring-1 focus:ring-theme-primary-500 p-1" />
                                              <span className="text-gray-400">-</span>
                                              <input type="number" id="max-amount" placeholder="Max" value={filterValues.maxAmount} onChange={e => setFilterValues(prev => ({...prev, maxAmount: e.target.value}))} className="w-24 text-sm border-0 rounded-md bg-gray-50 focus:ring-1 focus:ring-theme-primary-500 p-1" />
                                          </div>
                                      )
                                  }
                                  return null;
                              })}
                              
                              {visibleFilters.length < Object.keys(allFilters).length + 1 && (
                                  <div className="relative">
                                      <button
                                          onClick={() => setOpenFilterPopover(openFilterPopover === 'add' ? null : 'add')}
                                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100"
                                      >
                                          <PlusIcon className="w-4 h-4" />
                                          Ajouter un filtre
                                      </button>
                                      {openFilterPopover === 'add' && (
                                          <div ref={popoverRef} className="absolute top-full mt-2 z-20 bg-white rounded-md shadow-lg border border-gray-200 py-1 w-48">
                                          {Object.entries(allFilters)
                                              .filter(([key]) => !visibleFilters.includes(key))
                                              .map(([key, name]) => (
                                              <button key={key} onClick={() => addFilter(key)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{name}</button>
                                              ))
                                          }
                                          </div>
                                      )}
                                  </div>
                              )}
                          </div>
                          
                          <button onClick={resetFilters} className="flex-shrink-0 flex items-center px-3 py-2 text-xs font-medium text-gray-600 bg-white rounded-md hover:bg-gray-100 border border-gray-300">
                              <ArrowPathIcon className="w-3 h-3 mr-1" />
                              Réinitialiser
                          </button>
                      </div>
                  </div>
              )}
            </div>
            
            {(() => {
                const accountsToDisplay = selectedAccountId === 'all'
                    ? mockBankAccounts
                    : mockBankAccounts.filter(acc => acc.id === selectedAccountId);
                
                return showGraphs ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {kpis.map(kpi => (
                            <BankKPICard key={kpi.id + selectedAccountId} kpi={kpi} themeColors={themeColors} />
                        ))}
                    </div>
                ) : (
                    <div>
                        <h3 className="text-lg font-semibold text-theme-text mb-4 flex items-baseline gap-3">
                            <span>
                                {selectedAccountId === 'all' ? 'Solde des comptes' : `Solde du compte : ${accountsToDisplay[0]?.accountName || ''}`}
                            </span>
                            {selectedAccountId === 'all' && (
                                <span className="text-2xl font-bold text-theme-primary-600">
                                    {formatCurrency(totalBalance)}
                                </span>
                            )}
                        </h3>
                         <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${accountsToDisplay.length === 1 ? 'lg:grid-cols-1 max-w-md' : ''}`}>
                            {accountsToDisplay.map(account => (
                                <div 
                                    key={account.id} 
                                    className="bg-white p-4 rounded-xl shadow-lg flex items-center space-x-4 border-l-4 border-theme-primary-500"
                                >
                                    <account.logo />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 truncate">{account.accountName}</p>
                                        <p className="text-2xl font-semibold text-theme-text">
                                            {account.balance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                        </p>
                                        <p className="text-xs text-gray-500">{account.bankName}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })()}

            {sortedGroupedDates.length > 0 ? (
                <div className="space-y-4">
                {sortedGroupedDates.map(date => (
                    <div key={date}>
                    <h3 className="text-sm font-semibold text-gray-600 bg-slate-100/75 backdrop-blur-sm px-4 py-1.5 rounded-md sticky top-0 z-10">
                        {formatDateHeader(date)}
                    </h3>
                    <div className="mt-2 space-y-2">
                        {groupedTransactions[date].map(transaction => (
                        <BankTransactionCard key={transaction.id} transaction={transaction} />
                        ))}
                    </div>
                    </div>
                ))}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow-md">
                    <p>Aucune transaction ne correspond à vos critères de recherche.</p>
                </div>
            )}
         </div>
      )}
      
      {activeTab === 'management' && (
        <>
            {isDetailView ? (
                <BankAccountDetailPage {...{ onSubNavigate, activeSubPageId, themeColors }} />
            ) : (
                <BankManagementPage {...{ onSubNavigate, activeSubPageId, themeColors }} />
            )}
        </>
      )}
    </div>
  );
};

export default BankPage;