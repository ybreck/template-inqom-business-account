
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { BankKPIData } from '../types';

interface BankKPICardProps {
  kpi: BankKPIData;
  themeColors?: { primary: string; secondary: string }; // Added themeColors prop
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const BankKPICard: React.FC<BankKPICardProps> = ({ kpi, themeColors }) => {
  // Determine chart color: use theme primary for 'balance', otherwise KPI-specific or default
  const balancePrimaryColor = themeColors?.primary || '#2F30E0'; // Fallback Inqom
  const chartColor = kpi.id === 'balance' ? balancePrimaryColor : (kpi.graphData[0]?.color || "#8884d8");
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
          {/* Icon color needs to be dynamic if it was theme-primary. Assuming icons are status-colored (green/red) or neutral */}
          {kpi.icon && React.cloneElement(kpi.icon, { className: kpi.icon.props.className || 'w-5 h-5' })}
        </div>
        <p className="text-2xl font-semibold text-theme-text">{formatCurrency(kpi.amount)}</p>
      </div>
      <div className="h-20 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={kpi.graphData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`colorArea${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{ fontSize: '10px', padding: '2px 5px', border: 'none', background: 'rgba(255,255,255,0.8)'}}
              formatter={(value: number) => [`${value.toLocaleString()} €`, 'Valeur']}
              labelFormatter={() => ''}
              itemStyle={{padding:0}}
            />
            <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                fillOpacity={1}
                fill={`url(#colorArea${kpi.id})`}
                strokeWidth={2}
                dot={false}
                activeDot={false}
            />
            <XAxis dataKey="name" hide />
            <YAxis domain={['dataMin - 100', 'dataMax + 100']} hide />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BankKPICard;