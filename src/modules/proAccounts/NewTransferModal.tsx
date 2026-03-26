import React, { useState, useMemo } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { mockProAccountDetails, mockBeneficiaries } from './data';

interface NewTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewTransferModal: React.FC<NewTransferModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [amount, setAmount] = useState<string>('2500');
  const [beneficiaryId, setBeneficiaryId] = useState<string>(mockBeneficiaries[0]?.id || '');
  const [date, setDate] = useState<string>('2027-06-25');
  const [isInstant, setIsInstant] = useState<boolean>(false);
  const [label, setLabel] = useState<string>('Frais de gestion Juin 2026');
  const [reference, setReference] = useState<string>('XXXXXXXX');

  const accountDetails = mockProAccountDetails;
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const currentBalance = accountDetails.balance;
  const parsedAmount = parseFloat(amount.replace(',', '.')) || 0;
  const balanceAfter = currentBalance - parsedAmount;

  const selectedBeneficiary = useMemo(() => {
    return mockBeneficiaries.find(b => b.id === beneficiaryId);
  }, [beneficiaryId]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (parsedAmount > 0 && beneficiaryId && date) {
      setStep(2);
    }
  };

  const handlePrevious = () => {
    setStep(1);
  };

  const handleFinalize = () => {
    // Implement finalize logic here
    console.log('Transfer finalized', { amount: parsedAmount, beneficiaryId, date, isInstant, label, reference });
    onClose();
    // Reset state
    setTimeout(() => setStep(1), 300);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setStep(1), 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Nouveau virement</h2>
          <button 
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Montant */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Montant <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-4 pr-8 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="0,00"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-slate-500">€</span>
                    </div>
                  </div>
                </div>

                {/* Bénéficiaire */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Bénéficiaire <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={beneficiaryId}
                    onChange={(e) => setBeneficiaryId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none"
                  >
                    <option value="" disabled>Sélectionner un bénéficiaire</option>
                    {mockBeneficiaries.map(b => (
                      <option key={b.id} value={b.id}>{b.name} - {b.iban}</option>
                    ))}
                  </select>
                </div>

                {/* Date de virement */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Date de virement <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Virement instantané */}
                <div className="flex items-center pt-6">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={isInstant}
                        onChange={(e) => setIsInstant(e.target.checked)}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${isInstant ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isInstant ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-sm font-medium text-slate-700">
                      Virement instantané
                    </div>
                  </label>
                </div>

                {/* Libellé du virement */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Libellé du virement
                  </label>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Référence */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Référence
                  </label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-1">Montant</p>
                    <p className="text-slate-700">{formatCurrency(parsedAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-1">Bénéficiaire</p>
                    <p className="text-slate-700">{selectedBeneficiary?.name} - {selectedBeneficiary?.iban}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-1">Date de virement</p>
                    <p className="text-slate-700">{new Date(date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-1">Virement instantané</p>
                    <p className="text-slate-700">{isInstant ? 'Oui' : 'Non'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-1">Libellé du virement</p>
                    <p className="text-slate-700">{label || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-1">Référence</p>
                    <p className="text-slate-700">{reference || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Balances */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-slate-50 rounded-xl p-6 flex flex-col items-end justify-center border border-slate-100">
              <p className="text-sm font-medium text-slate-600 mb-2">Solde actuel</p>
              <p className="text-3xl font-bold text-indigo-700">{formatCurrency(currentBalance)}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 flex flex-col items-end justify-center border border-slate-100">
              <p className="text-sm font-medium text-slate-600 mb-2">Solde après virement</p>
              <p className="text-3xl font-bold text-indigo-700">{formatCurrency(balanceAfter)}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-white">
          {step === 1 ? (
            <>
              <button 
                onClick={handleClose}
                className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={handleNext}
                disabled={parsedAmount <= 0 || !beneficiaryId || !date}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Étape suivante
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handlePrevious}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Étape précédente
              </button>
              <button 
                onClick={handleFinalize}
                className="px-5 py-2.5 text-sm font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors"
              >
                Finaliser le virement
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewTransferModal;
