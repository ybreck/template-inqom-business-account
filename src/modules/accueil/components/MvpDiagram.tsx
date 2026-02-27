import React from 'react';
import {
  FolderPlusIcon,
  ChartBarIcon,
  DocumentTextIcon,
  DocumentArrowUpIcon,
  UserGroupIcon
} from '../../../constants/icons';

interface FeatureNodeProps {
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

const FeatureNode: React.FC<FeatureNodeProps> = ({ icon, title, description }) => (
  <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg border border-slate-200 h-full">
    <div className="flex-shrink-0 w-10 h-10 bg-theme-primary-100 text-theme-primary-600 rounded-lg flex items-center justify-center">
      {React.cloneElement(icon, { className: 'w-6 h-6' })}
    </div>
    <div>
      <h4 className="text-md font-semibold text-theme-text">{title}</h4>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  </div>
);

const MvpDiagram: React.FC = () => {
  const features = [
    {
      icon: <DocumentArrowUpIcon />,
      title: "Dépôt de Documents Simplifié",
      description: "Transmettez vos documents par email, mobile ou depuis votre ordinateur en quelques clics."
    },
    {
      icon: <ChartBarIcon />,
      title: "Tableau de Bord Intuitif",
      description: "Visualisez en un clin d'œil vos chiffres clés : trésorerie, chiffre d'affaires, factures à relancer..."
    },
    {
      icon: <FolderPlusIcon />,
      title: "Tous vos documents au même endroit",
      description: "Archivez, classez et retrouvez facilement tous vos documents importants dans un espace sécurisé."
    },
    {
      icon: <DocumentTextIcon />,
      title: "Facturation Facile et Conforme",
      description: "Créez des devis et factures professionnels. Prêt pour la facturation électronique obligatoire."
    },
    {
      icon: <UserGroupIcon />,
      title: "Suivi des Paiements",
      description: "Gardez un œil sur vos factures clients à encaisser et vos factures fournisseurs à payer."
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
      <h2 className="text-2xl font-semibold text-center text-theme-text mb-2">Une Plateforme, Toutes les Fonctionnalités Clés</h2>
      <p className="text-base text-center text-gray-500 mb-8">
        Une expérience centralisée pour transformer la collaboration et vous donner le contrôle.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureNode key={index} {...feature} />
        ))}
        <div className="flex items-center justify-center p-4 bg-theme-primary-50 rounded-lg shadow-inner border-2 border-dashed border-theme-primary-200 md:col-span-2 lg:col-span-1">
          <div className="text-center">
              <h4 className="text-lg font-semibold text-theme-primary-700">Au Coeur de Votre Activité</h4>
              <p className="text-sm text-theme-primary-600 mt-1">Pour une collaboration renforcée avec votre cabinet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MvpDiagram;