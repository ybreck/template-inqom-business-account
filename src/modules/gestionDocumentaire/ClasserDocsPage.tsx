// FIX: Add 'useMemo' to the React import.
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ModuleComponentProps, DocumentToClassify, DocumentType, DocumentStatus } from './types';
import { mockDocumentsToClassify } from './data';
import { EyeIcon, MagnifyingGlassIcon, FilterIcon, PlusIcon, ChevronDownIcon, ArrowPathIcon, PencilIcon, LockClosedIcon, ArrowUpTrayIcon } from '../../constants/icons';

const formatDate = (isoDate: string) => new Date(isoDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const documentTypeOptions: DocumentType[] = [
  'Facture Achat', 'Facture Vente', 'Note de Frais', 'Relevé Bancaire', 'Bulletin de Paie', 'Social', 'Juridique', 'Autre'
];
const documentStatusOptions: DocumentStatus[] = ['À classer', 'Classé'];
const documentSourceOptions: string[] = ['Email', 'Upload Manuel', 'Collecteur'];


const ClasserDocsPage: React.FC<ModuleComponentProps> = (props) => {
  const [documents, setDocuments] = useState<DocumentToClassify[]>(mockDocumentsToClassify);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [visibleFilters, setVisibleFilters] = useState<string[]>(['type']); // Default filter
  const [filterValues, setFilterValues] = useState({
    types: [] as (DocumentType | null)[],
    sources: [] as string[],
    statuses: [] as DocumentStatus[],
    startDate: '',
    endDate: '',
  });
  const [openFilterPopover, setOpenFilterPopover] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpenFilterPopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTypeChange = (docId: string, newType: DocumentType) => {
    setDocuments(docs => docs.map(doc => 
      doc.id === docId 
        ? { ...doc, type: newType, status: 'Classé' }
        : doc
    ));
    setEditingDocId(null);
  };
  
  const handleArchiveDocument = (docId: string) => {
    // Simulate API call to archive by modifying the shared mock data
    const docIndex = mockDocumentsToClassify.findIndex(d => d.id === docId);
    if (docIndex !== -1) {
        mockDocumentsToClassify[docIndex].isArchived = true;
        // Add an event log for traceability
        mockDocumentsToClassify[docIndex].eventLog.unshift({
            timestamp: new Date().toISOString(),
            user: 'Marcel GENIALLY',
            action: 'Archivage Légal',
            details: 'Document envoyé au CFN partenaire.'
        });
    }

    // Update local state to reflect the change immediately on this page
    setDocuments([...mockDocumentsToClassify]);
  };


  const handleTypeFilterChange = (type: DocumentType | null) => {
    setFilterValues(prev => {
        const newTypes = new Set(prev.types);
        if (newTypes.has(type)) {
            newTypes.delete(type);
        } else {
            newTypes.add(type);
        }
        return { ...prev, types: Array.from(newTypes) };
    });
  };

  const handleSourceFilterChange = (source: string) => {
      setFilterValues(prev => ({
          ...prev,
          sources: prev.sources.includes(source)
              ? prev.sources.filter(s => s !== source)
              : [...prev.sources, source]
      }));
  };
  
   const handleStatusFilterChange = (status: DocumentStatus) => {
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

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const { types, sources, statuses, startDate, endDate } = filterValues;
      const searchTermLower = searchTerm.toLowerCase();

      const matchesSearch = searchTermLower === '' ||
        doc.fileName.toLowerCase().includes(searchTermLower) ||
        doc.source.toLowerCase().includes(searchTermLower) ||
        doc.status.toLowerCase().includes(searchTermLower) ||
        (doc.type && doc.type.toLowerCase().includes(searchTermLower)) ||
        formatDate(doc.uploadDate).includes(searchTermLower);
        
      const matchesType = types.length === 0 || types.includes(doc.type);
      const matchesSource = sources.length === 0 || sources.includes(doc.source);
      const matchesStatus = statuses.length === 0 || statuses.includes(doc.status);
      
      const uploadDate = new Date(doc.uploadDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if(start) start.setHours(0,0,0,0);
      if(end) end.setHours(23,59,59,999);
      const matchesDate = (!start || uploadDate >= start) && (!end || uploadDate <= end);

      return matchesSearch && matchesType && matchesSource && matchesStatus && matchesDate;
    });
  }, [documents, searchTerm, filterValues]);

  const resetFilters = () => {
    setVisibleFilters(['type']);
    setFilterValues({ types: [], sources: [], statuses: [], startDate: '', endDate: '' });
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
      source: "Source",
      date: "Date de dépôt",
      status: "Statut",
  };

  const getFilterButtonText = useCallback((filterKey: string) => {
      const { types, sources, statuses } = filterValues;
      switch (filterKey) {
          case 'type':
              if (types.length === 0) return 'Type';
              if (types.length === 1) return `Type: ${types[0] || 'Non défini'}`;
              return `Types: ${types.length} sélectionnés`;
          case 'source':
              if (sources.length === 0) return 'Source';
              if (sources.length === 1) return `Source: ${sources[0]}`;
              return `Sources: ${sources.length} sélectionnées`;
          case 'status':
              if (statuses.length === 0) return 'Statut';
              if (statuses.length === 1) return `Statut: ${statuses[0]}`;
              return `Statuts: ${statuses.length} sélectionnées`;
          default:
              return 'Filtre';
      }
  }, [filterValues]);

  const isFilterActive = (filterKey: string): boolean => {
      const { types, sources, statuses, startDate, endDate } = filterValues;
      switch (filterKey) {
          case 'type': return types.length > 0;
          case 'source': return sources.length > 0;
          case 'status': return statuses.length > 0;
          case 'date': return !!startDate || !!endDate;
          default: return false;
      }
  };

  const renderFilterPopoverContent = (filterKey: string) => {
      switch (filterKey) {
          case 'type':
              return (
                  <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-700">Filtrer par type</label>
                      <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
                          {documentTypeOptions.map(type => (
                              <label key={type} className="flex items-center p-1.5 rounded-md hover:bg-gray-100 cursor-pointer">
                                  <input type="checkbox" checked={filterValues.types.includes(type)} onChange={() => handleTypeFilterChange(type)} className="h-4 w-4 text-theme-primary-600 border-gray-300 rounded focus:ring-theme-primary-500" />
                                  <span className="ml-2 text-sm text-gray-700">{type}</span>
                              </label>
                          ))}
                      </div>
                  </div>
              );
          case 'source':
              return (
                  <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-700">Filtrer par source</label>
                      <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
                          {documentSourceOptions.map(source => (
                              <label key={source} className="flex items-center p-1.5 rounded-md hover:bg-gray-100 cursor-pointer">
                                  <input type="checkbox" checked={filterValues.sources.includes(source)} onChange={() => handleSourceFilterChange(source)} className="h-4 w-4 text-theme-primary-600 border-gray-300 rounded focus:ring-theme-primary-500" />
                                  <span className="ml-2 text-sm text-gray-700">{source}</span>
                              </label>
                          ))}
                      </div>
                  </div>
              );
          case 'status':
              return (
                  <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-700">Filtrer par statut</label>
                      <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
                          {documentStatusOptions.map(status => (
                              <label key={status} className="flex items-center p-1.5 rounded-md hover:bg-gray-100 cursor-pointer">
                                  <input type="checkbox" checked={filterValues.statuses.includes(status)} onChange={() => handleStatusFilterChange(status)} className="h-4 w-4 text-theme-primary-600 border-gray-300 rounded focus:ring-theme-primary-500" />
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

  const handleViewDocument = (doc: DocumentToClassify) => {
    alert(`Affichage du document : ${doc.fileName} (simulation)`);
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        alert(`Fichier "${file.name}" sélectionné pour l'upload (simulation).`);
        
        const newDoc: DocumentToClassify = {
            id: `doc_${Date.now()}`,
            fileName: file.name,
            uploadDate: new Date().toISOString(),
            source: 'Upload Manuel',
            status: 'À classer',
            type: null,
            previewUrl: 'https://placehold.co/100x141/E2E8F0/4A5568?text=NEW',
            isArchived: false,
            eventLog: [
                { timestamp: new Date().toISOString(), user: 'Upload Manuel', action: 'Dépôt' },
            ]
        };
        
        // Persist change to mock data and update local state
        mockDocumentsToClassify.unshift(newDoc);
        setDocuments(prev => [newDoc, ...prev]);

        // Clear input value
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }
  };

  const unclassifiedCount = useMemo(() => documents.filter(d => d.status === 'À classer').length, [documents]);

  return (
    <div className="space-y-6">
      <input type="file" ref={fileInputRef} onChange={handleFileSelected} className="hidden" accept="image/*,.pdf,.doc,.docx" />
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-semibold text-theme-text">Mes documents</h2>
          <p className="text-sm text-gray-500 mt-1">
            {unclassifiedCount > 0 
              ? `Il vous reste ${unclassifiedCount} document(s) à classer.`
              : `Tous vos documents sont classés. Bravo !`
            }
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center px-4 py-2 text-sm font-semibold text-[color:var(--color-primary-contrast-text)] bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 transition-colors"
        >
          <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
          Uploader un document
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2">
            <div className="relative flex-grow">
                <input
                    type="text"
                    placeholder="Rechercher par nom, source, type, statut, date..."
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
                            if (filterKey === 'type' || filterKey === 'source' || filterKey === 'status') {
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
                                        <label htmlFor="start-date" className="text-sm font-medium text-gray-500 pl-2">Date de dépôt</label>
                                        <input type="date" id="start-date" value={filterValues.startDate} onChange={e => setFilterValues(prev => ({...prev, startDate: e.target.value}))} className="text-sm border-0 rounded-md bg-gray-50 focus:ring-1 focus:ring-theme-primary-500 p-1"/>
                                        <span className="text-gray-400">au</span>
                                        <input type="date" id="end-date" value={filterValues.endDate} onChange={e => setFilterValues(prev => ({...prev, endDate: e.target.value}))} className="text-sm border-0 rounded-md bg-gray-50 focus:ring-1 focus:ring-theme-primary-500 p-1"/>
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
        {filteredDocuments.map((doc) => {
          const isEditing = editingDocId === doc.id;
          return (
            <div
              key={doc.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-theme-secondary-gray-200"
              role="article"
            >
              <div className="p-4 flex items-start space-x-4">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-semibold text-theme-text truncate" title={doc.fileName}>
                        {doc.fileName}
                      </h3>
                      <p className="text-xs text-gray-500">{doc.source}</p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {doc.isArchived && (
                        <div className="p-1.5 bg-indigo-500 text-white rounded-full shadow" title="Archivé légalement">
                          <LockClosedIcon className="w-4 h-4" />
                        </div>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); handleViewDocument(doc); }} className="text-theme-primary-600 hover:text-theme-primary-800 p-1" title="Voir le document">
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        doc.status === 'Classé' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                        {doc.status}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex justify-between items-end">
                      <div className="text-xs">
                          <span className="bg-theme-secondary-gray-100 text-theme-secondary-gray-700 px-2 py-1 rounded-md">
                              Déposé le: <strong className="font-semibold">{formatDate(doc.uploadDate)}</strong>
                          </span>
                      </div>
                      
                      {isEditing ? (
                         <div className="w-1/2">
                            <select
                              value={doc.type || ''}
                              onChange={(e) => handleTypeChange(doc.id, e.target.value as DocumentType)}
                              onBlur={() => setEditingDocId(null)}
                              className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-1 focus:ring-theme-primary-500 focus:border-theme-primary-500"
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                            >
                              <option value="" disabled>-- Classer comme --</option>
                              {documentTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                         </div>
                      ) : doc.type === null ? (
                         <div className="flex flex-wrap gap-2 justify-end max-w-[60%]">
                            {documentTypeOptions.map(opt => (
                                <button
                                    key={opt}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTypeChange(doc.id, opt);
                                    }}
                                    className="px-2 py-1 text-xs font-medium text-theme-primary-700 bg-theme-primary-50 rounded-md border border-theme-primary-200 hover:bg-theme-primary-100 transition-colors"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                      ) : (
                          <div className="flex items-center space-x-2">
                              <span className="flex items-center text-sm font-semibold text-theme-text">
                                  {doc.type}
                              </span>
                              <button 
                                  onClick={(e) => { e.stopPropagation(); setEditingDocId(doc.id); }}
                                  className="p-1 text-gray-500 hover:text-theme-primary-600 rounded-full hover:bg-gray-100"
                                  aria-label="Modifier le type du document"
                              >
                                  <PencilIcon className="w-4 h-4" />
                              </button>
                          </div>
                      )}
                  </div>
                   {doc.status === 'Classé' && !doc.isArchived && (
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchiveDocument(doc.id);
                        }}
                        className="flex items-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-md border border-indigo-200 hover:bg-indigo-200 transition-colors"
                      >
                        <LockClosedIcon className="w-3.5 h-3.5 mr-1.5" />
                        Archiver légalement
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

       {filteredDocuments.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          Aucun document ne correspond à vos critères de recherche.
        </div>
      )}
    </div>
  );
};

export default ClasserDocsPage;