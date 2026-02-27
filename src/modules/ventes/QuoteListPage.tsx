import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Quote, ModuleComponentProps, QuoteStatus } from '../../../types';
import { mockQuotes } from './data/quotes';
import { CheckCircleIcon, ArrowsRightLeftIcon, MagnifyingGlassIcon, FilterIcon, PlusIcon, ChevronDownIcon, ArrowPathIcon } from '../../constants/icons';

interface QuoteListPageProps extends ModuleComponentProps {}

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const parts = dateString.split(/[-/]/);
  let dateObj;
  if (parts.length === 3 && parts[0].length === 4) { 
    dateObj = new Date(dateString.replace(/\//g, '-'));
  } else if (parts.length === 3 && parts[2].length === 4) { 
    dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  } else { 
    dateObj = new Date(dateString);
  }
  return dateObj.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
};

const getQuoteStatusBadgeStyle = (status: QuoteStatus): { className: string; label: string } => {
  switch (status) {
    case 'BROUILLON': return { className: 'bg-gray-100 text-gray-700 border border-gray-300', label: 'Brouillon' };
    case 'ENVOYE': return { className: 'bg-blue-100 text-blue-700 border border-blue-300', label: 'Envoyé' };
    case 'ACCEPTE': return { className: 'bg-green-100 text-green-700 border border-green-300', label: 'Accepté' };
    case 'REFUSE': return { className: 'bg-red-100 text-red-700 border border-red-300', label: 'Refusé' };
    case 'ANNULE': return { className: 'bg-slate-100 text-slate-600 border border-slate-300', label: 'Annulé' };
    default: return { className: 'bg-gray-100 text-gray-700', label: status };
  }
};

const STATUS_PROGRESSION = [
  { key: 'BROUILLON', display: 'Brouillon' },
  { key: 'ENVOYE', display: 'Envoyé' },
  { key: 'ACCEPTE', display: 'Accepté' },
];

const getStatusOrder = (status: QuoteStatus): number => {
  const index = STATUS_PROGRESSION.findIndex(s => s.key === status);
  if (index !== -1) return index;
  if (status === 'REFUSE' || status === 'ANNULE') return 99; // Problem statuses
  return -1; 
};

const StatusProgressionDisplay: React.FC<{ quoteStatus: QuoteStatus }> = ({ quoteStatus }) => {
  let displaySequence: Array<{ label: string; achieved: boolean; current: boolean; isProblem?: boolean }> = [];
  const currentStatusOrder = getStatusOrder(quoteStatus);

  if (quoteStatus === 'ANNULE' || quoteStatus === 'REFUSE') {
    const label = quoteStatus === 'ANNULE' ? 'Annulé' : 'Refusé';
    displaySequence.push({ label: 'Brouillon', achieved: true, current: false });
    displaySequence.push({ label, achieved: true, current: true, isProblem: true });
  } else { 
    displaySequence = STATUS_PROGRESSION.map((step, index) => {
      return { label: step.display, achieved: currentStatusOrder >= index, current: currentStatusOrder === index };
    });
  }

  return (
    <div className="flex flex-wrap items-center text-xs gap-x-1">
      {displaySequence.map((step, index) => (
        <React.Fragment key={index}>
          <span className={`
            ${step.achieved ? 'font-bold' : 'text-gray-400'} 
            ${step.current ? (step.isProblem ? 'bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded' : 'bg-theme-primary-100 text-theme-primary-700 px-1.5 py-0.5 rounded') : ''}
            ${step.achieved && !step.current ? 'text-theme-text' : ''}
          `}>
            {step.label}
          </span>
          {index < displaySequence.length - 1 && (
            <span className={`mx-0.5 ${step.achieved && displaySequence[index+1]?.achieved && !displaySequence[index+1]?.isProblem ? 'text-theme-text' : 'text-gray-400'}`}>&rarr;</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};


const QuoteListPage: React.FC<QuoteListPageProps> = ({ onSubNavigate }) => {
  const [quotes] = useState<Quote[]>(mockQuotes);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleFilters, setVisibleFilters] = useState<string[]>(['status']);
  const [filterValues, setFilterValues] = useState({
    statuses: [] as QuoteStatus[],
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

  const uniqueStatuses = useMemo(() => Array.from(new Set(mockQuotes.map(q => q.status))), []);

  const handleStatusFilterChange = (status: QuoteStatus) => {
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
    date: "Date de création",
    amount: 'Montant',
  };

  const getFilterButtonText = useCallback((filterKey: string) => {
    const { statuses } = filterValues;
    switch (filterKey) {
      case 'status':
        if (statuses.length === 0) return 'Statut';
        if (statuses.length === 1) return `Statut: ${getQuoteStatusBadgeStyle(statuses[0]).label}`;
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

  const filteredQuotes = useMemo(() => {
    return quotes.filter(quote => {
      const { statuses, startDate, endDate, minAmount, maxAmount } = filterValues;
      const searchTermLower = searchTerm.toLowerCase();

      const matchesSearch = searchTermLower === '' ||
        quote.quoteNumber.toLowerCase().includes(searchTermLower) ||
        quote.clientName.toLowerCase().includes(searchTermLower) ||
        formatCurrency(quote.totalAmountTTC).toLowerCase().includes(searchTermLower) ||
        formatDate(quote.issueDate).includes(searchTermLower);

      const matchesStatus = statuses.length === 0 || statuses.includes(quote.status);
      
      const issueDate = new Date(quote.issueDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if(start) start.setHours(0,0,0,0);
      if(end) end.setHours(23,59,59,999);
      
      const matchesDate = (!start || issueDate >= start) && (!end || issueDate <= end);
      
      const min = parseFloat(minAmount);
      const max = parseFloat(maxAmount);
      const matchesMinAmount = !minAmount || isNaN(min) || quote.totalAmountTTC >= min;
      const matchesMaxAmount = !maxAmount || isNaN(max) || quote.totalAmountTTC <= max;

      return matchesSearch && matchesStatus && matchesDate && matchesMinAmount && matchesMaxAmount;
    });
  }, [quotes, searchTerm, filterValues]);

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
                    <span className="ml-2 text-sm text-gray-700">{getQuoteStatusBadgeStyle(status).label}</span>
                </label>
            ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleCreateNewQuote = () => {
    if (onSubNavigate) {
      onSubNavigate('create_quote');
    }
  };

  const handleViewQuoteDetail = (quoteId: string) => {
    if (onSubNavigate) {
      onSubNavigate(`quote_detail?id=${quoteId}`);
    }
  };

  const getQuoteUIDetails = (quote: Quote) => {
    let actionButtons: React.ReactNode = null;

    switch (quote.status) {
        case 'BROUILLON':
            actionButtons = (
                <>
                    <button className="px-3 py-1 text-xs font-medium text-theme-primary-600 hover:bg-theme-primary-50 rounded-md border border-theme-primary-300 transition-colors" onClick={(e) => { e.stopPropagation(); alert(`Envoyer le devis ${quote.quoteNumber}`);}}>Envoyer</button>
                    <button className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md border border-red-300 transition-colors" onClick={(e) => { e.stopPropagation(); alert(`Annuler le devis ${quote.quoteNumber}`);}}>Annuler</button>
                </>
            );
            break;
        case 'ENVOYE':
             actionButtons = (
                <>
                    <button className="px-3 py-1 text-xs font-medium text-green-600 hover:bg-green-50 rounded-md border border-green-300 transition-colors" onClick={(e) => { e.stopPropagation(); alert(`Marquer le devis ${quote.quoteNumber} comme accepté`);}}>Marquer Accepté</button>
                    <button className="px-3 py-1 text-xs font-medium text-orange-600 hover:bg-orange-50 rounded-md border border-orange-300 transition-colors" onClick={(e) => { e.stopPropagation(); alert(`Marquer le devis ${quote.quoteNumber} comme refusé`);}}>Marquer Refusé</button>
                </>
            );
            break;
        case 'ACCEPTE':
             actionButtons = (
                 <button className="px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-md border border-indigo-300 transition-colors flex items-center" onClick={(e) => { e.stopPropagation(); alert(`Transformer le devis ${quote.quoteNumber} en facture`);}}>
                    <ArrowsRightLeftIcon className="w-3 h-3 mr-1" /> Transformer en facture
                 </button>
             );
    }
    return { actionButtons };
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-theme-text">Devis</h2>
        <button
          onClick={handleCreateNewQuote}
          className="px-4 py-2 text-sm font-semibold text-[color:var(--color-primary-contrast-text)] bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 transition-colors"
        >
          Nouveau Devis
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2">
            <div className="relative flex-grow">
                <input
                    type="text"
                    placeholder="Rechercher par N° devis, client, montant..."
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
                                        <label htmlFor="start-date" className="text-sm font-medium text-gray-500 pl-2">Créé du</label>
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

      <div className="space-y-3">
        {filteredQuotes.map((quote) => {
          const { actionButtons } = getQuoteUIDetails(quote);

          return (
            <div
              key={quote.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border cursor-pointer border-theme-secondary-gray-200"
              role="article"
              aria-labelledby={`quote-title-${quote.id}`}
              onClick={() => handleViewQuoteDetail(quote.id)}
            >
              <div className="p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 id={`quote-title-${quote.id}`} className="text-base font-semibold text-theme-text truncate" title={quote.clientName}>
                        {quote.quoteNumber} <span className="text-gray-600 font-normal">- {quote.clientName}</span>
                      </h3>
                    </div>
                    <p className="text-lg font-bold text-theme-text whitespace-nowrap ml-4">
                      {formatCurrency(quote.totalAmountTTC)}
                    </p>
                  </div>

                  <div className="mt-1">
                    <StatusProgressionDisplay quoteStatus={quote.status} />
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                    <span className="bg-theme-primary-50 text-theme-primary-700 border border-theme-primary-200 px-2 py-1 rounded-md">
                      Création: <strong className="font-semibold">{formatDate(quote.issueDate)}</strong>
                    </span>
                    <span className="bg-theme-primary-50 text-theme-primary-700 border border-theme-primary-200 px-2 py-1 rounded-md">
                      Validité: <strong className="font-semibold">{formatDate(quote.expiryDate)}</strong>
                    </span>
                    {quote.status === 'ACCEPTE' && <CheckCircleIcon className="w-4 h-4 text-green-500" title="Devis accepté" />}
                  </div>

                  {actionButtons && (
                    <div className="mt-3 flex justify-end space-x-2">
                      {actionButtons}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

       {filteredQuotes.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          Aucun devis ne correspond à vos critères de recherche.
        </div>
      )}
    </div>
  );
};

export default QuoteListPage;
