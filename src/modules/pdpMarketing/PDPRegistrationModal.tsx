import React, { useState } from 'react';
import { CompanyInfo } from '../../../types';
import { CloseIcon, CheckCircleIcon, AccessibleIconProps } from '../../constants/icons';

interface PDPRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeBrand?: 'inqom' | 'cabinet';
    companyInfo: CompanyInfo;
}

const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center mb-4">
    {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
      <React.Fragment key={step}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
            step < currentStep ? 'bg-theme-primary-500 text-white' : 
            step === currentStep ? 'bg-theme-primary-100 text-theme-primary-700 border-2 border-theme-primary-500' : 
            'bg-gray-200 text-gray-500'
        }`}>
          {step < currentStep ? <CheckCircleIcon className="w-5 h-5" /> : step}
        </div>
        {step < totalSteps && <div className={`flex-1 h-1 transition-colors ${step < currentStep ? 'bg-theme-primary-500' : 'bg-gray-200'}`} />}
      </React.Fragment>
    ))}
  </div>
);


const PDPRegistrationModal: React.FC<PDPRegistrationModalProps> = ({ isOpen, onClose, activeBrand, companyInfo }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        legalRepName: '',
        legalRepFirstName: '',
        contactEmail: '',
    });
    const [isMandateAccepted, setIsMandateAccepted] = useState(false);

    const paName = activeBrand === 'cabinet' ? 'Votre Cabinet' : 'Inqom';
    
    const handleClose = () => {
        // Reset state on close
        setStep(1);
        setFormData({ legalRepName: '', legalRepFirstName: '', contactEmail: '' });
        setIsMandateAccepted(false);
        onClose();
    };
    
    const handleNextStep = () => {
        if (step === 1) {
            // Basic validation
            if (!formData.legalRepName || !formData.legalRepFirstName || !formData.contactEmail) {
                alert("Veuillez remplir tous les champs du représentant légal.");
                return;
            }
        }
        setStep(prev => prev + 1);
    };

    const handlePrevStep = () => {
        setStep(prev => prev - 1);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    if (!isOpen) {
        return null;
    }

    const renderStepContent = () => {
        switch (step) {
            case 1: // Verification
                return (
                    <>
                        <h3 className="text-xl font-semibold text-theme-text mb-2">1/3 - Vérification de vos informations</h3>
                        <p className="text-sm text-gray-600 mb-6">Pour commencer, veuillez vérifier les informations pré-remplies de votre entreprise et renseigner les informations du représentant légal.</p>
                        <div className="space-y-4">
                             <div>
                                <label className="block text-xs font-medium text-gray-500">Raison Sociale</label>
                                <input type="text" value={companyInfo.name} readOnly className="mt-1 w-full p-2 border border-gray-200 rounded-md bg-gray-100 text-gray-500"/>
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">N° SIREN</label>
                                    <input type="text" value={companyInfo.siren} readOnly className="mt-1 w-full p-2 border border-gray-200 rounded-md bg-gray-100 text-gray-500"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">N° TVA Intracommunautaire</label>
                                    <input type="text" value={companyInfo.vatNumber} readOnly className="mt-1 w-full p-2 border border-gray-200 rounded-md bg-gray-100 text-gray-500"/>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="legalRepFirstName" className="block text-sm font-medium text-theme-text">Prénom du représentant légal</label>
                                    <input type="text" name="legalRepFirstName" id="legalRepFirstName" value={formData.legalRepFirstName} onChange={handleInputChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
                                </div>
                                 <div>
                                    <label htmlFor="legalRepName" className="block text-sm font-medium text-theme-text">Nom du représentant légal</label>
                                    <input type="text" name="legalRepName" id="legalRepName" value={formData.legalRepName} onChange={handleInputChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="contactEmail" className="block text-sm font-medium text-theme-text">Email de contact pour la facturation électronique</label>
                                <input type="email" name="contactEmail" id="contactEmail" value={formData.contactEmail} onChange={handleInputChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
                            </div>
                        </div>
                    </>
                );
            case 2: // Mandate
                return (
                    <>
                        <h3 className="text-xl font-semibold text-theme-text mb-4">2/3 - Mandat de désignation</h3>
                         <div className="p-4 border rounded-md bg-gray-50 h-64 overflow-y-auto text-sm text-gray-700 space-y-2">
                             <p className="font-semibold text-center">Mandat de Désignation de Plateforme Agréée (PA)</p>
                             <p>Je soussigné(e) <strong>{formData.legalRepFirstName} {formData.legalRepName}</strong>, agissant en qualité de représentant légal de l'entreprise <strong>{companyInfo.name}</strong> (SIREN : {companyInfo.siren}), mandate par la présente la société <strong>{paName}</strong> pour agir en tant que Plateforme Agréée (PA) dans le cadre de la réforme de la facturation électronique.</p>
                             <p>Ce mandat autorise {paName} à recevoir, archiver, et transmettre les factures électroniques pour le compte de {companyInfo.name}, conformément aux dispositions légales en vigueur.</p>
                         </div>
                         <div className="mt-4">
                            <label className="flex items-center">
                                <input type="checkbox" checked={isMandateAccepted} onChange={(e) => setIsMandateAccepted(e.target.checked)} className="h-4 w-4 text-theme-primary-600 border-gray-300 rounded focus:ring-theme-primary-500" />
                                <span className="ml-2 text-sm text-gray-700">Je confirme avoir lu et j'accepte les termes du mandat de désignation de la Plateforme Agréée.</span>
                            </label>
                        </div>
                    </>
                );
            case 3: // Confirmation
                return (
                     <div className="text-center p-4">
                        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-theme-text mb-2">Inscription finalisée !</h3>
                        <p className="text-gray-600 mb-2">Félicitations, {formData.legalRepFirstName} ! Votre demande d'inscription a bien été prise en compte.</p>
                        <p className="text-gray-600">Votre désignation de <strong>{paName}</strong> est en cours de validation auprès de l'annuaire national. Vous recevrez une confirmation par e-mail sous 24h.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderFooter = () => {
        switch(step) {
            case 1:
                return (
                    <div className="flex justify-end space-x-3">
                        <button onClick={handleClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Annuler</button>
                        <button onClick={handleNextStep} className="px-4 py-2 text-sm font-medium text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600">Valider et continuer</button>
                    </div>
                );
            case 2:
                return (
                    <div className="flex justify-end space-x-3">
                        <button onClick={handlePrevStep} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Précédent</button>
                        <button onClick={handleNextStep} disabled={!isMandateAccepted} className="px-4 py-2 text-sm font-medium text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600 disabled:bg-gray-300">Signer le mandat</button>
                    </div>
                );
            case 3:
                return (
                    <div className="flex justify-end">
                        <button onClick={handleClose} className="px-4 py-2 text-sm font-medium text-white bg-theme-primary-500 rounded-md hover:bg-theme-primary-600">Terminer</button>
                    </div>
                );
            default:
                return null;
        }
    }
    

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity"
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-theme-text">
                        Inscription au service de facturation électronique
                    </h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                
                {step < 3 && <ProgressBar currentStep={step} totalSteps={3} />}
                
                <div className="flex-grow my-4">
                    {renderStepContent()}
                </div>

                <div className="flex-shrink-0 pt-4 border-t border-gray-200">
                    {renderFooter()}
                </div>

            </div>
        </div>
    );
};

export default PDPRegistrationModal;