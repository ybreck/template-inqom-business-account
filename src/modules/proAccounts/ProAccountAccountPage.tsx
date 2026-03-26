import React from 'react';
import { ModuleComponentProps } from './types';
import { mockProAccountDetails } from './data';
import { Download, Copy, Info } from 'lucide-react';

const ProAccountAccountPage: React.FC<ModuleComponentProps> = () => {
  const accountDetails = mockProAccountDetails;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Détails Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Détails</h2>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            Télécharger le RIB
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-6 lg:col-span-5">
            <p className="text-sm font-medium text-slate-500 mb-2">IBAN</p>
            <div className="flex items-center gap-2">
              <p className="text-slate-900 font-mono whitespace-nowrap">{accountDetails.iban}</p>
              <button 
                onClick={() => handleCopy(accountDetails.iban)}
                className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                title="Copier l'IBAN"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="md:col-span-2 lg:col-span-3">
            <p className="text-sm font-medium text-slate-500 mb-2">BIC</p>
            <div className="flex items-center gap-2">
              <p className="text-slate-900 font-mono">{accountDetails.bic}</p>
              <button 
                onClick={() => handleCopy(accountDetails.bic || '')}
                className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                title="Copier le BIC"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="md:col-span-4 lg:col-span-4">
            <p className="text-sm font-medium text-slate-500 mb-2">Titulaire du compte</p>
            <div className="flex items-center gap-2">
              <p className="text-slate-900">{accountDetails.accountHolder}</p>
              <button 
                onClick={() => handleCopy(accountDetails.accountHolder || '')}
                className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                title="Copier le titulaire"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Adresse Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Adresse</h2>
        </div>
        
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">Numéro et rue</p>
            <p className="text-slate-900">{accountDetails.address?.street}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">Ville</p>
            <p className="text-slate-900">{accountDetails.address?.city}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">Code Postal</p>
            <p className="text-slate-900">{accountDetails.address?.postalCode}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">Pays</p>
            <p className="text-slate-900">{accountDetails.address?.country}</p>
          </div>
        </div>
      </div>

      {/* Comment alimenter le compte */}
      <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 flex items-start gap-4">
        <div className="bg-indigo-100 p-2 rounded-full shrink-0">
          <Info className="w-5 h-5 text-indigo-700" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-indigo-900 mb-1">Comment alimenter votre compte ?</h3>
          <p className="text-sm text-indigo-800 leading-relaxed">
            Pour ajouter des fonds sur votre compte professionnel (par exemple pour un premier dépôt), il vous suffit d'effectuer un virement bancaire classique depuis une autre banque vers l'IBAN indiqué ci-dessus. Les virements SEPA standards prennent généralement 1 à 2 jours ouvrés, tandis que les virements instantanés sont crédités en quelques secondes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProAccountAccountPage;
