
import React from 'react';
import { KPIScorecardProps } from '../types';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '../icons'; // Adjusted path

const KPIScorecard: React.FC<KPIScorecardProps> = ({ title, value, icon, change, changeType, description }) => {
  const renderChange = () => {
    if (!change || !changeType) return null;

    const IconComponent = changeType === 'positive' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
    const textColor = changeType === 'positive' ? 'text-green-600' : changeType === 'negative' ? 'text-red-600' : 'text-gray-600';

    return (
      <div className={`mt-1 flex items-center text-xs ${textColor}`}>
        <IconComponent className="w-4 h-4 mr-0.5" />
        {change}
        {description && <span className="ml-1 text-gray-500">par rapport au mois précédent</span>}
      </div>
    );
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
          {React.cloneElement(icon, { className: 'w-6 h-6 text-theme-primary-500' })} 
        </div>
        <p className="mt-1 text-3xl font-semibold text-theme-text">{value}</p>
      </div>
      {renderChange()}
    </div>
  );
};

export default KPIScorecard;