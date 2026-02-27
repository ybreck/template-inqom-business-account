import React, { useState, useMemo } from 'react';
import { ModuleComponentProps, Client } from '../../../types';
import { mockClients } from './data/clients';
import { 
    MagnifyingGlassIcon, 
    FilterIcon,
    PlusIcon,
    ArrowPathIcon,
} from '../../constants/icons';

interface ClientListPageProps extends ModuleComponentProps {}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const PaymentProgressBar: React.FC<{ paid: number; invoiced: number }> = ({ paid, invoiced }) => {
    const percentage = invoiced > 0 ? (paid / invoiced) * 100 : 0;
    const isFullyPaid = percentage >= 100;

    let barColorClass = 'bg-theme-primary-500';
    if (isFullyPaid) {
        barColorClass = 'bg-green-500';
    } else if (paid > 0) {
        barColorClass = 'bg-yellow-500';
    } else {
        barColorClass = 'bg-transparent';
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


const ClientListPage: React.FC<ClientListPageProps> = ({ onSubNavigate }) => {
    const [clients] = useState<Client[]>(mockClients);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterValues, setFilterValues] = useState({
        minInvoiced: '',
        maxInvoiced: '',
    });

    const filteredClients = useMemo(() => {
        return clients.filter(client => {
            const { minInvoiced, maxInvoiced } = filterValues;
            const searchTermLower = searchTerm.toLowerCase();

            const matchesSearch = searchTermLower === '' ||
                client.name.toLowerCase().includes(searchTermLower) ||
                client.reference.toLowerCase().includes(searchTermLower) ||
                client.siren.toLowerCase().includes(searchTermLower);

            const min = parseFloat(minInvoiced);
            const max = parseFloat(maxInvoiced);
            const matchesMinInvoiced = !minInvoiced || isNaN(min) || client.invoiced >= min;
            const matchesMaxInvoiced = !maxInvoiced || isNaN(max) || client.invoiced <= max;

            return matchesSearch && matchesMinInvoiced && matchesMaxInvoiced;
        });
    }, [clients, searchTerm, filterValues]);
    
    const resetFilters = () => {
        setFilterValues({ minInvoiced: '', maxInvoiced: '' });
        setSearchTerm('');
    };
    
    const handleViewClientDetail = (clientId: string) => {
        if (onSubNavigate) {
            onSubNavigate(`client_detail?id=${clientId}`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold text-theme-text">Clients</h2>
                <button
                    onClick={() => onSubNavigate?.('client_detail?id=new')}
                    className="flex items-center px-4 py-2 text-sm font-semibold text-[color:var(--color-primary-contrast-text)] bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 transition-colors"
                >
                    <PlusIcon className="w-5 h-5 mr-1.5" />
                    Nouveau client
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
                                    <label htmlFor="min-invoiced" className="text-sm font-medium text-gray-500 pl-2">Montant Facturé</label>
                                    <input type="number" id="min-invoiced" placeholder="Min" value={filterValues.minInvoiced} onChange={e => setFilterValues(prev => ({...prev, minInvoiced: e.target.value}))} className="w-24 text-sm border-0 rounded-md bg-gray-50 focus:ring-1 focus:ring-theme-primary-500 p-1" />
                                    <span className="text-gray-400">-</span>
                                    <input type="number" id="max-invoiced" placeholder="Max" value={filterValues.maxInvoiced} onChange={e => setFilterValues(prev => ({...prev, maxInvoiced: e.target.value}))} className="w-24 text-sm border-0 rounded-md bg-gray-50 focus:ring-1 focus:ring-theme-primary-500 p-1" />
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
                {filteredClients.map((client) => (
                    <div
                        key={client.id}
                        onClick={() => handleViewClientDetail(client.id)}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border cursor-pointer border-theme-secondary-gray-200"
                        role="article"
                        aria-labelledby={`client-title-${client.id}`}
                    >
                        <div className="p-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 id={`client-title-${client.id}`} className="text-base font-semibold text-theme-text truncate" title={client.name}>
                                            {client.name}
                                        </h3>
                                    </div>
                                    <p className="text-lg font-bold text-theme-text whitespace-nowrap ml-4">
                                        {formatCurrency(client.invoiced)}
                                        <span className="text-xs text-gray-500 font-normal block text-right">Facturé</span>
                                    </p>
                                </div>

                                <div className="mt-2 flex justify-between items-center gap-4">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                                        <span className="bg-theme-secondary-gray-100 text-theme-secondary-gray-700 border border-theme-secondary-gray-200 px-2 py-1 rounded-md">
                                            Référence: <strong className="font-semibold">{client.reference}</strong>
                                        </span>
                                        <span className="bg-theme-secondary-gray-100 text-theme-secondary-gray-700 border border-theme-secondary-gray-200 px-2 py-1 rounded-md">
                                            SIREN: <strong className="font-semibold">{client.siren}</strong>
                                        </span>
                                    </div>
                                    <div className="w-2/5">
                                        <PaymentProgressBar paid={client.paid} invoiced={client.invoiced} />
                                    </div>
                                </div>

                                <div className="mt-3 flex justify-end space-x-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); alert(`Facturer le client ${client.name}`); }}
                                        className="px-3 py-1 text-xs font-medium text-teal-600 hover:bg-teal-50 rounded-md border border-teal-300 transition-colors"
                                    >
                                        Facturer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredClients.length === 0 && (
                    <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                        Aucun client ne correspond à vos critères de recherche.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientListPage;