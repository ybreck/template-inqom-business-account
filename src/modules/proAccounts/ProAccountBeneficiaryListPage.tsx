
import React, { useState, useMemo } from 'react';
import { ModuleComponentProps, Beneficiary } from './types';
import { mockBeneficiaries } from './data';
import { UserPlusIcon } from '../../../src/constants/icons';
import { Search, Star } from 'lucide-react';
import NewBeneficiaryModal from './NewBeneficiaryModal';

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const ProAccountBeneficiaryListPage: React.FC<ModuleComponentProps> = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(mockBeneficiaries);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleFavorite = (beneficiaryId: string) => {
    setBeneficiaries(prev => prev.map(b => 
      b.id === beneficiaryId ? { ...b, isFavorite: !b.isFavorite } : b
    ));
  };

  const handleAddBeneficiary = (newBen: { name: string; iban: string }) => {
    const newBeneficiary: Beneficiary = {
      id: `ben${Date.now()}`,
      name: newBen.name,
      iban: newBen.iban,
      addedDate: new Date().toISOString().split('T')[0],
      isFavorite: false,
    };
    setBeneficiaries(prev => [newBeneficiary, ...prev]);
  };

  const filteredBeneficiaries = useMemo(() => {
    let filtered = beneficiaries;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(lowerQuery) || 
        b.iban.toLowerCase().includes(lowerQuery)
      );
    }
    // Sort favorites first
    return filtered.sort((a, b) => {
      if (a.isFavorite === b.isFavorite) return 0;
      return a.isFavorite ? -1 : 1;
    });
  }, [beneficiaries, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-semibold text-slate-900">Gestion des Bénéficiaires</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <UserPlusIcon className="w-5 h-5 mr-2" />
          Ajouter un bénéficiaire
        </button>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher par nom ou IBAN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-10"></th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nom</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">IBAN</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Banque</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date d'ajout</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filteredBeneficiaries.map((beneficiary) => (
                <tr key={beneficiary.id} className="hover:bg-slate-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleToggleFavorite(beneficiary.id)}
                      className={`p-1 rounded-full transition-colors ${beneficiary.isFavorite ? 'text-amber-400 hover:text-amber-500' : 'text-slate-300 hover:text-slate-400'}`}
                      title={beneficiary.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      <Star className="w-5 h-5" fill={beneficiary.isFavorite ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{beneficiary.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">{beneficiary.iban}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{beneficiary.bankName || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatDate(beneficiary.addedDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredBeneficiaries.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-slate-500">Aucun bénéficiaire trouvé.</p>
          </div>
        )}
      </div>

      <NewBeneficiaryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddBeneficiary} 
      />
    </div>
  );
};

export default ProAccountBeneficiaryListPage;