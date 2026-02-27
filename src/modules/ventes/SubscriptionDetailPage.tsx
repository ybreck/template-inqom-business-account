import React, { useEffect, useState } from 'react';
import { ModuleComponentProps, Subscription, SubscriptionInvoice, SubscriptionProduct, SubscriptionStatus } from '../../../types';
import { mockSubscriptions } from './data/subscriptions';
import { ArrowLeftIcon } from '../../constants/icons';

interface SubscriptionDetailPageProps extends ModuleComponentProps {}

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const getStatusBadgeStyle = (status: SubscriptionStatus): { className: string; label: string } => {
  switch (status) {
    case 'Actif': return { className: 'bg-green-100 text-green-800', label: 'Actif' };
    case 'En pause': return { className: 'bg-yellow-100 text-yellow-800', label: 'En pause' };
    case 'Résilié': return { className: 'bg-gray-200 text-gray-700', label: 'Résilié' };
    default: return { className: 'bg-gray-100 text-gray-700', label: 'Inconnu' };
  }
};

interface KpiCardProps {
    title: string;
    value: string | number;
    objective?: string | number;
    change?: string;
    progress?: boolean;
    changeUp?: boolean;
    isCurrency?: boolean;
    progressLabel?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, objective, change, progress, changeUp, isCurrency = true, progressLabel }) => {
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/\s/g, '').replace('€', '')) : value;
    const numericObjective = objective ? (typeof objective === 'string' ? parseFloat(objective.replace(/\s/g, '').replace('€', '')) : objective) : 0;
    const percentage = numericObjective > 0 ? (numericValue / numericObjective) * 100 : 0;

    return (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-sm text-gray-500">{title}</p>
            <div className="flex items-baseline justify-between mt-1">
                <p className="text-2xl font-bold text-gray-800">
                    {isCurrency ? formatCurrency(numericValue) : numericValue.toLocaleString('fr-FR')}
                </p>
                {change && (
                    <span className={`text-sm font-semibold ${changeUp ? 'text-green-500' : 'text-red-500'}`}>{change}</span>
                )}
            </div>
            {progress && (
                <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Objectif {objective}</span>
                        <span>{percentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                    </div>
                </div>
            )}
            {progressLabel && (
                 <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Objectif {objective}</span>
                        <span>{progressLabel}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div className="bg-teal-400 h-1.5 rounded-full" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SubscriptionDetailPage: React.FC<SubscriptionDetailPageProps> = ({ activeSubPageId, onSubNavigate }) => {
  const [initialSubscription, setInitialSubscription] = useState<Subscription | null>(null);
  const [editableSubscription, setEditableSubscription] = useState<Subscription | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [activeInvoiceTab, setActiveInvoiceTab] = useState<'past' | 'future'>('past');

  useEffect(() => {
    if (activeSubPageId && activeSubPageId.startsWith('subscription_detail?id=')) {
      const id = activeSubPageId.split('?id=')[1];
      const foundSub = mockSubscriptions.find(sub => sub.id === id);
      if (foundSub) {
          const deepCopy = JSON.parse(JSON.stringify(foundSub));
          setInitialSubscription(deepCopy);
          setEditableSubscription(JSON.parse(JSON.stringify(foundSub)));
      } else {
          setInitialSubscription(null);
          setEditableSubscription(null);
      }
      setIsDirty(false);
    }
  }, [activeSubPageId]);
  
  useEffect(() => {
    if (editableSubscription && initialSubscription) {
      setIsDirty(JSON.stringify(editableSubscription) !== JSON.stringify(initialSubscription));
    }
  }, [editableSubscription, initialSubscription]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableSubscription(prev => prev ? { ...prev, [name]: value } : null);
  };
  
  const handleSave = () => {
    if (!editableSubscription) return;
    console.log("Saving subscription:", editableSubscription);
    alert(`Abonnement "${editableSubscription.name}" sauvegardé (simulation).`);
    // In a real app, update the mock data source
    const index = mockSubscriptions.findIndex(s => s.id === editableSubscription.id);
    if (index !== -1) {
        mockSubscriptions[index] = editableSubscription;
    }
    setInitialSubscription(JSON.parse(JSON.stringify(editableSubscription)));
    setIsDirty(false);
  };
  
  const handleDelete = () => {
    if (editableSubscription && window.confirm(`Supprimer l'abonnement "${editableSubscription.name}" ?`)) {
      console.log("Deleting subscription:", editableSubscription.id);
      alert("Abonnement supprimé (simulation).");
      onSubNavigate?.('abonnements');
    }
  };

  const handlePause = () => {
      if (!editableSubscription) return;
      alert(`Simulation: mise en pause de l'abonnement "${editableSubscription.name}".`);
  };

  const handleGoBack = () => onSubNavigate?.('abonnements');

  if (!editableSubscription) {
    return (
      <div className="p-6 bg-white rounded-lg shadow text-center">
        <p className="text-lg font-semibold text-theme-text">Abonnement non trouvé</p>
      </div>
    );
  }
  
  const statusStyle = getStatusBadgeStyle(editableSubscription.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleGoBack}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50"
          aria-label="Retour à la liste des abonnements"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-semibold text-theme-text">{editableSubscription.name}</h2>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusStyle.className}`}>{statusStyle.label}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Actions & Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-3">
             <div className="flex space-x-2">
                <button 
                    onClick={handleSave} 
                    disabled={!isDirty}
                    className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Sauvegarder
                </button>
                <button onClick={handleDelete} className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600">Supprimer</button>
             </div>
             <button onClick={handlePause} className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50">Mettre en pause</button>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-gray-700">Nom de l'abonnement</label>
              <input type="text" name="name" id="name" value={editableSubscription.name} onChange={handleInputChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
            </div>
            <div className="flex space-x-4">
                <div className="flex-1">
                    <label htmlFor="startDate" className="text-sm font-medium text-gray-700">Date de début</label>
                    <input type="date" name="startDate" id="startDate" value={editableSubscription.startDate || ''} onChange={handleInputChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
                </div>
                 <div className="flex-1">
                    <label htmlFor="endDate" className="text-sm font-medium text-gray-700">Date de fin</label>
                    <input type="date" name="endDate" id="endDate" value={editableSubscription.endDate || ''} onChange={handleInputChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
                </div>
            </div>
            <div>
              <label htmlFor="paymentMethod" className="text-sm font-medium text-gray-700">Mode de paiement</label>
              <select name="paymentMethod" id="paymentMethod" value={editableSubscription.paymentMethod} onChange={handleInputChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                <option>Virement</option>
                <option>Prélèvement</option>
              </select>
            </div>
            <div>
              <label htmlFor="recurrence" className="text-sm font-medium text-gray-700">Récurrence</label>
               <select name="recurrence" id="recurrence" value={editableSubscription.recurrence} onChange={handleInputChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                <option>Tous les mois</option>
                <option>Tous les trimestres</option>
                <option>Tous les ans</option>
              </select>
            </div>
             <div>
              <label htmlFor="paymentConditions" className="text-sm font-medium text-gray-700">Conditions de paiement</label>
              <select name="paymentConditions" id="paymentConditions" value={editableSubscription.paymentConditions} onChange={handleInputChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                <option>Paiement sous 25 jours</option>
                <option>Comptant</option>
              </select>
            </div>
             <div>
              <label htmlFor="finalizationMode" className="text-sm font-medium text-gray-700">Mode de finalisation</label>
              <select name="finalizationMode" id="finalizationMode" value={editableSubscription.finalizationMode} onChange={handleInputChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                <option>Brouillon</option>
                <option>Validé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: KPIs & Lists */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <KpiCard title="Factures émises" value={editableSubscription.invoicesIssued?.current || 0} objective={editableSubscription.invoicesIssued?.objective} isCurrency={false} progress change="+1" changeUp/>
            <KpiCard title="Factures à émettre" value={editableSubscription.invoicesToIssue || 0} isCurrency={false} />
            <KpiCard title="Total facturé" value={editableSubscription.totalBilled?.current || 0} objective={editableSubscription.totalBilled?.objective} progressLabel={`${((editableSubscription.totalBilled?.current || 0) / (editableSubscription.totalBilled?.objective || 1) * 100).toFixed(0)}%`} />
            <KpiCard title="Restant à facturer" value={editableSubscription.remainingToBill || 0} />
          </div>

          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Factures</h3>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-4">
                    <button onClick={() => setActiveInvoiceTab('past')} className={`py-2 px-1 border-b-2 text-sm font-medium ${activeInvoiceTab === 'past' ? 'border-theme-primary-500 text-theme-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        Passées
                    </button>
                    <button onClick={() => setActiveInvoiceTab('future')} className={`py-2 px-1 border-b-2 text-sm font-medium ${activeInvoiceTab === 'future' ? 'border-theme-primary-500 text-theme-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        À venir
                    </button>
                </nav>
            </div>
            <div className="max-h-60 overflow-y-auto mt-2">
                {(activeInvoiceTab === 'past' ? editableSubscription.pastInvoices : editableSubscription.futureInvoices)?.map(invoice => (
                    <div key={invoice.id} className="grid grid-cols-12 gap-2 py-3 border-b border-gray-100 items-center">
                        <span className="col-span-3 text-sm font-medium text-gray-800">{invoice.id}</span>
                        <span className="col-span-2 text-xs bg-green-100 text-green-800 text-center px-2 py-0.5 rounded-full">{invoice.status}</span>
                        <span className="col-span-3 text-xs text-gray-500">Date d'émission: {formatDate(invoice.issueDate)}</span>
                        <span className="col-span-3 text-xs text-gray-500">Date d'échéance: {formatDate(invoice.dueDate)}</span>
                        <span className="col-span-1 text-sm font-semibold text-right text-gray-800">{formatCurrency(invoice.amountTTC)}</span>
                    </div>
                ))}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
             <h3 className="text-lg font-semibold text-gray-800 mb-2">Détails des produits</h3>
             <div className="max-h-60 overflow-y-auto">
                {editableSubscription.products?.map(product => (
                    <div key={product.id} className="grid grid-cols-12 gap-2 py-3 border-b border-gray-100 items-center">
                        <div className="col-span-6">
                            <p className="text-sm font-medium text-gray-800">{product.name}</p>
                            <div className="flex space-x-2 text-xs text-gray-500">
                                <span>Référence: {product.reference}</span>
                                <span>Unité: {product.unit}</span>
                            </div>
                        </div>
                        <div className="col-span-6 text-right">
                           <p className="text-sm text-gray-500">Prix unitaire HT <span className="text-gray-800 font-semibold">{formatCurrency(product.unitPriceHT)}</span></p>
                           <p className="text-xs text-gray-500">TVA <span className="text-gray-700 font-semibold">{product.tva}%</span></p>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetailPage;
