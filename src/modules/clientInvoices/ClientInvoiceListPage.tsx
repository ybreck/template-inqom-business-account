import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ClientInvoice, ModuleComponentProps, PAStatus } from './types'; 
import { mockClientInvoices } from './data';
import { getPAStatusBadgeStyle } from './utils';
import { 
    EnvelopeIcon, 
    ChevronDownIcon, 
    MagnifyingGlassIcon, 
    ArrowPathIcon,
    PlusIcon,
    FilterIcon,
    ArrowUpTrayIcon,
} from '../../constants/icons';

interface ClientInvoiceListProps extends ModuleComponentProps {
    context?: 'ventes' | 'facturation';
}

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

const STATUS_PROGRESSION_HAPPY_PATH = [
  { key: 'BROUILLON', display: 'Créée' },
  { key: 'APPROUVEE_INTERNE', display: 'Approuvée' },
  { key: 'DEPOSEE_PA', display: 'Déposée PA' },
  { key: 'VALIDEE_PA', display: 'Transmise Client' },
  { key: 'TELECHARGEE_CLIENT', display: 'Reçue Client' },
  { key: 'PAYEE', display: 'Payée' },
  { key: 'ENCAISSEE', display: 'Encaissée' }
];

const getStatusOrder = (status: PAStatus): number => {
  const index = STATUS_PROGRESSION_HAPPY_PATH.findIndex(s => s.key === status);
  if (index !== -1) return index;

  if (status === 'PARTIELLEMENT_PAYEE') return STATUS_PROGRESSION_HAPPY_PATH.findIndex(s => s.key === 'PAYEE');
  if (status === 'ANNULEE') return STATUS_PROGRESSION_HAPPY_PATH.findIndex(s => s.key === 'BROUILLON'); 
  if (status === 'REJETEE_PA') return STATUS_PROGRESSION_HAPPY_PATH.findIndex(s => s.key === 'DEPOSEE_PA'); 
  if (status === 'REFUSEE_CLIENT') return STATUS_PROGRESSION_HAPPY_PATH.findIndex(s => s.key === 'TELECHARGEE_CLIENT'); 
  if (status === 'EN_RETARD') return STATUS_PROGRESSION_HAPPY_PATH.findIndex(s => s.key === 'TELECHARGEE_CLIENT'); 
  
  return -1; 
};


const StatusProgressionDisplay: React.FC<{ invoiceStatus: PAStatus }> = ({ invoiceStatus }) => {
  let displaySequence: Array<{ label: string; achieved: boolean; current: boolean; isProblem?: boolean }> = [];
  const currentStatusOrder = getStatusOrder(invoiceStatus);

  if (invoiceStatus === 'ANNULEE') {
    const baseOrder = STATUS_PROGRESSION_HAPPY_PATH.findIndex(s => s.key === 'APPROUVEE_INTERNE'); 
    displaySequence = STATUS_PROGRESSION_HAPPY_PATH.slice(0, baseOrder).map(step => ({
        label: step.display, achieved: true, current: false,
    }));
    displaySequence.push({ label: 'Annulée', achieved: true, current: true, isProblem: true });

  } else if (invoiceStatus === 'REJETEE_PA') {
    const depositedOrder = STATUS_PROGRESSION_HAPPY_PATH.findIndex(s => s.key === 'DEPOSEE_PA');
    displaySequence = STATUS_PROGRESSION_HAPPY_PATH.slice(0, depositedOrder +1).map(step => ({
        label: step.display, achieved: true, current: false,
    }));
    displaySequence.push({ label: 'Rejetée PA', achieved: true, current: true, isProblem: true });

  } else if (invoiceStatus === 'REFUSEE_CLIENT') {
    const receivedOrder = STATUS_PROGRESSION_HAPPY_PATH.findIndex(s => s.key === 'TELECHARGEE_CLIENT');
    displaySequence = STATUS_PROGRESSION_HAPPY_PATH.slice(0, receivedOrder +1).map(step => ({
        label: step.display, achieved: true, current: false,
    }));
    displaySequence.push({ label: 'Refusée Client', achieved: true, current: true, isProblem: true });
  
  } else if (invoiceStatus === 'EN_RETARD') {
    const receivedOrder = STATUS_PROGRESSION_HAPPY_PATH.findIndex(s => s.key === 'TELECHARGEE_CLIENT');
    displaySequence = STATUS_PROGRESSION_HAPPY_PATH.slice(0, receivedOrder + 1).map((step) => ({
      label: step.display, achieved: true, current: false,
    }));
    displaySequence.push({ label: 'En Retard', achieved: true, current: true, isProblem: true });
    const payeeIndex = STATUS_PROGRESSION_HAPPY_PATH.findIndex(s => s.key === 'PAYEE');
    if (payeeIndex !== -1) {
        displaySequence.push({ label: STATUS_PROGRESSION_HAPPY_PATH[payeeIndex].display, achieved: false, current: false });
    }
  } else { 
    displaySequence = STATUS_PROGRESSION_HAPPY_PATH.map((step, index) => {
      let label = step.display;
      let isCurrent = currentStatusOrder === index;

      if (step.key === 'PAYEE' && invoiceStatus === 'PARTIELLEMENT_PAYEE') {
        label = 'Part. Payée';
        isCurrent = true; 
      }
      
      let achieved = currentStatusOrder >= index;
      if (invoiceStatus === 'PARTIELLEMENT_PAYEE' && step.key === 'PAYEE') achieved = true;


      return { label, achieved, current: isCurrent };
    });
    
     if (invoiceStatus === 'STATUT_CLIENT_INDISPONIBLE') {
        const transmittedOrder = STATUS_PROGRESSION_HAPPY_PATH.findIndex(s => s.key === 'VALIDEE_PA');
        displaySequence = displaySequence.map((item, idx) => ({
            ...item,
            achieved: idx <= transmittedOrder,
            current: idx === transmittedOrder, 
            isProblem: idx === transmittedOrder 
        }));
        const transmittedStep = displaySequence.find(s => s.label === STATUS_PROGRESSION_HAPPY_PATH[transmittedOrder].display);
        if (transmittedStep) transmittedStep.label = 'Transmise (Statut Client Indisp.)';
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


const ClientInvoiceListPage: React.FC<ClientInvoiceListProps> = ({ onSubNavigate, context = 'facturation' }) => {
  const [invoices, setInvoices] = useState<ClientInvoice[]>(mockClientInvoices);
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);
  const actionsDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleFilters, setVisibleFilters] = useState<string[]>(['status']);
  const [filterValues, setFilterValues] = useState({
    statuses: [] as PAStatus[],
    clients: [] as string[],
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
  });
  const [openFilterPopover, setOpenFilterPopover] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsDropdownRef.current && !actionsDropdownRef.current.contains(event.target as Node)) {
        setIsActionsDropdownOpen(false);
      }
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpenFilterPopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const uniqueClients = useMemo(() => Array.from(new Set(mockClientInvoices.map(inv => inv.clientName))).sort(), []);
  const uniqueStatuses = useMemo(() => Array.from(new Set(mockClientInvoices.map(inv => inv.status))), []);

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

  const handleClientFilterChange = (clientName: string) => {
    setFilterValues(prev => ({
      ...prev,
      clients: prev.clients.includes(clientName)
        ? prev.clients.filter(c => c !== clientName)
        : [...prev.clients, clientName]
    }));
  };
  
  const resetFilters = () => {
    setVisibleFilters(['status']);
    setFilterValues({
      statuses: [],
      clients: [],
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
    client: 'Client',
    amount: 'Montant',
  };

  const getFilterButtonText = useCallback((filterKey: string) => {
    const { statuses, clients } = filterValues;
    switch (filterKey) {
      case 'status':
        if (statuses.length === 0) return 'Statut';
        if (statuses.length === 1) return `Statut: ${getPAStatusBadgeStyle(statuses[0]).label}`;
        return `Statuts: ${statuses.length} sélectionnés`;
      case 'client':
        if (clients.length === 0) return 'Client';
        if (clients.length === 1) return `Client: ${clients[0]}`;
        return `Clients: ${clients.length} sélectionnés`;
      default:
        return 'Filtre';
    }
  }, [filterValues]);

  const isFilterActive = (filterKey: string): boolean => {
    const { statuses, clients, startDate, endDate, minAmount, maxAmount } = filterValues;
    switch (filterKey) {
      case 'status': return statuses.length > 0;
      case 'client': return clients.length > 0;
      case 'date': return !!startDate || !!endDate;
      case 'amount': return !!minAmount || !!maxAmount;
      default: return false;
    }
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const { statuses, clients, startDate, endDate, minAmount, maxAmount } = filterValues;
      const searchTermLower = searchTerm.toLowerCase();

      const matchesSearch = searchTermLower === '' ||
        invoice.invoiceNumber.toLowerCase().includes(searchTermLower) ||
        invoice.clientName.toLowerCase().includes(searchTermLower) ||
        formatDate(invoice.issueDate).includes(searchTermLower);

      const matchesStatus = statuses.length === 0 || statuses.includes(invoice.status);
      
      const dueDate = new Date(invoice.dueDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if(start) start.setHours(0,0,0,0);
      if(end) end.setHours(23,59,59,999);
      
      const matchesDate = (!start || dueDate >= start) && (!end || dueDate <= end);
      const matchesClients = clients.length === 0 || clients.includes(invoice.clientName);
      const min = parseFloat(minAmount);
      const max = parseFloat(maxAmount);
      const matchesMinAmount = !minAmount || isNaN(min) || invoice.totalAmountTTC >= min;
      const matchesMaxAmount = !maxAmount || isNaN(max) || invoice.totalAmountTTC <= max;

      return matchesSearch && matchesStatus && matchesDate && matchesClients && matchesMinAmount && matchesMaxAmount;
    });
  }, [invoices, searchTerm, filterValues]);

  const handleCreateNewInvoice = () => {
    if (onSubNavigate) {
      onSubNavigate('facturation_create_invoice');
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          alert(`Fichier "${file.name}" sélectionné pour l'upload (simulation).`);
          e.target.value = '';
      }
  };

  const handleCreateCreditNote = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (onSubNavigate) {
          onSubNavigate('create_invoice?type=credit_note');
      }
      setIsActionsDropdownOpen(false);
  };

  const handleViewInvoiceDetail = (invoiceId: string) => {
    if (onSubNavigate) {
      onSubNavigate(`invoice_detail?id=${invoiceId}`);
    }
  };

  const handleSendManualReminder = (invoiceId: string) => {
    alert(`Relance manuelle pour la facture ${invoiceId} envoyée (simulation).`);
    const updatedInvoices = invoices.map(inv => 
        inv.id === invoiceId ? { ...inv, reminderSent: true } : inv
    );
    setInvoices(updatedInvoices);

    // Also update the global mock data so changes persist on navigation
    const mockIndex = mockClientInvoices.findIndex(inv => inv.id === invoiceId);
    if (mockIndex !== -1) {
        mockClientInvoices[mockIndex].reminderSent = true;
    }
  };


  const getInvoiceUIDetails = (invoice: ClientInvoice) => {
    let dateLabel1 = 'Création';
    let dateValue1 = formatDate(invoice.issueDate);
    let dateLabel2 = 'Échéance';
    let dateValue2 = formatDate(invoice.dueDate);
    let showEnvelopeIcon = ['VALIDEE_PA', 'TELECHARGEE_CLIENT', 'PAYEE', 'ENCAISSEE'].includes(invoice.status);
    
    let actionButtons: React.ReactNode = null;

    switch (invoice.status) {
        case 'PAYEE':
        case 'ENCAISSEE':
            dateLabel2 = invoice.status === 'PAYEE' ? 'Payée le' : 'Encaissée le';
            dateValue2 = formatDate(invoice.pdpTransmissionDate || invoice.dueDate); 
            break;
        case 'EN_RETARD':
             if (!invoice.reminderSent) {
                actionButtons = (
                    <button
                        className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md border border-blue-300 transition-colors flex items-center"
                        onClick={(e) => { e.stopPropagation(); handleSendManualReminder(invoice.id);}}
                        aria-label={`Envoyer une relance pour la facture ${invoice.invoiceNumber}`}
                    >
                        <EnvelopeIcon className="w-3 h-3 mr-1" />
                        Relancer
                    </button>
                );
            }
            break;
        case 'REJETEE_PA':
            dateLabel2 = 'Rejetée le';
            dateValue2 = formatDate(invoice.pdpTransmissionDate);
            actionButtons = (
                <button
                    className="px-3 py-1 text-xs font-medium text-theme-primary-600 hover:bg-theme-primary-50 rounded-md border border-theme-primary-300 transition-colors"
                    onClick={(e) => { e.stopPropagation(); alert(`Modifier la facture ${invoice.invoiceNumber} (retour au brouillon simulé)`);}}
                    aria-label={`Modifier la facture ${invoice.invoiceNumber}`}
                >
                    Modifier la facture
                </button>
            );
            break;
        case 'REFUSEE_CLIENT':
            dateLabel2 = 'Refusée le';
            dateValue2 = formatDate(invoice.pdpTransmissionDate); 
             actionButtons = (
                <>
                    <button
                        className="px-3 py-1 text-xs font-medium text-orange-600 hover:bg-orange-50 rounded-md border border-orange-300 transition-colors"
                        onClick={(e) => { e.stopPropagation(); alert(`Contacter le client pour ${invoice.invoiceNumber}`);}}
                        aria-label={`Contacter le client pour la facture ${invoice.invoiceNumber}`}
                    >
                        Contacter client
                    </button>
                     <button
                        className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md border border-red-300 transition-colors"
                        onClick={(e) => { e.stopPropagation(); alert(`Annuler la facture ${invoice.invoiceNumber} (simulé)`);}}
                        aria-label={`Annuler la facture ${invoice.invoiceNumber}`}
                    >
                        Annuler la facture
                    </button>
                </>
            );
            break;
        case 'BROUILLON':
            actionButtons = (
                <>
                    <button
                        className="px-3 py-1 text-xs font-medium text-green-600 hover:bg-green-50 rounded-md border border-green-300 transition-colors"
                        onClick={(e) => { e.stopPropagation(); alert(`Valider en interne ${invoice.invoiceNumber} (passage à APPROUVEE_INTERNE simulé)`);}}
                        aria-label={`Valider en interne la facture ${invoice.invoiceNumber}`}
                    >
                        Valider en interne
                    </button>
                    <button
                        className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md border border-red-300 transition-colors"
                        onClick={(e) => { e.stopPropagation(); alert(`Annuler la facture ${invoice.invoiceNumber} (simulé)`);}}
                        aria-label={`Annuler la facture ${invoice.invoiceNumber}`}
                    >
                        Annuler
                    </button>
                </>
            );
            break;
        case 'APPROUVEE_INTERNE':
             actionButtons = (
                <>
                    <button
                        className="px-3 py-1 text-xs font-medium text-theme-primary-600 hover:bg-theme-primary-50 rounded-md border border-theme-primary-300 transition-colors"
                        onClick={(e) => { e.stopPropagation(); alert(`Déposer à la PA ${invoice.invoiceNumber} (passage à DEPOSEE_PA simulé)`);}}
                        aria-label={`Déposer à la PA la facture ${invoice.invoiceNumber}`}
                    >
                        Déposer à la PA
                    </button>
                     <button
                        className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md border border-red-300 transition-colors"
                        onClick={(e) => { e.stopPropagation(); alert(`Annuler la facture ${invoice.invoiceNumber} (simulé)`);}}
                        aria-label={`Annuler la facture ${invoice.invoiceNumber}`}
                    >
                        Annuler
                    </button>
                </>
            );
            break;
    }
    return { dateLabel1, dateValue1, dateLabel2, dateValue2, showEnvelopeIcon, actionButtons };
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
                    <span className="ml-2 text-sm text-gray-700">{getPAStatusBadgeStyle(status).label}</span>
                </label>
            ))}
            </div>
          </div>
        );
      case 'client':
        return (
            <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">Filtrer par client(s)</label>
                <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
                {uniqueClients.map(client => (
                    <label key={client} className="flex items-center p-1.5 rounded-md hover:bg-gray-100 cursor-pointer">
                        <input type="checkbox" checked={filterValues.clients.includes(client)} onChange={() => handleClientFilterChange(client)} className="h-4 w-4 text-theme-primary-600 border-gray-300 rounded focus:ring-theme-primary-500" />
                        <span className="ml-2 text-sm text-gray-700">{client}</span>
                    </label>
                ))}
                </div>
            </div>
        );
      default:
        return null;
    }
  };


  return (
    <div className="space-y-6">
      <input type="file" ref={fileInputRef} onChange={handleFileSelected} className="hidden" accept="image/*,.pdf" />
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-theme-text">Factures Clients</h2>
        {context === 'ventes' ? (
            <button
                onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-[color:var(--color-primary-contrast-text)] bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 transition-colors focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary-500"
            >
                <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                Uploader une facture
            </button>
        ) : ( // context === 'facturation'
            <div className="relative inline-block text-left" ref={actionsDropdownRef}>
                <div className="flex rounded-md shadow-sm">
                <button
                    onClick={handleCreateNewInvoice}
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-[color:var(--color-primary-contrast-text)] bg-theme-primary-500 rounded-l-md hover:bg-theme-primary-600 transition-colors focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary-500"
                >
                    Nouvelle facture
                </button>
                <div className="-ml-px relative block">
                    <button
                    type="button"
                    onClick={() => setIsActionsDropdownOpen(!isActionsDropdownOpen)}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border-l border-theme-primary-400 bg-theme-primary-500 text-sm font-medium text-white hover:bg-theme-primary-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary-500"
                    aria-haspopup="true"
                    aria-expanded={isActionsDropdownOpen}
                    >
                    <span className="sr-only">Ouvrir les options</span>
                    <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
                </div>

                {isActionsDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <a href="#" onClick={handleCreateCreditNote} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Nouvel avoir</a>
                    </div>
                </div>
                )}
            </div>
        )}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2">
            <div className="relative flex-grow">
                <input
                    type="text"
                    placeholder="Rechercher par N° facture, client..."
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
                            if (filterKey === 'status' || filterKey === 'client') {
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
          const { dateLabel1, dateValue1, dateLabel2, dateValue2, showEnvelopeIcon, actionButtons } = getInvoiceUIDetails(invoice);
          return (
            <div
              key={invoice.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border cursor-pointer border-theme-secondary-gray-200"
              role="article"
              aria-labelledby={`invoice-title-${invoice.id}`}
              onClick={() => handleViewInvoiceDetail(invoice.id)}
            >
              <div className="p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <h3 id={`invoice-title-${invoice.id}`} className="text-base font-semibold text-theme-text truncate" title={invoice.clientName}>
                        {invoice.invoiceNumber} <span className="text-gray-600 font-normal">- {invoice.clientName}</span>
                      </h3>
                       {invoice.reminderSent && <EnvelopeIcon className="w-4 h-4 text-red-500 ml-2" title="Relance envoyée" />}
                    </div>
                    <p className="text-lg font-bold text-theme-text whitespace-nowrap ml-4">
                      {formatCurrency(invoice.totalAmountTTC)}
                    </p>
                  </div>

                  <div className="mt-1">
                    <StatusProgressionDisplay invoiceStatus={invoice.status} />
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                    <span className="bg-theme-primary-50 text-theme-primary-700 border border-theme-primary-200 px-2 py-1 rounded-md">
                      {dateLabel1}: <strong className="font-semibold">{dateValue1}</strong>
                    </span>
                    <span className="bg-theme-primary-50 text-theme-primary-700 border border-theme-primary-200 px-2 py-1 rounded-md">
                      {dateLabel2}: <strong className="font-semibold">{dateValue2}</strong>
                    </span>
                    {showEnvelopeIcon && <EnvelopeIcon className="w-4 h-4 text-theme-primary-500" title="Facture transmise/payée" />}
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
          Aucune facture ne correspond à vos critères de recherche.
        </div>
      )}
    </div>
  );
};

export default ClientInvoiceListPage;