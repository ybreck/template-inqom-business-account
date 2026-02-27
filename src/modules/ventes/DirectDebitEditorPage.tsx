import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ModuleComponentProps, DirectDebitBatch, ClientInvoice, PAStatus, DirectDebitInvoice } from '../../../types';
import { mockDirectDebits } from './data/directDebits';
import { mockClientInvoices } from '../clientInvoices/data';
import { mockBankAccounts } from './data/quotes';
import { ArrowLeftIcon, MagnifyingGlassIcon, FilterIcon, PlusIcon, ChevronDownIcon, ArrowPathIcon } from '../../constants/icons';
import { getPAStatusBadgeStyle } from '../clientInvoices/utils';


const emptyDirectDebitBatch: DirectDebitBatch = {
    id: 'new',
    name: '',
    destinationAccountId: mockBankAccounts.find(b => b.isDefault)?.id || '',
    status: 'En préparation',
    invoiceCount: 0,
    creationDate: new Date().toISOString().split('T')[0],
    debitDate: '',
    totalAmountTTC: 0,
    invoices: [],
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

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


const StatusProgressionDisplay: React.FC<{ invoiceStatus: PAStatus }> = ({ invoiceStatus }) => {
    // Simplified display for this context
    const statusInfo = getPAStatusBadgeStyle(invoiceStatus);
    return (
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusInfo.className}`}>
            {statusInfo.label}
        </span>
    );
};

const DirectDebitEditorPage: React.FC<ModuleComponentProps> = ({ activeSubPageId, onSubNavigate }) => {
    const [batch, setBatch] = useState<DirectDebitBatch | null>(null);
    const [eligibleInvoices] = useState<ClientInvoice[]>(mockClientInvoices.filter(inv => inv.status !== 'ENCAISSEE' && inv.status !== 'ANNULEE'));
    const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<Set<string>>(new Set());
    
    // Filter States
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
        if (activeSubPageId && activeSubPageId.startsWith('direct_debit_editor?id=')) {
            const params = new URLSearchParams(activeSubPageId.split('?')[1]);
            const id = params.get('id');
            
            if (id === 'new') {
                setBatch({...emptyDirectDebitBatch});
                setSelectedInvoiceIds(new Set());
            } else if (id) {
                const foundBatch = mockDirectDebits.find(b => b.id === id);
                if (foundBatch) {
                    setBatch(JSON.parse(JSON.stringify(foundBatch))); // Deep copy for editing
                    setSelectedInvoiceIds(new Set(foundBatch.invoices.map(i => i.invoiceId)));
                } else {
                    setBatch(null); // Not found
                }
            }
        }
    }, [activeSubPageId]);
    
    useEffect(() => {
        if (!batch) return;

        const newBatchInvoices = Array.from(selectedInvoiceIds).map(id => {
            const existingInvoiceData = batch.invoices.find(inv => inv.invoiceId === id);
            if (existingInvoiceData) {
                return existingInvoiceData;
            }
            const invoiceDetails = eligibleInvoices.find(inv => inv.id === id);
            if (invoiceDetails) {
                return {
                    invoiceId: invoiceDetails.id,
                    invoiceNumber: invoiceDetails.invoiceNumber,
                    clientName: invoiceDetails.clientName,
                    dueDate: invoiceDetails.dueDate,
                    totalAmount: invoiceDetails.totalAmountTTC,
                    amountToDebit: invoiceDetails.totalAmountTTC,
                };
            }
            return null;
        }).filter((inv): inv is DirectDebitInvoice => inv !== null);

        const total = newBatchInvoices.reduce((sum, inv) => sum + inv.amountToDebit, 0);
        setBatch(prev => prev ? { ...prev, invoices: newBatchInvoices, totalAmountTTC: total, invoiceCount: newBatchInvoices.length } : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedInvoiceIds, eligibleInvoices]);
    
    const uniqueClients = useMemo(() => Array.from(new Set(eligibleInvoices.map(inv => inv.clientName))).sort(), [eligibleInvoices]);
    const uniqueStatuses = useMemo(() => Array.from(new Set(eligibleInvoices.map(inv => inv.status))), [eligibleInvoices]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBatch(prev => prev ? { ...prev, [name]: value } : null);
    };
    
    const handleInvoiceSelection = (invoiceId: string) => {
        setSelectedInvoiceIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(invoiceId)) newSet.delete(invoiceId);
            else newSet.add(invoiceId);
            return newSet;
        });
    };
    
    const handleAmountToDebitChange = (invoiceId: string, newAmount: string) => {
        const amount = parseFloat(newAmount);
        setBatch(prev => {
            if (!prev) return null;
            const updatedInvoices = prev.invoices.map(inv => 
                inv.invoiceId === invoiceId ? { ...inv, amountToDebit: isNaN(amount) ? 0 : amount } : inv
            );
            const total = updatedInvoices.reduce((sum, inv) => sum + inv.amountToDebit, 0);
            return { ...prev, invoices: updatedInvoices, totalAmountTTC: total };
        });
    };

    const handleSave = (status: 'En préparation' | 'Prélevé') => {
        if (!batch) return;
        if (!batch.name.trim() || !batch.debitDate || batch.invoices.length === 0) {
            alert("Veuillez remplir tous les champs et sélectionner au moins une facture.");
            return;
        }

        const finalBatch = { ...batch, status };
        console.log(`Saving batch as "${status}":`, finalBatch);
        alert(`Lot de prélèvement "${finalBatch.name}" enregistré (simulation).`);
        onSubNavigate?.('ventes_prelevements');
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setOpenFilterPopover(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleStatusFilterChange = (status: PAStatus) => {
        setFilterValues(prev => {
            const newStatuses = new Set(prev.statuses);
            if (newStatuses.has(status)) newStatuses.delete(status);
            else newStatuses.add(status);
            return { ...prev, statuses: Array.from(newStatuses) };
        });
    };
    
    const handleClientFilterChange = (clientName: string) => {
        setFilterValues(prev => ({ ...prev, clients: prev.clients.includes(clientName) ? prev.clients.filter(c => c !== clientName) : [...prev.clients, clientName] }));
    };

    const resetFilters = () => {
        setVisibleFilters(['status']);
        setFilterValues({ statuses: [], clients: [], startDate: '', endDate: '', minAmount: '', maxAmount: '' });
        setSearchTerm('');
        setOpenFilterPopover(null);
    };

    const addFilter = (filterKey: string) => {
        setVisibleFilters(prev => prev.includes(filterKey) ? prev : [...prev, filterKey]);
        setOpenFilterPopover(null);
    };

    const allFilters: Record<string, string> = { client: 'Client', date: "Date d'échéance", amount: 'Montant' };

    const getFilterButtonText = useCallback((filterKey: string) => {
        const { statuses, clients } = filterValues;
        switch (filterKey) {
            case 'status':
                if (statuses.length === 0) return 'Statut';
                if (statuses.length === 1) return `Statut: ${getPAStatusBadgeStyle(statuses[0]).label}`;
                return `Statuts: ${statuses.length} sel.`;
            case 'client':
                if (clients.length === 0) return 'Client';
                if (clients.length === 1) return `Client: ${clients[0]}`;
                return `Clients: ${clients.length} sel.`;
            default: return 'Filtre';
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

    const filteredEligibleInvoices = useMemo(() => {
        return eligibleInvoices.filter(invoice => {
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
            if (start) start.setHours(0, 0, 0, 0);
            if (end) end.setHours(23, 59, 59, 999);
            const matchesDate = (!start || dueDate >= start) && (!end || dueDate <= end);
            const matchesClients = clients.length === 0 || clients.includes(invoice.clientName);
            const min = parseFloat(minAmount);
            const max = parseFloat(maxAmount);
            const matchesMinAmount = !minAmount || isNaN(min) || invoice.totalAmountTTC >= min;
            const matchesMaxAmount = !maxAmount || isNaN(max) || invoice.totalAmountTTC <= max;

            return matchesSearch && matchesStatus && matchesDate && matchesClients && matchesMinAmount && matchesMaxAmount;
        });
    }, [eligibleInvoices, searchTerm, filterValues]);

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
            default: return null;
        }
    };
    
    if (!batch) {
        return <div className="p-6 bg-white rounded-lg shadow text-center">Chargement ou lot non trouvé...</div>;
    }

    const isNew = batch.id === 'new';
    const title = isNew ? "Nouveau Lot de Prélèvement" : `Éditer: ${batch.name}`;

    return (
      <div className="flex gap-6 h-[calc(100vh-var(--header-height,150px)-2rem)]">
          {/* Left Panel: Invoice List */}
          <div className="flex-[2] space-y-4 flex flex-col min-h-0">
              <div className="flex items-center space-x-3 flex-shrink-0">
                <button onClick={() => onSubNavigate?.('ventes_prelevements')} className="p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-2xl font-semibold text-theme-text">{title}</h2>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                        <input type="text" placeholder="Rechercher par N° facture, client..." className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-theme-primary-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                     <button onClick={() => setShowFilters(prev => !prev)} className={`p-2 rounded-md border transition-colors ${showFilters ? 'bg-theme-primary-100 text-theme-primary-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100'}`} aria-expanded={showFilters}>
                        <FilterIcon className="w-5 h-5" />
                    </button>
                </div>
                {showFilters && (
                    <div className="pt-4 mt-4 border-t">
                        <div className="flex justify-between items-center gap-2">
                            <div className="flex flex-wrap items-center gap-3">
                                {visibleFilters.map(filterKey => {
                                    if (filterKey === 'status' || filterKey === 'client') {
                                        return (
                                            <div key={filterKey} className="relative">
                                                <button onClick={() => setOpenFilterPopover(openFilterPopover === filterKey ? null : filterKey)} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border rounded-md transition-colors ${isFilterActive(filterKey) ? 'bg-theme-primary-50 text-theme-primary-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                                                    <span>{getFilterButtonText(filterKey)}</span>
                                                    <ChevronDownIcon className="w-4 h-4" />
                                                </button>
                                                {openFilterPopover === filterKey && <div ref={popoverRef} className="absolute top-full mt-2 z-20 bg-white rounded-md shadow-lg border p-4 w-72">{renderFilterPopoverContent(filterKey)}</div>}
                                            </div>
                                        );
                                    }
                                    if (filterKey === 'date') {
                                        return (
                                            <div key={filterKey} className="flex items-center gap-2 p-1 border rounded-md bg-white">
                                                <label className="text-sm text-gray-500 pl-2">Échéance</label>
                                                <input type="date" value={filterValues.startDate} onChange={e => setFilterValues(prev => ({...prev, startDate: e.target.value}))} className="text-sm border-0 rounded-md bg-gray-50 focus:ring-1 p-1"/>
                                                <span className="text-gray-400">au</span>
                                                <input type="date" value={filterValues.endDate} onChange={e => setFilterValues(prev => ({...prev, endDate: e.target.value}))} className="text-sm border-0 rounded-md bg-gray-50 focus:ring-1 p-1"/>
                                            </div>
                                        );
                                    }
                                    if (filterKey === 'amount') {
                                        return (
                                            <div key={filterKey} className="flex items-center gap-2 p-1 border rounded-md bg-white">
                                                <label className="text-sm text-gray-500 pl-2">Montant</label>
                                                <input type="number" placeholder="Min" value={filterValues.minAmount} onChange={e => setFilterValues(prev => ({...prev, minAmount: e.target.value}))} className="w-24 text-sm border-0 rounded-md bg-gray-50 focus:ring-1 p-1" />
                                                <span className="text-gray-400">-</span>
                                                <input type="number" placeholder="Max" value={filterValues.maxAmount} onChange={e => setFilterValues(prev => ({...prev, maxAmount: e.target.value}))} className="w-24 text-sm border-0 rounded-md bg-gray-50 focus:ring-1 p-1" />
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                                {Object.keys(allFilters).length > visibleFilters.filter(f => !['status', 'client'].includes(f)).length && (
                                    <div className="relative">
                                        <button onClick={() => setOpenFilterPopover(openFilterPopover === 'add' ? null : 'add')} className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-700 bg-gray-50 border rounded-md hover:bg-gray-100">
                                            <PlusIcon className="w-4 h-4" /> Ajouter filtre
                                        </button>
                                        {openFilterPopover === 'add' && <div ref={popoverRef} className="absolute top-full mt-2 z-20 bg-white rounded-md shadow-lg border py-1 w-48">{Object.entries(allFilters).filter(([key]) => !visibleFilters.includes(key)).map(([key, name]) => <button key={key} onClick={() => addFilter(key)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">{name}</button>)}</div>}
                                    </div>
                                )}
                            </div>
                            <button onClick={resetFilters} className="flex-shrink-0 flex items-center px-3 py-2 text-xs text-gray-600 bg-white rounded-md hover:bg-gray-100 border"><ArrowPathIcon className="w-3 h-3 mr-1" />Réinitialiser</button>
                        </div>
                    </div>
                )}
              </div>
              <div className="space-y-3 flex-grow overflow-y-auto pr-2">
                  {filteredEligibleInvoices.map(invoice => (
                      <div key={invoice.id} onClick={() => handleInvoiceSelection(invoice.id)} className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border cursor-pointer ${selectedInvoiceIds.has(invoice.id) ? 'border-theme-primary-500 ring-2 ring-theme-primary-200' : 'border-theme-secondary-gray-200'}`}>
                          <div className="p-4 flex items-start space-x-4">
                              <input type="checkbox" className="mt-1 h-5 w-5 text-theme-primary-600 rounded" checked={selectedInvoiceIds.has(invoice.id)} readOnly />
                              <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                      <div><h3 className="text-base font-semibold text-theme-text">{invoice.invoiceNumber} <span className="text-gray-600 font-normal">- {invoice.clientName}</span></h3></div>
                                      <p className="text-lg font-bold text-theme-text ml-4">{formatCurrency(invoice.totalAmountTTC)}</p>
                                  </div>
                                  <div className="mt-1"><StatusProgressionDisplay invoiceStatus={invoice.status} /></div>
                              </div>
                          </div>
                      </div>
                  ))}
                  {filteredEligibleInvoices.length === 0 && <div className="text-center py-10 text-gray-500">Aucune facture éligible ne correspond à vos critères.</div>}
              </div>
          </div>

          {/* Right Panel: Creation Form */}
          <div className="flex-1 sticky top-6 h-[calc(100vh-var(--header-height,150px)-5rem)]">
              <div className="bg-white p-6 rounded-lg shadow-md border h-full flex flex-col">
                  <h3 className="text-lg font-semibold text-theme-text mb-4">Détails du lot</h3>
                  <div className="space-y-4 flex-grow flex flex-col min-h-0">
                      <div>
                          <label className="text-xs text-gray-600">Nom du lot *</label>
                          <input type="text" name="name" value={batch.name} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-white"/>
                      </div>
                      <div>
                          <label className="text-xs text-gray-600">Date d'exécution *</label>
                          <input type="date" name="debitDate" value={batch.debitDate || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-white"/>
                      </div>
                      <div>
                          <label className="text-xs text-gray-600">Compte de destination *</label>
                          <select name="destinationAccountId" value={batch.destinationAccountId} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-white">
                              {mockBankAccounts.map(b => <option key={b.id} value={b.id}>{b.bankName} (...{b.iban.slice(-4)})</option>)}
                          </select>
                      </div>
                      <div className="border-t pt-4 mt-4 flex-grow flex flex-col min-h-0">
                          <p className="text-sm font-medium text-gray-700 mb-2 flex-shrink-0">{batch.invoiceCount} factures sélectionnées</p>
                          <div className="flex-grow overflow-y-auto -mr-2 pr-2 space-y-2">
                              {batch.invoices.map(invoice => (
                                  <div key={invoice.invoiceId} className="p-3 bg-slate-50 rounded-md border">
                                      <div className="flex justify-between items-center text-xs mb-1">
                                          <span className="font-semibold">{invoice.invoiceNumber}</span>
                                          <span className="text-gray-600">{formatCurrency(invoice.totalAmount)}</span>
                                      </div>
                                      <div>
                                          <label className="text-xs text-gray-500">Montant à prélever:</label>
                                          <input type="number" value={invoice.amountToDebit} onChange={(e) => handleAmountToDebitChange(invoice.invoiceId, e.target.value)} className="w-full text-right p-1 border rounded-md text-sm bg-white" step="0.01" max={invoice.totalAmount} />
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                      <div className="border-t pt-2 mt-2 flex-shrink-0">
                          <p className="text-lg font-bold text-theme-primary-600 text-right">{formatCurrency(batch.totalAmountTTC)}</p>
                      </div>
                  </div>
                  <div className="mt-auto flex space-x-3 pt-4">
                      <button onClick={() => handleSave('En préparation')} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Enregistrer</button>
                      <button onClick={() => handleSave('Prélevé')} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600">Valider</button>
                  </div>
              </div>
          </div>
      </div>
    );
};

export default DirectDebitEditorPage;
