import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '../../constants/icons';

interface UboModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export const UboModal: React.FC<UboModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthCountry: '🇫🇷 France',
    city: '',
    role: 'Représentant légal',
    capitalPercentage: '',
    directOwnership: false,
    indirectOwnership: false
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          firstName: '',
          lastName: '',
          birthCountry: '🇫🇷 France',
          city: '',
          role: 'Représentant légal',
          capitalPercentage: '',
          directOwnership: false,
          indirectOwnership: false
        });
      }
      setStep(1);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Step 1 */}
        {step === 1 && (
          <div className="p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              {initialData ? "Modifier le bénéficiaire" : "Ajouter un bénéficiaire"}
            </h2>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Prénom</label>
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nom de famille</label>
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date de naissance</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="JJ" className="w-16 border border-slate-300 rounded-lg px-3 py-2.5 text-center focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none" />
                  <select className="flex-1 border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none bg-white">
                    <option>Janvier</option>
                    <option>Février</option>
                    <option>Mars</option>
                    <option>Avril</option>
                    <option>Mai</option>
                    <option>Juin</option>
                    <option>Juillet</option>
                    <option>Août</option>
                    <option>Septembre</option>
                    <option>Octobre</option>
                    <option>Novembre</option>
                    <option>Décembre</option>
                  </select>
                  <input type="text" placeholder="AAAA" className="w-20 border border-slate-300 rounded-lg px-3 py-2.5 text-center focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Pays de naissance</label>
                <select 
                  value={formData.birthCountry}
                  onChange={(e) => setFormData({...formData, birthCountry: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none bg-white"
                >
                  <option value="🇫🇷 France">🇫🇷 France</option>
                  <option value="🇧🇪 Belgique">🇧🇪 Belgique</option>
                  <option value="🇨🇭 Suisse">🇨🇭 Suisse</option>
                  <option value="🇨🇦 Canada">🇨🇦 Canada</option>
                  <option value="🇺🇸 États-Unis">🇺🇸 États-Unis</option>
                  <option value="🇬🇧 Royaume-Uni">🇬🇧 Royaume-Uni</option>
                  <option value="🇩🇪 Allemagne">🇩🇪 Allemagne</option>
                  <option value="🇪🇸 Espagne">🇪🇸 Espagne</option>
                  <option value="🇮🇹 Italie">🇮🇹 Italie</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Ville de naissance</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-theme-primary-600" />
                  </div>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Code postal de naissance</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">Type de contrôle exercé</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="controlType" 
                    checked={formData.role === 'Possession du capital'}
                    onChange={() => setFormData({...formData, role: 'Possession du capital'})}
                    className="w-4 h-4 text-theme-primary-600 focus:ring-theme-primary-500" 
                  />
                  <span className="text-slate-700">Possession du capital</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="controlType" 
                    checked={formData.role === 'Représentant légal'}
                    onChange={() => setFormData({...formData, role: 'Représentant légal'})}
                    className="w-4 h-4 text-theme-primary-600 focus:ring-theme-primary-500" 
                  />
                  <span className="text-slate-700">Représentant légal</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="controlType" 
                    checked={formData.role === 'Autre'}
                    onChange={() => setFormData({...formData, role: 'Autre'})}
                    className="w-4 h-4 text-theme-primary-600 focus:ring-theme-primary-500" 
                  />
                  <span className="text-slate-700">Autre</span>
                </label>
              </div>
            </div>

            {formData.role === 'Possession du capital' && (
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Pourcentage total du capital détenu</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      min="0"
                      max="100"
                      value={formData.capitalPercentage || ''}
                      onChange={(e) => setFormData({...formData, capitalPercentage: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none pr-8" 
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-slate-500">%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Détention du capital</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.directOwnership || false}
                        onChange={(e) => setFormData({...formData, directOwnership: e.target.checked})}
                        className="w-4 h-4 text-theme-primary-600 rounded focus:ring-theme-primary-500" 
                      />
                      <span className="text-slate-700">Directement</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.indirectOwnership || false}
                        onChange={(e) => setFormData({...formData, indirectOwnership: e.target.checked})}
                        className="w-4 h-4 text-theme-primary-600 rounded focus:ring-theme-primary-500" 
                      />
                      <span className="text-slate-700">Indirectement</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center gap-2 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
            </div>

            <div className="flex gap-4">
              <button onClick={onClose} className="flex-1 px-6 py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
                Annuler
              </button>
              <button 
                onClick={() => setStep(2)} 
                disabled={!formData.firstName || !formData.lastName}
                className="flex-1 px-6 py-3 bg-theme-primary-600 text-white font-medium rounded-lg hover:bg-theme-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Saisissez l'adresse</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Pays</label>
              <select className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none bg-white">
                <option>🇫🇷 France</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Trouver l'adresse du bénéficiaire</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-theme-primary-600" />
                </div>
                <input type="text" placeholder="10 rue du test" className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Ville</label>
              <input type="text" placeholder="Paris" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none" />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-2">Code postal</label>
              <input type="text" placeholder="75000" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none" />
            </div>

            <div className="flex justify-center gap-2 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 px-6 py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
                Retour
              </button>
              <button onClick={handleSave} className="flex-1 px-6 py-3 bg-theme-primary-600 text-white font-medium rounded-lg hover:bg-theme-primary-700 transition-colors">
                Enregistrer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
