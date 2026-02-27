
import React, { useState, useRef } from 'react';
import { ModuleComponentProps, DirectDebitMandate } from './types';
import { mockDirectDebitMandates } from './data';
import { PlusCircleIcon, PencilIcon, TrashIcon, EyeIcon, ArrowDownTrayIcon } from '../../constants/icons';

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const ProAccountDirectDebitsPage: React.FC<ModuleComponentProps> = ({ onSubNavigate }) => {
  const [mandates, setMandates] = useState<DirectDebitMandate[]>(mockDirectDebitMandates);
  // fileInputRef is no longer needed here as import functionality is replaced by creation.

  const handleCreateMandate = () => {
    if (onSubNavigate) {
      onSubNavigate('comptes_pro_prelevements_creer'); // Navigate to the new mandate creation form
    }
  };

  const handleViewMandateDetails = (mandateId: string) => {
    alert(`Affichage des détails pour le mandat ${mandateId} à implémenter.`);
  };
  
  const handleRevokeMandate = (mandateId: string) => {
     if (window.confirm("Êtes-vous sûr de vouloir révoquer ce mandat ? Cette action peut être irréversible selon les conditions de votre banque.")) {
        setMandates(prevMandates => 
            prevMandates.map(m => m.id === mandateId ? {...m, status: 'Révoqué'} : m)
        );
        alert(`Mandat ${mandateId} marqué comme révoqué (simulation).`);
     }
  };

  const handleDownloadMandate = (mandate: DirectDebitMandate) => {
    if (mandate.pdfLink) {
        alert(`Simulation du téléchargement du mandat : ${mandate.pdfLink}`);
        // In a real scenario: window.open(mandate.pdfLink, '_blank'); or trigger a file download
    } else {
        alert("Aucun fichier PDF associé à ce mandat.");
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-theme-text">Mandats de Prélèvement SEPA</h3>
        <button
          onClick={handleCreateMandate}
          className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 transition-colors"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Créer un mandat
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-4 py-2 text-left text-xxs font-semibold text-gray-500 uppercase tracking-wider">Nom du Mandat</th>
                <th scope="col" className="px-4 py-2 text-left text-xxs font-semibold text-gray-500 uppercase tracking-wider">Débiteur</th>
                <th scope="col" className="px-4 py-2 text-left text-xxs font-semibold text-gray-500 uppercase tracking-wider">RUM</th>
                <th scope="col" className="px-4 py-2 text-left text-xxs font-semibold text-gray-500 uppercase tracking-wider">Date Création</th>
                <th scope="col" className="px-4 py-2 text-left text-xxs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-4 py-2 text-center text-xxs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th scope="col" className="px-4 py-2 text-center text-xxs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {mandates.map((mandate) => {
                let statusBadgeStyle = 'bg-gray-100 text-gray-700';
                if (mandate.status === 'Actif') statusBadgeStyle = 'bg-green-100 text-green-700';
                else if (mandate.status === 'Révoqué') statusBadgeStyle = 'bg-red-100 text-red-700';
                else if (mandate.status === 'Expiré') statusBadgeStyle = 'bg-yellow-100 text-yellow-700';
                else if (mandate.status === 'En attente de signature' || mandate.status === 'Généré') statusBadgeStyle = 'bg-sky-100 text-sky-700';
                
                return (
                  <tr key={mandate.id} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-theme-text">{mandate.mandateDisplayName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{mandate.debtorName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{mandate.mandateReference}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(mandate.creationDate)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{mandate.mandateType}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className={`px-2 py-0.5 inline-flex text-xxs leading-4 font-semibold rounded-full ${statusBadgeStyle}`}>
                        {mandate.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center space-x-1">
                      <button
                        onClick={() => handleViewMandateDetails(mandate.id)}
                        className="text-theme-secondary-gray-500 hover:text-theme-secondary-gray-700 p-1"
                        title="Voir les détails du mandat"
                        aria-label={`Détails du mandat ${mandate.mandateReference}`}
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadMandate(mandate)}
                        className="text-theme-primary-500 hover:text-theme-primary-700 p-1"
                        title="Télécharger le mandat PDF"
                        aria-label={`Télécharger PDF du mandat ${mandate.mandateReference}`}
                        disabled={!mandate.pdfLink}
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                      </button>
                      {mandate.status === 'Actif' && (
                        <button
                          onClick={() => handleRevokeMandate(mandate.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Révoquer le mandat"
                          aria-label={`Révoquer le mandat ${mandate.mandateReference}`}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {mandates.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-500">Aucun mandat de prélèvement enregistré.</p>
        )}
      </div>
       <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 text-xs">
        <p><strong>Note :</strong> La création et la gestion des mandats (création, révocation, opposition) dépendent des fonctionnalités offertes par votre banque et des réglementations SEPA. Cette interface simule la création, la consultation et certaines actions de gestion. Pour toute opération ayant des implications légales ou financières, veuillez vous référer à votre conseiller bancaire ou à l'interface officielle de votre banque.</p>
      </div>
    </div>
  );
};

export default ProAccountDirectDebitsPage;