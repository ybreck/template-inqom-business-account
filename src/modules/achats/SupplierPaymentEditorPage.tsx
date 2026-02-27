import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ModuleComponentProps, SupplierPaymentBatch, SupplierInvoice, PAStatus, SupplierPaymentInvoice } from '../../../types';
import { mockSupplierPayments } from './data/supplierPayments';
import { mockSupplierInvoices } from '../supplierInvoices/data';
import { mockBankAccounts } from '../ventes/data/quotes';
import { ArrowLeftIcon, MagnifyingGlassIcon, FilterIcon, PlusIcon, ChevronDownIcon, ArrowPathIcon } from '../../constants/icons';
import { getPAStatusBadgeStyle } from '../clientInvoices/utils';


const emptySupplierPaymentBatch: SupplierPaymentBatch = {
    id: 'new',
    name: '',
    sourceAccountId: mockBankAccounts.find(b => b.isDefault)?.id || '',
    status: 'En préparation',
    invoiceCount: 0,
    creationDate: new Date().toISOString().split('T')[0],
    paymentDate: '',
    totalAmountTTC: 0,
    invoices: [],
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const dateObj = new Date(dateString.replace(/-/g, '/'));
  return dateObj.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const SupplierPaymentEditorPage: React.FC<ModuleComponentProps> = ({ activeSubPageId, onSubNavigate }) => {
    const [batch, setBatch] = useState<SupplierPaymentBatch | null>(null);
    const [eligibleInvoices] = useState<SupplierInvoice[]>(mockSupplierInvoices.filter(inv => inv.status !== 'PAYEE_ACHAT' && inv.status !== 'ANNULEE_ACHAT'));
    const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<Set<string>>(new Set());
    
    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(true);
    const [visibleFilters, setVisibleFilters] = useState<string[]>(['status', 'supplier']);
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
        if (activeSubPageId && activeSubPageId.startsWith('supplier_payment_editor?id=')) {
            const params = new URLSearchParams(activeSubPageId.split('?')[1]);
            const id = params.get('id');
            
            if (id === 'new') {
                setBatch({...emptySupplierPaymentBatch});
                setSelectedInvoiceIds(new Set());
            } else if (id) {
                const foundBatch = mockSupplierPayments.find(b => b.id === id);
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
                    supplierName: invoiceDetails.supplierName,
                    dueDate: invoiceDetails.dueDate,
                    totalAmount: invoiceDetails.totalAmountTTC,
                    amountToPay: invoiceDetails.totalAmountTTC,
                };
            }
            return null;
        }).filter((inv): inv is SupplierPaymentInvoice => inv !== null);

        const total = newBatchInvoices.reduce((sum, inv) => sum + inv.amountToPay, 0);
        setBatch(prev => prev ? { ...prev, invoices: newBatchInvoices, totalAmountTTC: total, invoiceCount: newBatchInvoices.length } : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedInvoiceIds, eligibleInvoices]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setOpenFilterPopover(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, []);

    
    const uniqueSuppliers = useMemo(() => Array.from(new Set(eligibleInvoices.map(inv => inv.supplierName))).sort(), [eligibleInvoices]);
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
    
    const handleAmountToPayChange = (invoiceId: string, newAmount: string) => {
        const amount = parseFloat(newAmount);
        setBatch(prev => {
            if (!prev) return null;
            const updatedInvoices = prev.invoices.map(inv => 
                inv.invoiceId === invoiceId ? { ...inv, amountToPay: isNaN(amount) ? 0 : amount } : inv
            );
            const total = updatedInvoices.reduce((sum, inv) => sum + inv.amountToPay, 0);
            return { ...prev, invoices: updatedInvoices, totalAmountTTC: total };
        });
    };

    const handleSave = (status: 'En préparation' | 'Payé') => {
        if (!batch) return;
        if (!batch.name.trim() || !batch.paymentDate || batch.invoices.length === 0) {
            alert("Veuillez remplir tous les champs obligatoires et sélectionner au moins une facture.");
            return;
        }

        const finalBatch = { ...batch, status };
        
        // Find if we are editing or creating
        const existingBatchIndex = mockSupplierPayments.findIndex(p => p.id === finalBatch.id);
        if (existingBatchIndex > -1) {
            mockSupplierPayments[existingBatchIndex] = finalBatch;
        } else {
            mockSupplierPayments.push({ ...finalBatch, id: `spb_${Date.now()}` });
        }
        
        console.log(`Saving batch as "${status}":`, finalBatch);
        alert(`Lot de paiement "${finalBatch.name}" enregistré (simulation).`);
        onSubNavigate?.('paiements_fournisseurs');
    };

    const filteredEligibleInvoices = useMemo(() => {
        return eligibleInvoices.filter(invoice => {
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
    }, [eligibleInvoices, searchTerm, filterValues]);

    const handleStatusFilterChange = (status: PAStatus) => {
        setFilterValues(prev => {
            const newStatuses = new Set(prev.statuses);
            if (newStatuses.has(status)) newStatuses.delete(status);
            else newStatuses.add(status);
            return { ...prev, statuses: Array.from(newStatuses) };
        });
    };

    const handleSupplierFilterChange = (supplierName: string) => {
        setFilterValues(prev => ({
            ...prev,
            suppliers: prev.suppliers.includes(supplierName) ? prev.suppliers.filter(s => s !== supplierName) : [...prev.suppliers, supplierName]
        }));
    };

    const resetFilters = () => {
        setVisibleFilters(['status', 'supplier']);
        setFilterValues({ statuses: [], suppliers: [], startDate: '', endDate: '', minAmount: '', maxAmount: '' });
        setSearchTerm('');
        setOpenFilterPopover(null);
    };

    const addFilter = (filterKey: string) => {
        setVisibleFilters(prev => prev.includes(filterKey) ? prev : [...prev, filterKey]);
        setOpenFilterPopover(null);
    };

    const allFilters: Record<string, string> = {
        date: "Date d'échéance",
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
            default: return 'Filtre';
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
            default: return null;
        }
    };


    if (!batch) {
        return <div className="p-6 bg-white rounded-lg shadow text-center">Chargement ou lot non trouvé...</div>;
    }

    const isNew = batch.id === 'new';
    const title = isNew ? "Nouveau Lot de Paiement" : `Éditer: ${batch.name}`;

    return (
      <div className="flex gap-8 h-[calc(100vh-var(--header-height,150px)-2rem)]">
          {/* Left Panel: Invoice List */}
          <div className="w-3/5 space-y-4 flex flex-col min-h-0">
              <div className="flex items-center space-x-3 flex-shrink-0">
                <button onClick={() => onSubNavigate?.('paiements_fournisseurs')} className="p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-2xl font-semibold text-theme-text">{title}</h2>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                        <input type="text" placeholder="Rechercher par N° facture, fournisseur..." className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-theme-primary-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                                    if (filterKey === 'status' || filterKey === 'supplier') {
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
                                {Object.keys(allFilters).length > visibleFilters.filter(f => !['status', 'supplier'].includes(f)).length && (
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
                                      <div><h3 className="text-base font-semibold text-theme-text">{invoice.invoiceNumber} <span className="text-gray-600 font-normal">- {invoice.supplierName}</span></h3></div>
                                      <p className="text-lg font-bold text-theme-text ml-4">{formatCurrency(invoice.totalAmountTTC)}</p>
                                  </div>
                                  <div className="mt-1 text-xs text-gray-500">Échéance: {formatDate(invoice.dueDate)}</div>
                              </div>
                          </div>
                      </div>
                  ))}
                  {filteredEligibleInvoices.length === 0 && <div className="text-center py-10 text-gray-500">Aucune facture ne correspond à vos critères.</div>}
              </div>
          </div>

          {/* Right Panel: Creation Form */}
          <div className="w-2/5 sticky top-6 h-[calc(100vh-var(--header-height,150px)-5rem)]">
              <div className="bg-white p-6 rounded-lg shadow-md border h-full flex flex-col">
                  <h3 className="text-xl font-semibold text-theme-text mb-4">Détails du lot</h3>
                  <div className="space-y-4 flex-grow flex flex-col min-h-0">
                      <div>
                          <label className="text-sm font-medium text-gray-700">Nom du lot *</label>
                          <input type="text" name="name" value={batch.name} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-white"/>
                      </div>
                      <div>
                          <label className="text-sm font-medium text-gray-700">Date de paiement *</label>
                          <input type="date" name="paymentDate" value={batch.paymentDate || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-white"/>
                      </div>
                      <div>
                          <label className="text-sm font-medium text-gray-700">Compte source *</label>
                          <select name="sourceAccountId" value={batch.sourceAccountId} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-white">
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
                                          <label className="text-xs text-gray-500">Montant à payer:</label>
                                          <input type="number" value={invoice.amountToPay} onChange={(e) => handleAmountToPayChange(invoice.invoiceId, e.target.value)} className="w-full text-right p-1 border rounded-md text-sm bg-white" step="0.01" max={invoice.totalAmount} />
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                      <div className="border-t pt-2 mt-2 flex-shrink-0">
                          <p className="text-xl font-bold text-theme-primary-600 text-right">{formatCurrency(batch.totalAmountTTC)}</p>
                      </div>
                  </div>
                  <div className="mt-auto flex space-x-3 pt-4">
                      <button onClick={() => handleSave('En préparation')} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Enregistrer</button>
                      <button onClick={() => handleSave('Payé')} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600">Valider & Payer</button>
                  </div>
              </div>
          </div>
      </div>
    );
};

export default SupplierPaymentEditorPage;
