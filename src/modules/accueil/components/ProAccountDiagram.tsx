import React from 'react';
import {
  PresentationChartLineIcon,
  ArrowsRightLeftIcon,
  CreditCardIcon,
  ArrowPathIcon,
  UserGroupIcon
} from '../../../constants/icons';

interface FeatureNodeProps {
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

// Re-using the same FeatureNode structure for consistency.
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

const ProAccountDiagram: React.FC = () => {
  const features = [
    {
      icon: <PresentationChartLineIcon />,
      title: "Synthèse et Solde",
      description: "Gardez un œil sur votre solde et vos opérations récentes en temps réel."
    },
    {
      icon: <ArrowsRightLeftIcon />,
      title: "Virements SEPA",
      description: "Effectuez des virements simplement vers vos bénéficiaires enregistrés ou nouveaux."
    },
    {
      icon: <CreditCardIcon />,
      title: "Gestion des Cartes",
      description: "Commandez, gérez et suivez les dépenses de vos cartes physiques et virtuelles."
    },
    {
      icon: <ArrowPathIcon />,
      title: "Prélèvements",
      description: "Consultez et gérez vos mandats de prélèvements SEPA actifs ou passés."
    },
    {
      icon: <UserGroupIcon />,
      title: "Bénéficiaires",
      description: "Gérez votre liste de bénéficiaires pour des virements rapides et sécurisés."
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
      <h2 className="text-2xl font-semibold text-center text-theme-text mb-2">Pilotez vos finances avec le Compte Pro Intégré</h2>
      <p className="text-base text-center text-gray-500 mb-8">
        Un compte unique pour encaisser, payer et gérer toute votre trésorerie, sans quitter votre outil de gestion.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureNode key={index} {...feature} />
        ))}
        <div className="flex items-center justify-center p-4 bg-theme-primary-50 rounded-lg shadow-inner border-2 border-dashed border-theme-primary-200 md:col-span-2 lg:col-span-1">
          <div className="text-center">
              <h4 className="text-lg font-semibold text-theme-primary-700">Votre Compte Pro, Simplifié</h4>
              <p className="text-sm text-theme-primary-600 mt-1">Moins de complexité, plus de contrôle sur votre trésorerie.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProAccountDiagram;
