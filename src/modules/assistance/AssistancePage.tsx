
import React from 'react';
import { ModuleComponentProps } from '../../../types';
import MvpDiagram from '../accueil/components/MvpDiagram';
import ProAccountDiagram from '../accueil/components/ProAccountDiagram';
import { QuestionMarkCircleIcon } from '../../constants/icons';

const AssistancePage: React.FC<ModuleComponentProps> = (props) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <QuestionMarkCircleIcon className="w-8 h-8 text-theme-primary-500 mr-3" />
        <h1 className="text-3xl font-semibold text-theme-text">Besoin d'assistance ?</h1>
      </div>
      <p className="text-lg text-gray-700">
        Retrouvez ici un aperçu des fonctionnalités clés de votre plateforme pour vous guider.
      </p>

      {/* MVP Diagram Section */}
      <MvpDiagram />

      {/* Pro Account Diagram Section */}
      <ProAccountDiagram />

      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-theme-text mb-2">Vous ne trouvez pas votre réponse ?</h3>
        <p className="text-gray-600 mb-4">Notre Inqom Copilot est disponible à tout moment pour répondre à vos questions, ou contactez notre support client.</p>
        <button className="px-6 py-2.5 text-sm font-medium text-white bg-theme-primary-500 rounded-lg hover:bg-theme-primary-600 transition-colors">
          Contacter le support
        </button>
      </div>

    </div>
  );
};

export default AssistancePage;
