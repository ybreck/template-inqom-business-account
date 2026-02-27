import React, { useState, useMemo } from 'react';
import { ModuleComponentProps, DocumentToClassify } from './types';
import { mockDocumentsToClassify } from './data';
import { 
    ArrowDownTrayIcon, 
    EyeIcon, 
    ListBulletIcon, 
    LinkIcon,
    CloseIcon,
    LockClosedIcon
} from '../../constants/icons';

const formatDate = (isoDate: string, includeTime = false) => {
  const options: Intl.DateTimeFormatOptions = { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  };
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  return new Date(isoDate).toLocaleDateString('fr-FR', options);
};

const CoffreFortPage: React.FC<ModuleComponentProps> = (props) => {
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [selectedDocForLog, setSelectedDocForLog] = useState<DocumentToClassify | null>(null);

    // Filter and sort on every render to get the latest archived documents.
    // This ensures that when the user navigates to this tab, they see the most up-to-date list.
    const archivedDocuments = mockDocumentsToClassify
        .filter(doc => doc.isArchived)
        .sort((a, b) => {
            // Sort by the latest event timestamp, assuming the first event is the latest after unshift
            const dateA = a.eventLog && a.eventLog.length > 0 ? new Date(a.eventLog[0].timestamp).getTime() : 0;
            const dateB = b.eventLog && b.eventLog.length > 0 ? new Date(b.eventLog[0].timestamp).getTime() : 0;
            return dateB - dateA;
        });

    const handleDownloadProof = (doc: DocumentToClassify) => {
        alert(`Téléchargement de la preuve d'archivage pour "${doc.fileName}" (simulation).`);
    };

    const handleViewDocument = (doc: DocumentToClassify) => {
        alert(`Consultation du document : ${doc.fileName} (simulation)`);
    };
    
    const handleOpenLogModal = (doc: DocumentToClassify) => {
        setSelectedDocForLog(doc);
        setIsLogModalOpen(true);
    };

    const handleCloseLogModal = () => {
        setIsLogModalOpen(false);
        setSelectedDocForLog(null);
    };

    const handleShareLink = (doc: DocumentToClassify) => {
        const link = `https://inqom.gestion/share/${doc.id}?expires=${Date.now() + 86400000}`;
        alert(`Lien temporaire généré (valide 24h) :\n\n${link}\n\nLe lien a été copié dans le presse-papiers (simulation).`);
        // navigator.clipboard.writeText(link);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-theme-text">Coffre-fort Numérique</h2>
            
            {archivedDocuments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {archivedDocuments.map(doc => (
                        <div key={doc.id} className="bg-white rounded-lg shadow-md border border-theme-secondary-gray-200 flex flex-col">
                            <div className="p-4 flex-grow">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-base font-semibold text-theme-text flex-grow pr-2">{doc.fileName}</h3>
                                    <LockClosedIcon className="w-5 h-5 text-indigo-500 flex-shrink-0" title="Archivé Légalement" />
                                </div>
                                <div className="mt-2 space-y-1 text-xs text-gray-500">
                                    <p><strong>Type :</strong> {doc.type || 'Non défini'}</p>
                                    <p><strong>Date de dépôt :</strong> {formatDate(doc.uploadDate)}</p>
                                </div>
                            </div>
                            <div className="p-3 bg-slate-50 border-t grid grid-cols-2 gap-2 text-xs">
                                <button onClick={() => handleDownloadProof(doc)} className="flex items-center justify-center p-2 rounded-md bg-white border hover:bg-slate-100"><ArrowDownTrayIcon className="w-4 h-4 mr-1.5"/> Preuve</button>
                                <button onClick={() => handleViewDocument(doc)} className="flex items-center justify-center p-2 rounded-md bg-white border hover:bg-slate-100"><EyeIcon className="w-4 h-4 mr-1.5"/> Consulter</button>
                                <button onClick={() => handleOpenLogModal(doc)} className="flex items-center justify-center p-2 rounded-md bg-white border hover:bg-slate-100"><ListBulletIcon className="w-4 h-4 mr-1.5"/> Journal</button>
                                <button onClick={() => handleShareLink(doc)} className="flex items-center justify-center p-2 rounded-md bg-white border hover:bg-slate-100"><LinkIcon className="w-4 h-4 mr-1.5"/> Partager</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500">Aucun document n'a été archivé légalement.</p>
                </div>
            )}

            {isLogModalOpen && selectedDocForLog && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleCloseLogModal}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Journal des événements : {selectedDocForLog.fileName}</h3>
                            <button onClick={handleCloseLogModal} className="p-1 rounded-full hover:bg-gray-200">
                                <CloseIcon className="w-5 h-5"/>
                            </button>
                        </div>
                        <div className="p-4 max-h-[60vh] overflow-y-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="p-2 text-left font-medium">Date & Heure</th>
                                        <th className="p-2 text-left font-medium">Utilisateur</th>
                                        <th className="p-2 text-left font-medium">Action</th>
                                        <th className="p-2 text-left font-medium">Détails</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {selectedDocForLog.eventLog && selectedDocForLog.eventLog.length > 0 ? (
                                        selectedDocForLog.eventLog.map(log => (
                                            <tr key={log.timestamp}>
                                                <td className="p-2 whitespace-nowrap">{formatDate(log.timestamp, true)}</td>
                                                <td className="p-2">{log.user}</td>
                                                <td className="p-2">{log.action}</td>
                                                <td className="p-2">{log.details || '-'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="p-4 text-center text-gray-500">Aucun événement enregistré.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoffreFortPage;