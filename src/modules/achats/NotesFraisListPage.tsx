import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ModuleComponentProps, ExpenseReport, ExpenseReportStatus, EditableExpenseReport, ExpenseReportLineItem } from '../../../types';
import { mockExpenseReports } from './data/notesFrais';
import { 
    MagnifyingGlassIcon, 
    PlusIcon,
    ArrowUpTrayIcon,
    TrashIcon,
    DocumentTextIcon,
    XMarkIcon as CloseIcon,
} from '../../constants/icons';

// Icons for approve/reject buttons
const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


// Helper functions
const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const dateObj = new Date(dateString.replace(/-/g, '/'));
  return dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
};

// Status Progression Display Component
const STATUS_PROGRESSION: { key: ExpenseReportStatus, display: string }[] = [
  { key: 'À valider', display: 'À valider' },
  { key: 'Approuvée', display: 'Approuvée' },
  { key: 'Remboursée', display: 'Remboursée' },
];

const getStatusOrder = (status: ExpenseReportStatus): number => {
  const index = STATUS_PROGRESSION.findIndex(s => s.key === status);
  if (index !== -1) return index;
  if (status === 'Rejetée') return 0;
  return -1; 
};

const StatusProgressionDisplay: React.FC<{ status: ExpenseReportStatus }> = ({ status }) => {
  const currentStatusOrder = getStatusOrder(status);

  if (status === 'Rejetée') {
    return (
      <span className="bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">Rejetée</span>
    );
  }

  const displaySequence = STATUS_PROGRESSION.map((step, index) => ({
    label: step.display,
    achieved: currentStatusOrder >= index,
    current: currentStatusOrder === index,
  }));

  const getStatusColor = (step: typeof displaySequence[0]): string => {
    if (!step.current) return '';
    if (step.label === 'À valider') return 'bg-orange-100 text-orange-700';
    if (step.label === 'Approuvée') return 'bg-theme-primary-100 text-theme-primary-700';
    if (step.label === 'Remboursée') return 'bg-green-100 text-green-700';
    return '';
  };
  
  return (
    <div className="flex flex-wrap items-center text-xs gap-x-1">
      {displaySequence.map((step, index) => (
        <React.Fragment key={index}>
          <span className={`
            ${step.achieved ? 'font-bold' : 'text-gray-400'} 
            ${step.current ? `${getStatusColor(step)} px-1.5 py-0.5 rounded` : ''}
            ${step.achieved && !step.current ? 'text-theme-text' : ''}
          `}>
            {step.label}
          </span>
          {index < displaySequence.length - 1 && (
            <span className={`mx-0.5 ${step.achieved && displaySequence[index+1]?.achieved ? 'text-theme-text' : 'text-gray-400'}`}>&rarr;</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// --- New Expense Report Modal Component ---
const initialLineItem: ExpenseReportLineItem = {
    id: `line-${Date.now()}`,
    type: 'Restaurant',
    date: new Date().toISOString().split('T')[0],
    motif: '',
    ht: 0,
    tvaRate: 20,
    ttc: 0,
};

interface NewExpenseReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newReport: ExpenseReport) => void;
}

const NewExpenseReportModal: React.FC<NewExpenseReportModalProps> = ({ isOpen, onClose, onSave }) => {
    const [step, setStep] = useState(1);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [reportData, setReportData] = useState<EditableExpenseReport>({
        id: `nf-${Date.now()}`,
        collaboratorName: '',
        emissionDate: new Date().toISOString().split('T')[0],
        lineItems: [{ ...initialLineItem }],
        attachments: [],
    });
    const [totalTTC, setTotalTTC] = useState(0);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const resetState = useCallback(() => {
        setStep(1);
        setUploadedFiles([]);
        setReportData({
            id: `nf-${Date.now()}`,
            collaboratorName: '',
            emissionDate: new Date().toISOString().split('T')[0],
            lineItems: [{ ...initialLineItem, id: `line-${Date.now()}` }],
            attachments: [],
        });
    }, []);

    const handleClose = () => {
        resetState();
        onClose();
    };

    const handleFilesSelected = (files: FileList | null) => {
        if (files) {
            setUploadedFiles(prev => [...prev, ...Array.from(files)]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFilesSelected(e.dataTransfer.files);
    };

    const handleProceedToStep2 = () => {
        setReportData(prev => ({ ...prev, attachments: uploadedFiles }));
        setStep(2);
    };

    const handleLineItemChange = (index: number, field: keyof ExpenseReportLineItem, value: any) => {
        const updatedItems = [...reportData.lineItems];
        const itemToUpdate = { ...updatedItems[index] };
        (itemToUpdate as any)[field] = value;
    
        if (field === 'ht' || field === 'tvaRate') {
            const ht = field === 'ht' ? parseFloat(value) || 0 : itemToUpdate.ht;
            const tvaRate = field === 'tvaRate' ? parseFloat(value) || 0 : itemToUpdate.tvaRate;
            itemToUpdate.ttc = ht * (1 + tvaRate / 100);
        }
        updatedItems[index] = itemToUpdate;
        setReportData(prev => ({...prev, lineItems: updatedItems}));
    };
    
    useEffect(() => {
        const newTotal = reportData.lineItems.reduce((sum, item) => sum + item.ttc, 0);
        setTotalTTC(newTotal);
    }, [reportData.lineItems]);

    const addLineItem = () => {
        setReportData(prev => ({
            ...prev,
            lineItems: [...prev.lineItems, { ...initialLineItem, id: `line-${Date.now()}` }]
        }));
    };

    const removeLineItem = (id: string) => {
        setReportData(prev => ({
            ...prev,
            lineItems: prev.lineItems.filter(item => item.id !== id)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newReportForList: ExpenseReport = {
            id: reportData.id,
            collaboratorName: reportData.collaboratorName || 'Employé non spécifié',
            category: reportData.lineItems.length > 1 ? 'Multiple' : reportData.lineItems[0]?.type || 'Autre',
            amount: totalTTC,
            status: 'À valider',
            creationDate: new Date().toISOString().split('T')[0],
            period: new Date(reportData.emissionDate).toLocaleString('fr-FR', { month: 'long', year: 'numeric' }),
        };
        onSave(newReportForList);
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={handleClose} role="dialog">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl transform transition-all" onClick={e => e.stopPropagation()}>
                {step === 1 ? (
                    // Step 1: Upload
                    <div>
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">Étape 1: Ajouter des pièces jointes</h2>
                            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600"><CloseIcon className="w-6 h-6" /></button>
                        </div>
                        <div className="p-8">
                            <div 
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center"
                            >
                                <ArrowUpTrayIcon className="w-12 h-12 mx-auto text-gray-400"/>
                                <p className="mt-4 text-gray-600">Glissez-déposez vos fichiers ici</p>
                                <p className="text-sm text-gray-500 mt-1">ou</p>
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-2 text-sm font-medium text-theme-primary-600 hover:underline">parcourir vos fichiers</button>
                                <input type="file" ref={fileInputRef} onChange={(e) => handleFilesSelected(e.target.files)} multiple className="hidden" />
                            </div>
                            {uploadedFiles.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-700">Fichiers sélectionnés :</p>
                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                        {uploadedFiles.map((file, i) => <li key={i}>{file.name}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="p-6 bg-gray-50 rounded-b-xl flex justify-end items-center space-x-3">
                            <button type="button" onClick={handleProceedToStep2} className="text-sm font-medium text-gray-700 hover:underline">Continuer sans pièce jointe</button>
                            <button type="button" onClick={handleProceedToStep2} className="px-5 py-2 text-sm font-medium text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600">Continuer</button>
                        </div>
                    </div>
                ) : (
                    // Step 2: Details
                     <form onSubmit={handleSubmit}>
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">Étape 2: Détails de la note de frais</h2>
                            <button type="button" onClick={handleClose} className="text-gray-400 hover:text-gray-600"><CloseIcon className="w-6 h-6" /></button>
                        </div>
                        <div className="p-6 flex gap-6">
                            <div className="flex-[2] space-y-4">
                                {/* Main form */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="collaboratorName" className="block text-sm font-medium text-gray-700 mb-1">Salarié</label>
                                        <input
                                            type="text"
                                            id="collaboratorName"
                                            name="collaboratorName"
                                            value={reportData.collaboratorName}
                                            onChange={e => setReportData(prev => ({...prev, collaboratorName: e.target.value}))}
                                            placeholder="Ex: Jean Dupont"
                                            className="w-full p-2 border border-gray-300 rounded-md"/>
                                    </div>
                                     <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date d'émission</label>
                                        <input type="date" value={reportData.emissionDate} onChange={e => setReportData(prev => ({...prev, emissionDate: e.target.value}))} className="w-full p-2 border border-gray-300 rounded-md"/>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {/* Line Items */}
                                    {reportData.lineItems.map((item, index) => (
                                        <div key={item.id} className="grid grid-cols-12 gap-2 p-2 border rounded-md items-center">
                                            <select value={item.type} onChange={e => handleLineItemChange(index, 'type', e.target.value)} className="col-span-2 p-1.5 border-gray-300 rounded-md text-sm"><option>Restaurant</option><option>Transport</option><option>Hôtel</option><option>Autre</option></select>
                                            <input type="date" value={item.date} onChange={e => handleLineItemChange(index, 'date', e.target.value)} className="col-span-2 p-1.5 border-gray-300 rounded-md text-sm"/>
                                            <input type="text" placeholder="Motif" value={item.motif} onChange={e => handleLineItemChange(index, 'motif', e.target.value)} className="col-span-3 p-1.5 border-gray-300 rounded-md text-sm"/>
                                            <input type="number" placeholder="HT" value={item.ht || ''} onChange={e => handleLineItemChange(index, 'ht', e.target.value)} className="col-span-1 p-1.5 border-gray-300 rounded-md text-sm text-right"/>
                                            <select value={item.tvaRate} onChange={e => handleLineItemChange(index, 'tvaRate', e.target.value)} className="col-span-1 p-1.5 border-gray-300 rounded-md text-sm"><option value={20}>20%</option><option value={10}>10%</option><option value={5.5}>5.5%</option><option value={0}>0%</option></select>
                                            <input type="text" placeholder="TTC" value={item.ttc.toFixed(2)} readOnly className="col-span-2 p-1.5 border-gray-300 rounded-md text-sm text-right bg-gray-100"/>
                                            <button type="button" onClick={() => removeLineItem(item.id)} className="col-span-1 text-red-500 hover:text-red-700 p-2"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={addLineItem} className="text-sm font-medium text-theme-primary-600 hover:underline">+ Ajouter une ligne de dépense</button>
                            </div>
                            <div className="flex-1 space-y-3">
                                {/* Attachments */}
                                <h4 className="text-base font-medium text-gray-800">Pièces jointes ({uploadedFiles.length})</h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                    {uploadedFiles.map((file, i) => (
                                        <div key={i} className="flex items-center p-2 bg-gray-100 rounded-md">
                                            <DocumentTextIcon className="w-5 h-5 text-gray-500 mr-2"/>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-700 truncate">{file.name}</p>
                                                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                            <button type="button" onClick={() => setUploadedFiles(files => files.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 ml-2"><CloseIcon className="w-4 h-4"/></button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" className="w-full p-2 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">+ Ajouter</button>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-b-xl flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-800">Total TTC : {formatCurrency(totalTTC)}</span>
                            <div className="flex space-x-2">
                                <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">Annuler</button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600">Enregistrer</button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};


// Main Page Component
const NotesFraisListPage: React.FC<ModuleComponentProps> = ({ onSubNavigate }) => {
  const [expenseReports, setExpenseReports] = useState<ExpenseReport[]>(mockExpenseReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);


  const filteredExpenseReports = useMemo(() => {
    return expenseReports.filter(item => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = searchTermLower === '' ||
        item.collaboratorName.toLowerCase().includes(searchTermLower) ||
        item.category.toLowerCase().includes(searchTermLower) ||
        item.amount.toString().includes(searchTermLower);

      const creationDate = new Date(item.creationDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);
      const matchesDate = (!start || creationDate >= start) && (!end || creationDate <= end);
      
      return matchesSearch && matchesDate;
    }).sort((a,b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
  }, [expenseReports, searchTerm, startDate, endDate]);

  const handleStatusChange = (id: string, newStatus: ExpenseReportStatus) => {
    setExpenseReports(prev => prev.map(item => {
        if (item.id === id) {
            const updatedItem = { ...item, status: newStatus };
            if (newStatus === 'Remboursée') {
                updatedItem.reimbursementDate = new Date().toISOString().split('T')[0];
            }
            return updatedItem;
        }
        return item;
    }));
  };
  
  const handleSaveNewReport = (newReport: ExpenseReport) => {
    setExpenseReports(prev => [newReport, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
        <NewExpenseReportModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveNewReport}
        />
        <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex flex-wrap items-end gap-3">
                <div className="relative flex-grow min-w-[250px]">
                    <label htmlFor="search-nf" className="sr-only">Rechercher</label>
                    <input
                        type="text"
                        id="search-nf"
                        placeholder="Rechercher par description, collaborateurs, montant, date..."
                        className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-theme-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                <div className="relative">
                    <label htmlFor="start-date-nf" className="sr-only">Date de début</label>
                    <input type="date" id="start-date-nf" value={startDate} onChange={e => setStartDate(e.target.value)} className="text-sm text-gray-500 border border-gray-300 rounded-md py-2 px-3 focus:ring-1 focus:ring-theme-primary-500"/>
                </div>
                 <span className="text-gray-400 pb-2">~</span>
                <div className="relative">
                    <label htmlFor="end-date-nf" className="sr-only">Date de fin</label>
                    <input type="date" id="end-date-nf" value={endDate} onChange={e => setEndDate(e.target.value)} className="text-sm text-gray-500 border border-gray-300 rounded-md py-2 px-3 focus:ring-1 focus:ring-theme-primary-500"/>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 transition-colors"
                    >
                    <PlusIcon className="w-5 h-5 mr-1.5" />
                    Note de frais
                </button>
            </div>
        </div>
      
      <div className="space-y-3">
        {filteredExpenseReports.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
            <div className="p-4 flex items-start">
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-base font-semibold text-theme-text">
                                {item.collaboratorName} <span className="text-gray-600 font-normal">- {item.category}</span>
                            </h3>
                        </div>
                        <div className="text-right ml-4">
                             <p className="text-lg font-bold text-theme-text whitespace-nowrap">{formatCurrency(item.amount)}</p>
                        </div>
                    </div>

                    <div className="mt-2">
                        <StatusProgressionDisplay status={item.status} />
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                             <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md">Création: <strong className="font-semibold">{formatDate(item.creationDate)}</strong></span>
                             <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md">Période: <strong className="font-semibold">{item.period}</strong></span>
                             {item.reimbursementDate && <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md">Remboursement: <strong className="font-semibold">{formatDate(item.reimbursementDate)}</strong></span>}
                        </div>

                        <div className="flex items-center space-x-2">
                             {item.status === 'À valider' && (
                                <>
                                    <button onClick={() => handleStatusChange(item.id, 'Approuvée')} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200" aria-label="Approuver"><CheckIcon className="w-5 h-5"/></button>
                                    <button onClick={() => handleStatusChange(item.id, 'Rejetée')} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200" aria-label="Rejeter"><XMarkIcon className="w-5 h-5"/></button>
                                </>
                             )}
                              {item.status === 'Approuvée' && (
                                <button onClick={() => handleStatusChange(item.id, 'Remboursée')} className="px-3 py-1.5 text-xs font-semibold text-white bg-green-500 hover:bg-green-600 rounded-md">Rembourser</button>
                             )}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        ))}
        {filteredExpenseReports.length === 0 && (
            <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                Aucune note de frais ne correspond à vos critères.
            </div>
        )}
      </div>
    </div>
  );
};

export default NotesFraisListPage;
