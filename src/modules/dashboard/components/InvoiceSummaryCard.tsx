
import React from 'react';
import { InvoiceSummaryData } from '../types';
import { InformationCircleIcon } from '../../../constants/icons'; 

interface InvoiceSummaryCardProps {
  data: InvoiceSummaryData;
}

const MiniBarChart: React.FC<{ segments: Array<{ label: string; value: number; amount: string; color: string }>, maxValue: number }> = ({ segments, maxValue }) => {
  const chartHeight = 60; // Max height for bars in px
  return (
    <div className="w-full">
      <div className="flex justify-around items-end h-20 border-b border-gray-200 pb-1">
        {segments.map((segment, index) => (
          <div key={index} className="flex flex-col items-center w-1/3 px-1">
             <span className="text-xs font-semibold text-theme-text mb-0.5">{segment.amount}</span>
            <div 
              className={`w-4/5 rounded-t-sm ${segment.color}`}
              style={{ height: maxValue > 0 ? `${(segment.value / maxValue) * chartHeight}px` : '2px' }}
              title={`${segment.label}: ${segment.amount}`}
            ></div>
          </div>
        ))}
      </div>
      <div className="flex justify-around text-center mt-1">
        {segments.map((segment, index) => (
          <span key={index} className="text-xs text-gray-500 w-1/3">{segment.label}</span>
        ))}
      </div>
    </div>
  );
};


const InvoiceSummaryCard: React.FC<InvoiceSummaryCardProps> = ({ data }) => {
  const maxRetardValue = Math.max(...data.enRetard.segments.map(s => s.value), 1);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-xl font-semibold text-theme-text">{data.title}</h3>
        <a href="#" className="text-sm text-theme-primary-500 hover:underline font-medium">Voir la liste</a> 
      </div>
      <p className="text-xs text-gray-500 mb-4 flex items-center">
        {data.infoTooltip}: <span className="font-bold text-gray-600 ml-1">{data.totalNonCategorized}</span>
        <InformationCircleIcon className="w-4 h-4 text-gray-400 ml-1 cursor-pointer" title={data.infoTooltip} />
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-theme-text">En retard</p>
          <p className="text-lg font-bold text-red-600 mb-2">{data.enRetard.total}</p>
          <MiniBarChart segments={data.enRetard.segments} maxValue={maxRetardValue} />
        </div>
        <div>
          <p className="text-sm font-medium text-theme-text">À venir</p>
          <p className="text-lg font-bold text-theme-text mb-2">{data.aVenir.total}</p>
          <MiniBarChart segments={data.aVenir.segments.map(s => ({...s, color: 'bg-gray-300'}))} maxValue={1} />
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummaryCard;