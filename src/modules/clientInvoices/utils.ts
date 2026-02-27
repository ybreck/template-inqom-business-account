

import { PAStatus } from './types'; // Or from '../../../types' if preferred

export const getPAStatusBadgeStyle = (status: PAStatus): { className: string; label: string } => {
  switch (status) {
    // Statuts Ventes (Émetteur)
    case 'BROUILLON': return { className: 'bg-gray-100 text-gray-700 border border-gray-300', label: 'Créée (Brouillon)' };
    case 'APPROUVEE_INTERNE': return { className: 'bg-lime-100 text-lime-700 border border-lime-300', label: 'Approuvée Interne' };
    case 'DEPOSEE_PA': return { className: 'bg-theme-primary-100 text-theme-primary-700 border-theme-primary-300', label: 'Déposée PA' };
    case 'REJETEE_PA': return { className: 'bg-red-100 text-red-700 border border-red-300', label: 'Rejetée PA' };
    case 'VALIDEE_PA': return { className: 'bg-green-100 text-green-700 border border-green-300', label: 'Transmise Client' };
    case 'STATUT_CLIENT_INDISPONIBLE': return { className: 'bg-yellow-100 text-yellow-700 border border-yellow-300', label: 'Statut client indispo.' };
    case 'TELECHARGEE_CLIENT': return { className: 'bg-sky-100 text-sky-700 border border-sky-300', label: 'Reçue Client' }; // Pour ventes
    case 'REFUSEE_CLIENT': return { className: 'bg-rose-100 text-rose-700 border border-rose-300', label: 'Refusée Client' };
    case 'PAYEE': return { className: 'bg-emerald-100 text-emerald-700 border border-emerald-300', label: 'Payée (Client)' };
    case 'PARTIELLEMENT_PAYEE': return { className: 'bg-teal-100 text-teal-700 border border-teal-300', label: 'Partiellement Payée (Client)' };
    case 'ENCAISSEE': return { className: 'bg-emerald-200 text-emerald-800 border-emerald-400', label: 'Encaissée' };
    case 'EN_RETARD': return { className: 'bg-orange-100 text-orange-700 border border-orange-300', label: 'En Retard (Paiement Client)' };
    case 'ANNULEE': return { className: 'bg-slate-100 text-slate-600 border border-slate-300', label: 'Annulée (Client)' };

    // Statuts Achats (Récepteur - notre perspective) - RENAMED
    case 'RECU_PA_ACHAT': return { className: 'bg-sky-100 text-sky-700 border border-sky-300', label: 'Reçue PA (Achat)' };
    case 'APPROUVEE_ACHAT': return { className: 'bg-lime-100 text-lime-700 border border-lime-300', label: 'Approuvée (Achat)' };
    case 'REJETEE_ACHAT': return { className: 'bg-rose-100 text-rose-700 border border-rose-300', label: 'Rejetée (Achat)' };
    case 'PAYEE_ACHAT': return { className: 'bg-emerald-100 text-emerald-700 border border-emerald-300', label: 'Payée (Achat)' };
    case 'PARTIELLEMENT_PAYEE_ACHAT': return { className: 'bg-teal-100 text-teal-700 border border-teal-300', label: 'Part. Payée (Achat)' };
    case 'ANNULEE_ACHAT': return { className: 'bg-slate-200 text-slate-700 border border-slate-400', label: 'Annulée (Achat)' };
    
    default: {
      // This block is reached if 'status' is not one of the known PAStatus values.
      // TypeScript infers 'status' as 'never' here if all PAStatus cases are covered.
      // To robustly handle any string passed at runtime (as hinted by original code's structure):
      const labelForDisplay = (typeof status === 'string' && status) ? status : 'Inconnu';
      return { className: 'bg-gray-100 text-gray-700 border border-gray-300', label: `Statut: ${labelForDisplay}` };
    }
  }
};