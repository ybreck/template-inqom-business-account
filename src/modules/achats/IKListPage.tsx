
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ModuleComponentProps, MileageAllowance, MileageAllowanceStatus } from '../../../types';
import { mockMileageAllowances } from './data/ik';
import { 
    MagnifyingGlassIcon, 
    PlusIcon,
    CalendarDaysIcon,
    ArrowPathRoundedSquareIcon,
    BookmarkIcon,
    ChevronDownIcon,
    XMarkIcon as CloseIcon
} from '../../constants/icons';

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

// --- Recurring Trips Data ---
interface RecurringTrip {
  id: string;
  name: string;
  motif: string;
  depart: string;
  arrivee: string;
  distance: number;
}

const mockRecurringTrips: RecurringTrip[] = [
  {
    id: 'rt-1',
    name: 'Visite siège social',
    motif: 'Réunion mensuelle',
    depart: 'Bureau',
    arrivee: 'Siège Social (Paris)',
    distance: 25,
  },
  {
    id: 'rt-2',
    name: 'Fournisseur MatPro',
    motif: 'Contrôle qualité',
    depart: 'Bureau',
    arrivee: 'Entrepôt MatPro',
    distance: 80,
  },
  {
    id: 'rt-3',
    name: 'Client ACME Lyon',
    motif: 'Visite client - Lyon',
    depart: 'Bureau',
    arrivee: 'Lyon',
    distance: 350,
  },
];


interface NewIKModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newAllowance: MileageAllowance) => void;
}

const NewIKModal: React.FC<NewIKModalProps> = ({ isOpen, onClose, onSave }) => {
    const initialState = {
        salarie: '',
        dateTrajet: new Date().toISOString().split('T')[0],
        motif: '',
        vehicule: '',
        depart: '',
        arrivee: '',
        distance: 0,
        taux: 0.58,
        total: 0,
    };

    const [formData, setFormData] = useState(initialState);
    const [isRecurringOpen, setIsRecurringOpen] = useState(false);
    const recurringTripsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (recurringTripsRef.current && !recurringTripsRef.current.contains(event.target as Node)) {
                setIsRecurringOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        const totalAmount = formData.distance * formData.taux;
        setFormData(prev => ({ ...prev, total: totalAmount }));
    }, [formData.distance, formData.taux]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };
    
    const handleSelectRecurring = (trip: RecurringTrip) => {
        setFormData(prev => ({
            ...prev,
            motif: trip.motif,
            depart: trip.depart,
            arrivee: trip.arrivee,
            distance: trip.distance,
        }));
        setIsRecurringOpen(false);
    };

    const handleSwapLocations = () => {
        setFormData(prev => ({ ...prev, depart: prev.arrivee, arrivee: prev.depart }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newAllowance: MileageAllowance = {
            id: `ik-${Date.now()}`,
            collaboratorName: formData.salarie,
            reason: formData.motif,
            amount: formData.total,
            distance: formData.distance,
            status: 'À valider',
            creationDate: new Date().toISOString().split('T')[0],
            travelDate: formData.dateTrajet,
        };
        onSave(newAllowance);
        setFormData(initialState); // Reset form
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all"
                onClick={e => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">Nouvelle indemnité kilométrique</h2>
                            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <CloseIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                    <div className="p-6 space-y-5">
                        <div className="relative inline-block text-left" ref={recurringTripsRef}>
                             <button type="button" onClick={() => setIsRecurringOpen(!isRecurringOpen)} className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200 hover:bg-indigo-100 text-sm font-medium">
                                <BookmarkIcon className="w-4 h-4" />
                                <span>Trajets récurrents</span>
                                <span className="bg-indigo-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{mockRecurringTrips.length}</span>
                                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isRecurringOpen ? 'rotate-180' : ''}`}/>
                             </button>
                             {isRecurringOpen && (
                                <div className="origin-top-left absolute left-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                        {mockRecurringTrips.map(trip => (
                                            <button
                                                type="button"
                                                key={trip.id}
                                                onClick={() => handleSelectRecurring(trip)}
                                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                            >
                                                <p className="font-medium">{trip.name}</p>
                                                <p className="text-xs text-gray-500">{trip.depart} → {trip.arrivee} ({trip.distance} km)</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                             )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="salarie" className="block text-sm font-medium text-gray-700 mb-1">Salarié</label>
                                <input type="text" name="salarie" id="salarie" placeholder="Ex: Marie Durand" value={formData.salarie} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white"/>
                            </div>
                            <div>
                                <label htmlFor="dateTrajet" className="block text-sm font-medium text-gray-700 mb-1">Date du trajet</label>
                                <input type="date" name="dateTrajet" id="dateTrajet" value={formData.dateTrajet} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white"/>
                            </div>
                             <div>
                                <label htmlFor="motif" className="block text-sm font-medium text-gray-700 mb-1">Motif du déplacement</label>
                                <input type="text" name="motif" id="motif" placeholder="Ex: Visite client ACME" value={formData.motif} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white"/>
                            </div>
                            <div>
                                <label htmlFor="vehicule" className="block text-sm font-medium text-gray-700 mb-1">Nom du véhicule</label>
                                <input type="text" name="vehicule" id="vehicule" placeholder="Ex: Peugeot 3008" value={formData.vehicule} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white"/>
                            </div>
                            <div>
                                <label htmlFor="depart" className="block text-sm font-medium text-gray-700 mb-1">Lieu de départ</label>
                                <input type="text" name="depart" id="depart" placeholder="Ex: Bureau" value={formData.depart} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white"/>
                            </div>
                            <div className="relative">
                                <label htmlFor="arrivee" className="block text-sm font-medium text-gray-700 mb-1">Lieu d'arrivée</label>
                                <input type="text" name="arrivee" id="arrivee" placeholder="Ex: Lyon" value={formData.arrivee} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white"/>
                                <button type="button" onClick={handleSwapLocations} className="absolute top-8 right-2 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200">
                                    <ArrowPathRoundedSquareIcon className="w-4 h-4 text-gray-600 transform rotate-90" />
                                </button>
                            </div>
                            <div>
                                <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
                                <input type="number" name="distance" id="distance" placeholder="Ex: 350" value={formData.distance || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white"/>
                            </div>
                            <div>
                                <label htmlFor="taux" className="block text-sm font-medium text-gray-700 mb-1">Taux</label>
                                <input type="text" name="taux" id="taux" value={`${formData.taux.toFixed(2)} € / km`} readOnly className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"/>
                            </div>
                             <div className="md:col-span-2">
                                <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-1">Montant total</label>
                                <input type="text" name="total" id="total" value={`${formData.total.toFixed(2)} €`} readOnly className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"/>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-b-xl flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">Total : {formatCurrency(formData.total)}</span>
                        <div className="flex space-x-2">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">Annuler</button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600">Enregistrer</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};


const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const dateObj = new Date(dateString.replace(/-/g, '/'));
  return dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
};

const STATUS_PROGRESSION: { key: MileageAllowanceStatus, display: string }[] = [
  { key: 'À valider', display: 'À valider' },
  { key: 'Approuvée', display: 'Approuvée' },
  { key: 'Remboursée', display: 'Remboursée' },
];

const getStatusOrder = (status: MileageAllowanceStatus): number => {
  const index = STATUS_PROGRESSION.findIndex(s => s.key === status);
  if (index !== -1) return index;
  if (status === 'Rejetée') return 0; // Considered at the same level as 'À valider' but as a problem state
  return -1; 
};

const StatusProgressionDisplay: React.FC<{ status: MileageAllowanceStatus }> = ({ status }) => {
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


const IKListPage: React.FC<ModuleComponentProps> = ({ onSubNavigate }) => {
  const [allowances, setAllowances] = useState<MileageAllowance[]>(mockMileageAllowances);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredAllowances = useMemo(() => {
    return allowances.filter(item => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = searchTermLower === '' ||
        item.collaboratorName.toLowerCase().includes(searchTermLower) ||
        item.reason.toLowerCase().includes(searchTermLower) ||
        item.amount.toString().includes(searchTermLower) ||
        item.distance.toString().includes(searchTermLower);

      const travelDate = new Date(item.travelDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);
      const matchesDate = (!start || travelDate >= start) && (!end || travelDate <= end);
      
      return matchesSearch && matchesDate;
    }).sort((a,b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
  }, [allowances, searchTerm, startDate, endDate]);

  const handleStatusChange = (id: string, newStatus: MileageAllowanceStatus) => {
    setAllowances(prev => prev.map(item => {
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
  
  const handleSaveNewIK = (newAllowance: MileageAllowance) => {
    setAllowances(prev => [newAllowance, ...prev]);
    setIsModalOpen(false);
  };


  return (
    <div className="space-y-6">
        <NewIKModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveNewIK}
        />
        <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex flex-wrap items-end gap-3">
                <div className="relative flex-grow min-w-[250px]">
                    <label htmlFor="search-ik" className="sr-only">Rechercher</label>
                    <input
                        type="text"
                        id="search-ik"
                        placeholder="Rechercher par motif, collaborateur..."
                        className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-theme-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                <div className="relative">
                    <label htmlFor="start-date" className="sr-only">Date de début</label>
                    <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="text-sm text-gray-500 border border-gray-300 rounded-md py-2 px-3 focus:ring-1 focus:ring-theme-primary-500"/>
                </div>
                 <span className="text-gray-400 pb-2">~</span>
                <div className="relative">
                    <label htmlFor="end-date" className="sr-only">Date de fin</label>
                    <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="text-sm text-gray-500 border border-gray-300 rounded-md py-2 px-3 focus:ring-1 focus:ring-theme-primary-500"/>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 transition-colors"
                    >
                    <PlusIcon className="w-5 h-5 mr-1.5" />
                    Indemnité kilométrique
                </button>
            </div>
        </div>
      
      <div className="space-y-3">
        {filteredAllowances.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
            <div className="p-4 flex items-start">
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-base font-semibold text-theme-text">
                                {item.collaboratorName} <span className="text-gray-600 font-normal">- {item.reason}</span>
                            </h3>
                        </div>
                        <div className="text-right ml-4">
                             <p className="text-lg font-bold text-theme-text whitespace-nowrap">{formatCurrency(item.amount)}</p>
                             <p className="text-xs text-gray-500">{item.distance} km</p>
                        </div>
                    </div>

                    <div className="mt-2">
                        <StatusProgressionDisplay status={item.status} />
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                             <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md">Création: <strong className="font-semibold">{formatDate(item.creationDate)}</strong></span>
                             <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md">Trajet: <strong className="font-semibold">{formatDate(item.travelDate)}</strong></span>
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
        {filteredAllowances.length === 0 && (
            <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                Aucune indemnité kilométrique ne correspond à vos critères.
            </div>
        )}
      </div>
    </div>
  );
};

export default IKListPage;
