
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { SupplierInvoice, ModuleComponentProps, PAStatus } from './types';
import { mockSupplierInvoices } from './data';
import { 
    EyeIcon, 
    PlusCircleIcon,
    MagnifyingGlassIcon,
    FilterIcon,
    PlusIcon,
    ChevronDownIcon,
    ArrowPathIcon
} from '../../constants/icons';
import { getPAStatusBadgeStyle } from '../clientInvoices/utils';

interface SupplierInvoiceListProps extends ModuleComponentProps {}

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) {
    return 'Date Invalide';
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

const SUPPLIER_STATUS_PROGRESSION_HAPPY_PATH = [
  { key: 'RECU_PA_ACHAT', display: 'Reçue PA' },
  { key: 'APPROUVEE_ACHAT', display: 'Approuvée' },
  { key: 'PAYEE_ACHAT', display: 'Payée' }
];

const getSupplierStatusOrder = (status: PAStatus): number => {
  const index = SUPPLIER_STATUS_PROGRESSION_HAPPY_PATH.findIndex(s => s.key === status);
  if (index !== -1) return index;
  if (status === 'PARTIELLEMENT_PAYEE_ACHAT') return SUPPLIER_STATUS_PROGRESSION_HAPPY_PATH.findIndex(s => s.key === 'PAYEE_ACHAT');
  if (status === 'REJETEE_ACHAT') return SUPPLIER_STATUS_PROGRESSION_HAPPY_PATH.findIndex(s => s.key === 'APPROUVEE_ACHAT');
  if (status === 'ANNULEE_ACHAT') return 0;
  if (status === 'BROUILLON') return -1;
  return -1; 
};

const SupplierStatusProgressionDisplay: React.FC<{ invoiceStatus: PAStatus }> = ({ invoiceStatus }) => {
  let displaySequence: Array<{ label: string; achieved: boolean; current: boolean; isProblem?: boolean }> = [];
  const currentStatusOrder = getSupplierStatusOrder(invoiceStatus);
  const problemStatuses: PAStatus[] = ['REJETEE_ACHAT', 'ANNULEE_ACHAT'];
  
  if (problemStatuses.includes(invoiceStatus)) {
    let baseOrder = 0;
    if (invoiceStatus === 'REJETEE_ACHAT') {
        baseOrder = SUPPLIER_STATUS_PROGRESSION_HAPPY_PATH.findIndex(s => s.key === 'RECU_PA_ACHAT');
    }
    displaySequence = SUPPLIER_STATUS_PROGRESSION_HAPPY_PATH.slice(0, baseOrder + 1).map((step, idx) => ({
        label: step.display, achieved: true, current: false,
    }));
    const statusBadge = getPAStatusBadgeStyle(invoiceStatus);
    displaySequence.push({ label: statusBadge.label, achieved: true, current: true, isProblem: true });
  } else {
    displaySequence = SUPPLIER_STATUS_PROGRESSION_HAPPY_PATH.map((step, index) => {
      let label = step.display;
      let isCurrent = currentStatusOrder === index;
      let achieved = currentStatusOrder >= index;
      if (step.key === 'PAYEE_ACHAT' && invoiceStatus === 'PARTIELLEMENT_PAYEE_ACHAT') {
        label = getPAStatusBadgeStyle('PARTIELLEMENT_PAYEE_ACHAT').label;
        isCurrent = true;
        achieved = true;
      }
      if (invoiceStatus === 'BROUILLON' && index === 0) {
        label = getPAStatusBadgeStyle('BROUILLON').label;
        isCurrent = true;
        achieved = true;
      } else if (invoiceStatus === 'BROUILLON') {
        achieved = false;
        isCurrent = false;
      }
      return { label, achieved, current: isCurrent };
    });
    if (invoiceStatus === 'BROUILLON') {
        displaySequence = [{label: getPAStatusBadgeStyle('BROUILLON').label, achieved: true, current: true, isProblem: false }];
    }
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


const SupplierInvoiceListPage: React.FC<SupplierInvoiceListProps> = ({ onSubNavigate }) => {
  const [invoices] = useState<SupplierInvoice[]>(mockSupplierInvoices);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleFilters, setVisibleFilters] = useState<string[]>(['status']);
  const [filterValues, setFilterValues] = useState({
    statuses: [] as PAStatus[],
    suppliers: [] as string[],
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

  const uniqueSuppliers = useMemo(() => Array.from(new Set(mockSupplierInvoices.map(inv => inv.supplierName))).sort(), []);
  const uniqueStatuses = useMemo(() => Array.from(new Set(mockSupplierInvoices.map(inv => inv.status))), []);

  const handleStatusFilterChange = (status: PAStatus) => {
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

  const handleSupplierFilterChange = (supplierName: string) => {
    setFilterValues(prev => ({
      ...prev,
      suppliers: prev.suppliers.includes(supplierName)
        ? prev.suppliers.filter(s => s !== supplierName)
        : [...prev.suppliers, supplierName]
    }));
  };
  
  const resetFilters = () => {
    setVisibleFilters(['status']);
    setFilterValues({
      statuses: [],
      suppliers: [],
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
    date: "Date d'échéance",
    supplier: 'Fournisseur',
    amount: 'Montant',
  };

  const getFilterButtonText = useCallback((filterKey: string) => {
    const { statuses, suppliers } = filterValues;
    switch (filterKey) {
      case 'status':
        if (statuses.length === 0) return 'Statut';
        if (statuses.length === 1) return `Statut: ${getPAStatusBadgeStyle(statuses[0]).label}`;
        return `Statuts: ${statuses.length} sélectionnés`;
      case 'supplier':
        if (suppliers.length === 0) return 'Fournisseur';
        if (suppliers.length === 1) return `Fournisseur: ${suppliers[0]}`;
        return `Fournisseurs: ${suppliers.length} sélectionnés`;
      default:
        return 'Filtre';
    }
  }, [filterValues]);

  const isFilterActive = (filterKey: string): boolean => {
    const { statuses, suppliers, startDate, endDate, minAmount, maxAmount } = filterValues;
    switch (filterKey) {
      case 'status': return statuses.length > 0;
      case 'supplier': return suppliers.length > 0;
      case 'date': return !!startDate || !!endDate;
      case 'amount': return !!minAmount || !!maxAmount;
      default: return false;
    }
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const { statuses, suppliers, startDate, endDate, minAmount, maxAmount } = filterValues;
      const searchTermLower = searchTerm.toLowerCase();

      const matchesSearch = searchTermLower === '' ||
        invoice.invoiceNumber.toLowerCase().includes(searchTermLower) ||
        invoice.supplierName.toLowerCase().includes(searchTermLower) ||
        formatDate(invoice.issueDate).includes(searchTermLower);

      const matchesStatus = statuses.length === 0 || statuses.includes(invoice.status);
      
      const dueDate = new Date(invoice.dueDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if(start) start.setHours(0,0,0,0);
      if(end) end.setHours(23,59,59,999);
      
      const matchesDate = (!start || dueDate >= start) && (!end || dueDate <= end);
      const matchesSuppliers = suppliers.length === 0 || suppliers.includes(invoice.supplierName);
      const min = parseFloat(minAmount);
      const max = parseFloat(maxAmount);
      const matchesMinAmount = !minAmount || isNaN(min) || invoice.totalAmountTTC >= min;
      const matchesMaxAmount = !maxAmount || isNaN(max) || invoice.totalAmountTTC <= max;

      return matchesSearch && matchesStatus && matchesDate && matchesSuppliers && matchesMinAmount && matchesMaxAmount;
    });
  }, [invoices, searchTerm, filterValues]);

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
                    <span className="ml-2 text-sm text-gray-700">{getPAStatusBadgeStyle(status).label}</span>
                </label>
            ))}
            </div>
          </div>
        );
      case 'supplier':
        return (
            <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">Filtrer par fournisseur(s)</label>
                <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
                {uniqueSuppliers.map(supplier => (
                    <label key={supplier} className="flex items-center p-1.5 rounded-md hover:bg-gray-100 cursor-pointer">
                        <input type="checkbox" checked={filterValues.suppliers.includes(supplier)} onChange={() => handleSupplierFilterChange(supplier)} className="h-4 w-4 text-theme-primary-600 border-gray-300 rounded focus:ring-theme-primary-500" />
                        <span className="ml-2 text-sm text-gray-700">{supplier}</span>
                    </label>
                ))}
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  const handleCreateNewInvoice = () => {
    if (onSubNavigate) {
      alert("La création de facture fournisseur sera bientôt disponible.");
    }
  };

  const handleViewInvoiceDetail = (invoiceId: string) => {
    if (onSubNavigate) {
      onSubNavigate(`supplier_invoice_detail?id=${invoiceId}`);
    }
  };
  
  const getInvoiceActionButtons = (invoice: SupplierInvoice): React.ReactNode => {
    switch (invoice.status) {
        case 'RECU_PA_ACHAT':
            return (
                <button
                    className="px-3 py-1 text-xs font-medium text-green-600 hover:bg-green-50 rounded-md border border-green-300 transition-colors"
                    onClick={(e) => { e.stopPropagation(); alert(`Approuver la facture ${invoice.invoiceNumber} (simulation)`);}}
                >
                    Approuver
                </button>
            );
        case 'APPROUVEE_ACHAT':
            return (
                <button
                    className="px-3 py-1 text-xs font-medium text-theme-primary-600 hover:bg-theme-primary-50 rounded-md border border-theme-primary-300 transition-colors"
                    onClick={(e) => { e.stopPropagation(); alert(`Payer la facture ${invoice.invoiceNumber} (simulation)`);}}
                >
                    Payer
                </button>
            );
        case 'REJETEE_ACHAT':
             return (
                <button
                    className="px-3 py-1 text-xs font-medium text-orange-600 hover:bg-orange-50 rounded-md border border-orange-300 transition-colors"
                    onClick={(e) => { e.stopPropagation(); alert(`Contacter le fournisseur pour la facture ${invoice.invoiceNumber} (simulation)`);}}
                >
                    Contacter Fournisseur
                </button>
            );
        default:
            return null;
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-theme-text">Factures</h2>
        <button
          onClick={handleCreateNewInvoice}
          className="px-4 py-2 text-sm font-semibold text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 transition-colors flex items-center"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Nouvelle Facture Fournisseur
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2">
            <div className="relative flex-grow">
                <input
                    type="text"
                    placeholder="Rechercher par N° facture, fournisseur..."
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
                            if (filterKey === 'status' || filterKey === 'supplier') {
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
                                        <label htmlFor="start-date" className="text-sm font-medium text-gray-500 pl-2">Date d'échéance</label>
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

      <div className="space-y-3">
        {filteredInvoices.map((invoice) => {
          const actionButtons = getInvoiceActionButtons(invoice);

          return (
            <div
              key={invoice.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border cursor-pointer border-theme-secondary-gray-200"
              role="article"
              aria-labelledby={`supplier-invoice-title-${invoice.id}`}
              onClick={() => handleViewInvoiceDetail(invoice.id)}
            >
              <div className="p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 id={`supplier-invoice-title-${invoice.id}`} className="text-base font-semibold text-theme-text truncate" title={invoice.supplierName}>
                        {invoice.invoiceNumber} <span className="text-gray-600 font-normal">- {invoice.supplierName}</span>
                      </h3>
                    </div>
                    <p className="text-lg font-bold text-theme-text whitespace-nowrap ml-4">
                      {formatCurrency(invoice.totalAmountTTC)}
                    </p>
                  </div>

                  <div className="mt-1">
                     <SupplierStatusProgressionDisplay invoiceStatus={invoice.status} />
                  </div>
                  
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                    <span className="bg-theme-primary-50 text-theme-primary-700 border border-theme-primary-200 px-2 py-1 rounded-md">
                      Émise le: <strong className="font-semibold">{formatDate(invoice.issueDate)}</strong>
                    </span>
                    <span className="bg-theme-primary-50 text-theme-primary-700 border border-theme-primary-200 px-2 py-1 rounded-md">
                      Échéance: <strong className="font-semibold">{formatDate(invoice.dueDate)}</strong>
                    </span>
                     {invoice.receptionDate && (
                        <span className="bg-theme-secondary-gray-100 text-theme-secondary-gray-700 border border-theme-secondary-gray-200 px-2 py-1 rounded-md">
                            Reçue le: <strong className="font-semibold">{formatDate(invoice.receptionDate)}</strong>
                        </span>
                    )}
                    {invoice.status === 'PAYEE_ACHAT' && invoice.paymentDate && (
                         <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-md">
                            Payée le: <strong className="font-semibold">{formatDate(invoice.paymentDate)}</strong>
                        </span>
                    )}
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

       {filteredInvoices.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          Aucune facture fournisseur ne correspond à vos critères de recherche.
        </div>
      )}
    </div>
  );
};

export default SupplierInvoiceListPage;
