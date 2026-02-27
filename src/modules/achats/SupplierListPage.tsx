import React, { useState, useMemo } from 'react';
import { ModuleComponentProps, Supplier } from '../../../types';
import { mockSuppliers } from './data/suppliers';
import { 
    MagnifyingGlassIcon, 
    FilterIcon,
    PlusIcon,
    ArrowPathIcon,
} from '../../constants/icons';

interface SupplierListPageProps extends ModuleComponentProps {}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const PaymentProgressBar: React.FC<{ paid: number; due: number }> = ({ paid, due }) => {
    const total = paid + due;
    const percentage = total > 0 ? (paid / total) * 100 : 0;
    const isFullyPaid = due <= 0;

    let barColorClass = 'bg-theme-primary-500';
    if (isFullyPaid) {
        barColorClass = 'bg-green-500';
    } else if (paid > 0) {
        barColorClass = 'bg-yellow-500';
    } else {
        barColorClass = 'bg-red-500'; // Nothing paid
    }

    return (
        <div>
            <div className="flex justify-between items-baseline text-xs mb-1">
                <span className="font-semibold text-gray-700">
                    Payé: {formatCurrency(paid)}
                </span>
                <span className="text-gray-500">
                    {percentage.toFixed(0)}%
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                    className={`${barColorClass} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
            </div>
        </div>
    );
};


const SupplierListPage: React.FC<SupplierListPageProps> = ({ onSubNavigate }) => {
    const [suppliers] = useState<Supplier[]>(mockSuppliers);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterValues, setFilterValues] = useState({
        minDue: '',
        maxDue: '',
    });

    const filteredSuppliers = useMemo(() => {
        return suppliers.filter(supplier => {
            const { minDue, maxDue } = filterValues;
            const searchTermLower = searchTerm.toLowerCase();

            const matchesSearch = searchTermLower === '' ||
                supplier.name.toLowerCase().includes(searchTermLower) ||
                supplier.reference.toLowerCase().includes(searchTermLower) ||
                supplier.siren.toLowerCase().includes(searchTermLower);

            const min = parseFloat(minDue);
            const max = parseFloat(maxDue);
            const matchesMinDue = !minDue || isNaN(min) || supplier.due >= min;
            const matchesMaxDue = !maxDue || isNaN(max) || supplier.due <= max;

            return matchesSearch && matchesMinDue && matchesMaxDue;
        });
    }, [suppliers, searchTerm, filterValues]);
    
    const resetFilters = () => {
        setFilterValues({ minDue: '', maxDue: '' });
        setSearchTerm('');
    };
    
    const handleViewSupplierDetail = (supplierId: string) => {
        if (onSubNavigate) {
            onSubNavigate(`supplier_detail?id=${supplierId}`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold text-theme-text">Fournisseurs</h2>
                <button
                    onClick={() => onSubNavigate?.('supplier_detail?id=new')}
                    className="flex items-center px-4 py-2 text-sm font-semibold text-[color:var(--color-primary-contrast-text)] bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 transition-colors"
                >
                    <PlusIcon className="w-5 h-5 mr-1.5" />
                    Nouveau fournisseur
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Rechercher par nom, référence, SIREN..."
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
                                <div className="flex items-center gap-2 p-1 border border-gray-300 rounded-md bg-white">
                                    <label htmlFor="min-due" className="text-sm font-medium text-gray-500 pl-2">Montant Dû</label>
                                    <input type="number" id="min-due" placeholder="Min" value={filterValues.minDue} onChange={e => setFilterValues(prev => ({...prev, minDue: e.target.value}))} className="w-24 text-sm border-0 rounded-md bg-gray-50 focus:ring-1 focus:ring-theme-primary-500 p-1" />
                                    <span className="text-gray-400">-</span>
                                    <input type="number" id="max-due" placeholder="Max" value={filterValues.maxDue} onChange={e => setFilterValues(prev => ({...prev, maxDue: e.target.value}))} className="w-24 text-sm border-0 rounded-md bg-gray-50 focus:ring-1 focus:ring-theme-primary-500 p-1" />
                                </div>
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
                {filteredSuppliers.map((supplier) => (
                    <div
                        key={supplier.id}
                        onClick={() => handleViewSupplierDetail(supplier.id)}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border cursor-pointer border-theme-secondary-gray-200"
                        role="article"
                        aria-labelledby={`supplier-title-${supplier.id}`}
                    >
                        <div className="p-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 id={`supplier-title-${supplier.id}`} className="text-base font-semibold text-theme-text truncate" title={supplier.name}>
                                            {supplier.name}
                                        </h3>
                                    </div>
                                    <p className="text-lg font-bold text-theme-text whitespace-nowrap ml-4">
                                        {formatCurrency(supplier.due)}
                                        <span className="text-xs text-gray-500 font-normal block text-right">Dû</span>
                                    </p>
                                </div>

                                <div className="mt-2 flex justify-between items-center gap-4">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                                        <span className="bg-theme-secondary-gray-100 text-theme-secondary-gray-700 border border-theme-secondary-gray-200 px-2 py-1 rounded-md">
                                            Référence: <strong className="font-semibold">{supplier.reference}</strong>
                                        </span>
                                        <span className="bg-theme-secondary-gray-100 text-theme-secondary-gray-700 border border-theme-secondary-gray-200 px-2 py-1 rounded-md">
                                            SIREN: <strong className="font-semibold">{supplier.siren}</strong>
                                        </span>
                                    </div>
                                    <div className="w-2/5">
                                        <PaymentProgressBar paid={supplier.paid} due={supplier.due} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredSuppliers.length === 0 && (
                    <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                        Aucun fournisseur ne correspond à vos critères de recherche.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupplierListPage;