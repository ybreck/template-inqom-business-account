import React, { useState, useMemo } from 'react';
import { mockDeclarationsHistory } from '../data';
import { DeclarationStatus } from '../types';
import { MagnifyingGlassIcon, Bars3Icon, ExclamationCircleIcon, PaperclipIcon, Squares2X2Icon } from '../../../constants/icons';

const getStatusPillClasses = (status: DeclarationStatus) => {
    switch (status) {
        case 'Payée':
            return 'bg-green-100 text-green-700';
        case 'Déposé':
            return 'bg-blue-100 text-blue-700';
        case 'Rejeté':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const formatDetails = (details: string | number) => {
    if (typeof details === 'number') {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(details);
    }
    return details;
};

const DeclarationsHistoryList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

    const filteredDeclarations = useMemo(() => {
        return mockDeclarationsHistory.filter(declaration => {
            const term = searchTerm.toLowerCase();
            if (term === '') return true;
            return (
                declaration.name.toLowerCase().includes(term) ||
                declaration.type.toLowerCase().includes(term) ||
                declaration.status.toLowerCase().includes(term) ||
                declaration.date.toLowerCase().includes(term) ||
                formatDetails(declaration.details).toLowerCase().includes(term)
            );
        });
    }, [searchTerm]);
    
    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Rechercher par type, période, mois..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-theme-primary-500 focus:border-theme-primary-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    <div className="flex items-center p-1 bg-gray-100 rounded-md">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-white text-theme-primary-500 shadow' : 'text-gray-500'}`}
                            aria-label="List view"
                        >
                            <Bars3Icon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white text-theme-primary-500 shadow' : 'text-gray-500'}`}
                            aria-label="Grid view"
                        >
                            <Squares2X2Icon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="divide-y divide-gray-200">
                    {filteredDeclarations.map(declaration => (
                        <div key={declaration.id}>
                            <div className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors">
                                <div className="col-span-12 sm:col-span-4 font-semibold text-gray-800">{declaration.name}</div>
                                <div className="col-span-6 sm:col-span-2 text-sm text-gray-500">{declaration.type}</div>
                                <div className="col-span-6 sm:col-span-3 text-center">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusPillClasses(declaration.status)}`}>
                                        {declaration.status} le {declaration.date}
                                    </span>
                                </div>
                                <div className="col-span-10 sm:col-span-2 text-sm text-gray-700 font-medium text-right">{formatDetails(declaration.details)}</div>
                                <div className="col-span-2 sm:col-span-1 text-center">
                                    <button className="text-gray-400 hover:text-theme-primary-500" aria-label="Pièce jointe">
                                        <PaperclipIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                            {declaration.rejectionReason && (
                                <div className="bg-red-50 p-3 flex items-center text-sm text-red-700">
                                    <ExclamationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0"/>
                                    <span>{declaration.rejectionReason}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                 {filteredDeclarations.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        Aucune déclaration ne correspond à votre recherche.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeclarationsHistoryList;
