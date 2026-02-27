import React, { useState } from 'react';
import { 
  CheckCircleIcon, 
  EnvelopeIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  InformationCircleIcon,
  ArrowLeftIcon,
  FolderPlusIcon,
  ClockIcon
} from '../../constants/icons';
import { UboModal } from './UboModal';

interface ProAccountOnboardingProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const ProAccountOnboarding: React.FC<ProAccountOnboardingProps> = ({ onComplete, onCancel }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [orgType, setOrgType] = useState('Entreprise (SA, SARL, SAS, SCI...)');
  const [hasForeignUBO, setHasForeignUBO] = useState(false);
  const [isUboModalOpen, setIsUboModalOpen] = useState(false);

  const requiresDocs = orgType === 'Association ou fondation' || hasForeignUBO;

  const flow = [
    { id: 'intro' },
    { id: 'org', title: 'Organisation', icon: DocumentTextIcon },
    { id: 'ubo', title: 'Titularité', icon: UserGroupIcon },
    ...(requiresDocs ? [{ id: 'docs', title: 'Documents', icon: FolderPlusIcon }] : []),
    { id: 'email', title: 'Email', icon: EnvelopeIcon },
    { id: 'id', title: 'Identification', icon: InformationCircleIcon },
    { id: 'kyc' }
  ];

  const currentStep = flow[stepIndex];
  const visualSteps = flow.filter(s => s.title);
  const currentVisualIndex = visualSteps.findIndex(s => s.id === currentStep.id);

  const handleNext = () => {
    if (stepIndex < flow.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const renderProgressBar = () => {
    if (currentStep.id === 'intro' || currentStep.id === 'kyc') return null;
    
    return (
      <div className="flex border-b border-slate-200 mb-8">
        {visualSteps.map((s, idx) => (
          <div 
            key={s.id} 
            className={`px-4 py-3 font-medium text-sm flex-1 text-center ${
              idx === currentVisualIndex 
                ? 'border-b-2 border-theme-primary-600 text-theme-primary-600' 
                : idx < currentVisualIndex 
                  ? 'text-theme-primary-600' 
                  : 'text-slate-400'
            }`}
          >
            {idx + 1}. {s.title}
          </div>
        ))}
      </div>
    );
  };

  const renderIntro = () => (
    <div className="max-w-5xl mx-auto mt-12">
      <h2 className="text-3xl font-semibold text-slate-900 mb-2 text-center">Merci ! Plus que {visualSteps.length} étapes.</h2>
      <p className="text-slate-500 mb-16 text-center">Nous allons vous aider à créer votre compte. Il vous suffit de suivre quelques étapes qui ne devraient pas prendre plus de 5 minutes.</p>

      <div className="flex justify-between items-start relative mb-16 px-8">
        <div className="absolute top-8 left-24 right-24 h-[1px] bg-slate-200 -z-10"></div>
        {visualSteps.map((s, idx) => (
          <div key={s.id} className="flex flex-col items-center flex-1 bg-slate-50">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 border ${idx === 0 ? 'border-theme-primary-200 bg-white shadow-sm' : 'border-slate-200 bg-white'}`}>
              {s.icon && <s.icon className={`w-8 h-8 ${idx === 0 ? 'text-theme-primary-600' : 'text-slate-400'}`} />}
            </div>
            <p className={`text-sm font-medium text-center px-2 ${idx === 0 ? 'text-slate-900' : 'text-slate-500'}`}>
              {idx + 1}. {s.title}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-theme-primary-600 text-white font-medium rounded-lg hover:bg-theme-primary-700 transition-colors text-lg shadow-sm"
        >
          Commencer
        </button>
      </div>
    </div>
  );

  const renderOrg = () => (
    <div className="max-w-3xl mx-auto mt-8">
      {renderProgressBar()}
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">Informations de l'organisation</h2>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-3">Êtes-vous un représentant légal ?</label>
          <div className="flex gap-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="legalRep" className="w-4 h-4 text-theme-primary-600 focus:ring-theme-primary-500" defaultChecked />
              <span className="text-slate-700">Oui</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="legalRep" className="w-4 h-4 text-theme-primary-600 focus:ring-theme-primary-500" />
              <span className="text-slate-700">Non, mais j'ai une procuration</span>
            </label>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            De quel type d'organisation s'agit-il ? <span className="text-slate-400 italic font-normal">- forme juridique</span>
          </label>
          <select 
            value={orgType}
            onChange={(e) => setOrgType(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none bg-white"
          >
            <option value="Entreprise (SA, SARL, SAS, SCI...)">Entreprise (SA, SARL, SAS, SCI...)</option>
            <option value="Association ou fondation">Association ou fondation</option>
            <option value="Co-titularité">Co-titularité</option>
            <option value="Indépendant, entrepreneur individuel ou profession libérale">Indépendant, entrepreneur individuel ou profession libérale</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Votre organisation</label>
          <input 
            type="text" 
            defaultValue="Inqom"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Quel est votre numéro d'immatriculation (SIREN) ?</label>
            <input 
              type="text" 
              defaultValue="999999999"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Quel est votre numéro de TVA ? <span className="text-slate-400 italic font-normal">- Facultatif</span>
            </label>
            <input 
              type="text" 
              placeholder="FR..."
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Adresse de l'organisation</label>
          <input 
            type="text" 
            placeholder="Numéro et nom de rue"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 mb-3 focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none"
          />
          <div className="grid grid-cols-2 gap-6">
            <input 
              type="text" 
              placeholder="Code postal"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none"
            />
            <input 
              type="text" 
              placeholder="Ville"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Secteur d'activité professionnel</label>
          <select className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none bg-white">
            <option value="">Sélectionnez un secteur...</option>
            <option value="tech">Technologies de l'information</option>
            <option value="commerce">Commerce de détail</option>
            <option value="services">Services aux entreprises</option>
            <option value="construction">Construction et immobilier</option>
            <option value="sante">Santé et action sociale</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Description de l'activité</label>
          <textarea 
            rows={3}
            placeholder="Décrivez brièvement l'activité principale de votre organisation..."
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none resize-none"
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Montant mensuel de transaction prévu</label>
          <select className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none bg-white">
            <option value="">Sélectionnez une fourchette...</option>
            <option value="0-10k">Moins de 10 000 €</option>
            <option value="10k-50k">De 10 000 € à 50 000 €</option>
            <option value="50k-100k">De 50 000 € à 100 000 €</option>
            <option value="100k-500k">De 100 000 € à 500 000 €</option>
            <option value="500k+">Plus de 500 000 €</option>
          </select>
        </div>
      </div>

      <div className="flex justify-start gap-4">
        <button onClick={handlePrev} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
          Précédent
        </button>
        <button onClick={handleNext} className="px-6 py-2.5 bg-theme-primary-600 text-white font-medium rounded-lg hover:bg-theme-primary-700 transition-colors">
          Suivant
        </button>
      </div>
    </div>
  );

  const renderUbo = () => (
    <div className="max-w-3xl mx-auto mt-8">
      {renderProgressBar()}
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">Déclarez les bénéficiaires</h2>
      <p className="text-slate-500 mb-6 text-sm">Ajoutez tous les bénéficiaires effectifs (UBO) de votre organisation. Ces informations sont requises par la loi.</p>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div 
          onClick={() => setIsUboModalOpen(true)}
          className="border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm h-32 bg-white cursor-pointer hover:border-theme-primary-300 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-theme-primary-100 text-theme-primary-600 flex items-center justify-center font-medium text-sm shrink-0">
            EM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">Emilien Mathieu</p>
            <p className="text-sm text-slate-500 truncate">Représentant légal</p>
            <p className="text-sm text-slate-500 truncate">France, Paris</p>
          </div>
        </div>

        <div 
          onClick={() => setIsUboModalOpen(true)}
          className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-slate-100 transition-colors h-32 bg-white"
        >
          <div className="w-8 h-8 rounded-full border border-slate-400 flex items-center justify-center mb-2">
            <span className="text-slate-500 text-xl leading-none">+</span>
          </div>
          <span className="text-slate-600 text-sm font-medium">Ajouter un autre titulaire</span>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <label className="flex items-start gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={hasForeignUBO}
            onChange={(e) => setHasForeignUBO(e.target.checked)}
            className="mt-1 w-4 h-4 text-theme-primary-600 rounded focus:ring-theme-primary-500" 
          />
          <div>
            <span className="text-sm font-medium text-amber-900 block">Un des bénéficiaires est né à l'étranger</span>
            <span className="text-xs text-amber-700 block mt-1">Cochez cette case pour simuler un UBO étranger (déclenche l'étape de demande de documents).</span>
          </div>
        </label>
      </div>

      <div className="flex justify-start gap-4">
        <button onClick={handlePrev} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
          Précédent
        </button>
        <button onClick={handleNext} className="px-6 py-2.5 bg-theme-primary-600 text-white font-medium rounded-lg hover:bg-theme-primary-700 transition-colors">
          Suivant
        </button>
      </div>
    </div>
  );

  const renderDocs = () => (
    <div className="max-w-3xl mx-auto mt-8">
      {renderProgressBar()}
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">Documents justificatifs</h2>
      <p className="text-slate-500 mb-8 text-sm">
        En raison de la nature de votre organisation ({orgType}) ou de vos bénéficiaires, nous avons besoin de documents supplémentaires.
      </p>

      <div className="space-y-6 mb-8">
        {orgType === 'Association ou fondation' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium text-slate-900">Statuts de l'association</h3>
                <p className="text-sm text-slate-500">Copie des statuts datés et signés.</p>
              </div>
              <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">Requis</span>
            </div>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 cursor-pointer transition-colors">
              <FolderPlusIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <span className="text-sm text-theme-primary-600 font-medium">Cliquez pour ajouter un fichier</span>
              <span className="text-sm text-slate-500"> ou glissez-déposez</span>
            </div>
          </div>
        )}

        {hasForeignUBO && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium text-slate-900">Pièce d'identité (Bénéficiaire étranger)</h3>
                <p className="text-sm text-slate-500">Passeport ou carte d'identité en cours de validité.</p>
              </div>
              <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">Requis</span>
            </div>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 cursor-pointer transition-colors">
              <FolderPlusIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <span className="text-sm text-theme-primary-600 font-medium">Cliquez pour ajouter un fichier</span>
              <span className="text-sm text-slate-500"> ou glissez-déposez</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-start gap-4">
        <button onClick={handlePrev} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
          Précédent
        </button>
        <button onClick={handleNext} className="px-6 py-2.5 bg-theme-primary-600 text-white font-medium rounded-lg hover:bg-theme-primary-700 transition-colors">
          Suivant
        </button>
      </div>
    </div>
  );

  const renderEmail = () => (
    <div className="max-w-3xl mx-auto mt-8">
      {renderProgressBar()}
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">Contact du titulaire</h2>
      <p className="text-slate-500 mb-8 text-sm">Veuillez renseigner l'adresse e-mail du représentant légal qui signera le contrat.</p>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
        <label className="block text-sm font-medium text-slate-700 mb-2">Adresse e-mail</label>
        <input 
          type="email" 
          defaultValue="emilien@inqom.com"
          className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-theme-primary-500 focus:border-theme-primary-500 outline-none text-lg"
        />
      </div>

      <div className="flex justify-start gap-4">
        <button onClick={handlePrev} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
          Précédent
        </button>
        <button onClick={handleNext} className="px-6 py-2.5 bg-theme-primary-600 text-white font-medium rounded-lg hover:bg-theme-primary-700 transition-colors">
          Suivant
        </button>
      </div>
    </div>
  );

  const renderId = () => (
    <div className="max-w-3xl mx-auto mt-8">
      {renderProgressBar()}
      <div className="flex flex-col items-center justify-center text-center mt-12 bg-white p-12 rounded-2xl shadow-sm border border-slate-200">
        <div className="w-20 h-20 bg-theme-primary-50 rounded-2xl flex items-center justify-center mb-6">
          <InformationCircleIcon className="w-10 h-10 text-theme-primary-600" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Vérification d'identité</h2>
        <p className="text-slate-600 mb-8 max-w-md">
          Pour des raisons de sécurité, vous devez vérifier votre identité. Munissez-vous de votre smartphone et de votre pièce d'identité.
        </p>

        <p className="text-sm text-slate-500 mb-8">
          En cliquant sur "Envoyer le lien par SMS", vous acceptez les <a href="#" className="text-theme-primary-600 hover:underline">Conditions générales</a>.
        </p>

        <div className="flex justify-center gap-4 w-full">
          <button onClick={handlePrev} className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
            Précédent
          </button>
          <button onClick={handleNext} className="px-8 py-3 bg-theme-primary-600 text-white font-medium rounded-lg hover:bg-theme-primary-700 transition-colors shadow-sm">
            Envoyer le lien par SMS
          </button>
        </div>
      </div>
    </div>
  );

  const renderKyc = () => (
    <div className="max-w-3xl mx-auto mt-24">
      <div className="flex flex-col items-center justify-center text-center bg-white p-16 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
            <ClockIcon className="w-12 h-12 text-blue-500" />
          </div>
          <div className="absolute top-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        
        <h2 className="text-3xl font-semibold text-slate-900 mb-4">Vérification en cours</h2>
        <p className="text-slate-600 mb-12 max-w-lg text-lg">
          Notre partenaire analyse vos informations et vos documents. Cette étape prend généralement quelques minutes. Vous serez notifié par e-mail dès que votre compte sera actif.
        </p>

        <div className="pt-8 border-t border-slate-100 w-full">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-4">Actions de Démo</p>
          <button
            onClick={onComplete}
            className="px-6 py-2.5 bg-emerald-100 text-emerald-700 font-medium rounded-lg hover:bg-emerald-200 transition-colors border border-emerald-200"
          >
            Simuler l'approbation du compte
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <button onClick={onCancel} className="flex items-center text-slate-600 hover:text-slate-900 font-medium transition-colors">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Retour à Inqom
        </button>
        <div className="text-sm font-semibold text-slate-800">
          Ouverture de Compte Pro
        </div>
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>
      
      <div className="flex-1 overflow-y-auto pb-24">
        {currentStep.id === 'intro' && renderIntro()}
        {currentStep.id === 'org' && renderOrg()}
        {currentStep.id === 'ubo' && renderUbo()}
        {currentStep.id === 'docs' && renderDocs()}
        {currentStep.id === 'email' && renderEmail()}
        {currentStep.id === 'id' && renderId()}
        {currentStep.id === 'kyc' && renderKyc()}
      </div>

      <UboModal 
        isOpen={isUboModalOpen} 
        onClose={() => setIsUboModalOpen(false)} 
        onSave={(data) => {
          console.log('Saved UBO:', data);
          setIsUboModalOpen(false);
        }} 
      />
    </div>
  );
};
