import React, { useState } from 'react';
import { ModuleComponentProps } from '../../../types';
import { 
    ChevronRightIcon, 
    MagnifyingGlassIcon, 
    AdjustmentsHorizontalIcon, 
    ChevronDownIcon, 
    DocumentTextIcon,
    ChatBubbleLeftRightIcon,
    PencilIcon
} from '../../constants/icons';
import { documentGroups } from './data';

const DocumentRow = ({ document }: { document: any }) => {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'to_sign':
                return (
                    <div className="flex items-center space-x-3">
                        <button aria-label="Ouvrir le chat" className="text-gray-500 hover:text-gray-800">
                            <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        </button>
                        <span className="w-2.5 h-2.5 bg-orange-500 rounded-full" aria-label="Action requise"></span>
                        <span className="px-3 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-lg border border-orange-200">
                            À signer
                        </span>
                    </div>
                );
            case 'signed':
                return (
                    <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-lg border border-green-200">
                        Signé
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex items-center justify-between py-4 px-4 border-t border-gray-200 hover:bg-gray-50 cursor-pointer" role="button" tabIndex={0}>
            <div className="flex items-center space-x-4">
                <DocumentTextIcon className="w-6 h-6 text-theme-primary-500" />
                <span className="text-sm font-medium text-gray-900">{document.name}</span>
            </div>
            <div className="flex items-center">
                {getStatusBadge(document.status)}
            </div>
        </div>
    );
};

const DocumentGroupComponent = ({ group }: { group: any }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-3 px-4 bg-gray-50 hover:bg-gray-100"
                aria-expanded={isOpen}
                aria-controls={`document-group-${group.year}`}
            >
                <div className="flex items-center space-x-3">
                    <h3 className="font-bold text-gray-900">Exercice {group.year}</h3>
                    <span className="px-2 py-0.5 text-xs font-semibold text-gray-700 bg-gray-200 rounded-md">{group.count}</span>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div id={`document-group-${group.year}`} className={`${isOpen ? 'block' : 'hidden'}`}>
                {group.documents.map((doc: any) => <DocumentRow key={doc.id} document={doc} />)}
            </div>
        </div>
    );
};


const DocumentsComptablesPage: React.FC<ModuleComponentProps> = (props) => {
    const [activeTab, setActiveTab] = useState('actifs');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h1 className="text-3xl font-bold text-gray-800">Documents comptables</h1>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900">Bonjour, Genially Marcel !</h2>
                <p className="text-gray-600 mt-1">Bienvenue sur votre espace de documents comptables.</p>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-lg flex items-center justify-between cursor-pointer hover:bg-indigo-100 transition-colors">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm border border-indigo-100">
                        <PencilIcon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <p className="font-bold text-indigo-800">5 documents prioritaires</p>
                        <p className="text-sm text-indigo-700">En attente de votre signature.</p>
                    </div>
                </div>
                <ChevronRightIcon className="w-6 h-6 text-indigo-700" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button 
                            onClick={() => setActiveTab('actifs')}
                            className={`py-3 px-1 border-b-2 font-semibold text-sm ${activeTab === 'actifs' ? 'border-theme-primary-500 text-theme-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            aria-current={activeTab === 'actifs' ? 'page' : undefined}
                        >
                            Documents actifs
                        </button>
                        <button 
                            onClick={() => setActiveTab('historique')}
                            className={`py-3 px-1 border-b-2 font-semibold text-sm ${activeTab === 'historique' ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' : ''}`}
                            aria-current={activeTab === 'historique' ? 'page' : undefined}
                        >
                            Historique
                        </button>
                    </nav>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="relative flex-grow max-w-md">
                        <label htmlFor="search-doc" className="sr-only">Rechercher un document</label>
                        <input id="search-doc" type="text" placeholder="Rechercher un document..." className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-theme-primary-500"/>
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                        <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-500" />
                        <span>Tous les documents</span>
                        <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                <div className="mt-6 space-y-4">
                    {documentGroups.map(group => <DocumentGroupComponent key={group.year} group={group} />)}
                </div>
            </div>
        </div>
    );
}

export default DocumentsComptablesPage;
