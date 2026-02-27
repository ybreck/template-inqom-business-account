import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { ModuleComponentProps, Subscription, SubscriptionStatus } from '../../../types';
import { mockSubscriptions } from './data/subscriptions';
import { 
    MagnifyingGlassIcon, 
    FilterIcon,
    PlusIcon,
    ChevronDownIcon,
    ArrowPathIcon
} from '../../constants/icons';

// Props for the page
interface SubscriptionListPageProps extends ModuleComponentProps {}

// Helper to format date
const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const dateObj = new Date(dateString.replace(/-/g, '/')); // more robust parsing
  return dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Helper to format currency
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
};

// Helper for status badge styles
const getStatusBadgeStyle = (status: SubscriptionStatus): { className: string; label: string } => {
  switch (status) {
    case 'Actif': return { className: 'bg-green-100 text-green-800', label: 'Actif' };
    case 'En pause': return { className: 'bg-yellow-100 text-yellow-800', label: 'En pause' };
    case 'Résilié': return { className: 'bg-gray-200 text-gray-700', label: 'Résilié' };
    default: return { className: 'bg-gray-100 text-gray-700', label: 'Inconnu' };
  }
};

// Main component
const SubscriptionListPage: React.FC<SubscriptionListPageProps> = ({ onSubNavigate }) => {
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [visibleFilters, setVisibleFilters] = useState<string[]>(['status']);
  const [filterValues, setFilterValues] = useState({
    statuses: [] as SubscriptionStatus[],
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
  });
  const [openFilterPopover, setOpenFilterPopover] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

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

  const uniqueStatuses = useMemo(() => Array.from(new Set(mockSubscriptions.map(sub => sub.status))), []);

  const handleStatusFilterChange = (status: SubscriptionStatus) => {
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
    date: 'Date de création',
    amount: 'Montant (HT)',
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

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => {
      const { statuses, startDate, endDate, minAmount, maxAmount } = filterValues;
      const searchTermLower = searchTerm.toLowerCase();

      const matchesSearch = searchTermLower === '' || sub.name.toLowerCase().includes(searchTermLower);
      const matchesStatus = statuses.length === 0 || statuses.includes(sub.status);
      
      const creationDate = new Date(sub.creationDate.replace(/-/g, '/'));
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if(start) start.setHours(0,0,0,0);
      if(end) end.setHours(23,59,59,999);
      
      const matchesDate = (!start || creationDate >= start) && (!end || creationDate <= end);

      const min = parseFloat(minAmount);
      const max = parseFloat(maxAmount);
      const matchesMinAmount = !minAmount || isNaN(min) || sub.amountHT >= min;
      const matchesMaxAmount = !maxAmount || isNaN(max) || sub.amountHT <= max;

      return matchesSearch && matchesStatus && matchesDate && matchesMinAmount && matchesMaxAmount;
    });
  }, [subscriptions, searchTerm, filterValues]);

  const handleViewSubscriptionDetail = (subscriptionId: string) => {
    if (onSubNavigate) {
      onSubNavigate(`subscription_detail?id=${subscriptionId}`);
    }
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
                    <input
                        type="checkbox"
                        checked={filterValues.statuses.includes(status)}
                        onChange={() => handleStatusFilterChange(status)}
                        className="h-4 w-4 text-theme-primary-600 border-gray-300 rounded focus:ring-theme-primary-500"
                    />
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


  // Action button renderer
  const getActionButtons = (subscription: Subscription) => {
    switch (subscription.status) {
      case 'Actif':
        return (
          <>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50">Mettre en pause</button>
            <button className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md">Résilier</button>
          </>
        );
      case 'En pause':
        return (
          <>
            <button className="px-3 py-1.5 text-sm font-medium text-white bg-green-500 rounded-md border border-green-600 hover:bg-green-600">Activer</button>
            <button className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md">Résilier</button>
          </>
        );
      case 'Résilié':
        return (
          <>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50">Reprendre</button>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50">Arrêter</button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-theme-text">Abonnements</h2>
        <button
          onClick={() => onSubNavigate?.('create_subscription')}
          className="px-4 py-2 text-sm font-semibold text-[color:var(--color-primary-contrast-text)] bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 transition-colors"
        >
          Nouvel abonnement
        </button>
      </div>
      
      {/* Search and Filter bar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2">
            <div className="relative flex-grow">
                <input
                    type="text"
                    placeholder="Rechercher par nom d'abonnement..."
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
                                            <div ref={popoverRef} className="absolute top-full mt-2 z-20 bg-white rounded-md shadow-lg border border-gray-200 p-4 w-64">
                                                {renderFilterPopoverContent(filterKey)}
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            if (filterKey === 'date') {
                                return (
                                    <div key={filterKey} className="flex items-center gap-2 p-1 border border-gray-300 rounded-md bg-white">
                                        <label htmlFor="start-date" className="text-sm font-medium text-gray-500 pl-2">Création du</label>
                                        <input type="date" id="start-date" value={filterValues.startDate} onChange={e => setFilterValues(prev => ({...prev, startDate: e.target.value}))} className="text-sm border-0 rounded-md bg-gray-50 focus:ring-1 focus:ring-theme-primary-500 p-1"/>
                                        <span className="text-gray-400">au</span>
                                        <input type="date" id="end-date" value={filterValues.endDate} onChange={e => setFilterValues(prev => ({...prev, endDate: e.target.value}))} className="text-sm border-0 rounded-md bg-gray-50 focus:ring-1 focus:ring-theme-primary-500 p-1"/>
                                    </div>
                                )
                            }
                            if (filterKey === 'amount') {
                                return (
                                    <div key={filterKey} className="flex items-center gap-2 p-1 border border-gray-300 rounded-md bg-white">
                                        <label htmlFor="min-amount" className="text-sm font-medium text-gray-500 pl-2">Montant HT</label>
                                        <input type="number" id="min-amount" placeholder="Min" value={filterValues.minAmount} onChange={e => setFilterValues(prev => ({...prev, minAmount: e.target.value}))} className="w-24 text-sm border-0 rounded-md bg-gray-50 focus:ring-1 focus:ring-theme-primary-500 p-1" />
                                        <span className="text-gray-400">-</span>
                                        <input type="number" id="max-amount" placeholder="Max" value={filterValues.maxAmount} onChange={e => setFilterValues(prev => ({...prev, maxAmount: e.target.value}))} className="w-24 text-sm border-0 rounded-md bg-gray-50 focus:ring-1 focus:ring-theme-primary-500 p-1" />
                                    </div>
                                )
                            }
                            return null;
                        })}
                        
                        {Object.keys(allFilters).length > visibleFilters.filter(f => f !== 'status').length && (
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

      {/* Subscription List */}
      <div className="space-y-3">
        {filteredSubscriptions.map((sub) => {
          const statusStyle = getStatusBadgeStyle(sub.status);
          return (
              <div
                key={sub.id}
                onClick={() => handleViewSubscriptionDetail(sub.id)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-theme-secondary-gray-200 cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && handleViewSubscriptionDetail(sub.id)}
              >
                <div className="p-4 grid grid-cols-12 gap-4 items-center">
                  {/* Subscription Info */}
                  <div className="col-span-6">
                    <h3 className="text-base font-semibold text-theme-text">{sub.name}</h3>
                    <div className="flex items-center space-x-3 mt-1.5 text-xs text-gray-500">
                      <span className={`px-2.5 py-1 font-medium rounded-full ${statusStyle.className}`}>{statusStyle.label}</span>
                      <span className="bg-gray-100 px-2.5 py-1 rounded-md">Création: <strong className="font-semibold text-gray-700">{formatDate(sub.creationDate)}</strong></span>
                      <span className="bg-gray-100 px-2.5 py-1 rounded-md">Nbr. de factures: <strong className="font-semibold text-gray-700">{sub.invoiceCount.toLocaleString('fr-FR')}</strong></span>
                    </div>
                  </div>

                  {/* Amounts */}
                  <div className="col-span-3 flex justify-end space-x-8 text-right">
                    <div>
                      <p className="text-xs text-gray-500">Montant HT</p>
                      <p className="text-lg font-bold text-theme-text">{formatCurrency(sub.amountHT)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Montant TTC</p>
                      <p className="text-lg font-bold text-theme-text">{formatCurrency(sub.amountTTC)}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-3 flex justify-end space-x-2">
                    {getActionButtons(sub)}
                  </div>
                </div>
              </div>
          );
        })}
         {filteredSubscriptions.length === 0 && (
            <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
            Aucun abonnement ne correspond à vos critères de recherche.
            </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionListPage;