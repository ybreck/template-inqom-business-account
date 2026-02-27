import React from 'react';
import { ModuleComponentProps, CashFlowDataPoint } from './types';
import { mockCashFlowData } from './data';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Area,
} from 'recharts';
import { PresentationChartLineIcon, CurrencyEuroIcon, ClockIcon } from '../../constants/icons';

const formatCurrency = (value: number) => {
  return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 });
};

const formatCurrencyForChart = (tickItem: number) => {
  if (tickItem >= 1000) {
    return `${(tickItem / 1000).toFixed(0)}k`;
  }
  return tickItem.toString();
};


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-sm text-theme-text">{`Mois : ${label}`}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} style={{ color: pld.color }} className="text-sm">
            {`${pld.name}: ${formatCurrency(pld.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};


const PrevisionnelTresoreriePage: React.FC<ModuleComponentProps> = ({ themeColors }) => {
    const primaryChartColor = themeColors?.primary || '#2F30E0';
    const secondaryChartColor = themeColors?.secondary || '#54595F';

    const kpiData = [
        { title: 'Trésorerie Actuelle', value: formatCurrency(115230), icon: <CurrencyEuroIcon className="w-6 h-6"/> },
        { title: 'Estimé à 30 jours', value: formatCurrency(125000), icon: <ClockIcon className="w-6 h-6"/> },
        { title: 'Solde prévisionnel à 3 mois', value: formatCurrency(135000), icon: <PresentationChartLineIcon className="w-6 h-6"/> },
    ];

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kpiData.map(kpi => (
                 <div key={kpi.title} className="bg-white p-5 rounded-xl shadow-lg">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 bg-theme-primary-100 p-2 rounded-full text-theme-primary-600">
                            {kpi.icon}
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 truncate">{kpi.title}</h3>
                            <p className="mt-1 text-2xl font-semibold text-theme-text">{kpi.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-theme-text mb-6">Prévisionnel de Trésorerie</h3>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <LineChart
              data={mockCashFlowData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis
                tickFormatter={formatCurrencyForChart}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 10000', 'dataMax + 10000']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={secondaryChartColor} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={secondaryChartColor} stopOpacity={0}/>
                </linearGradient>
              </defs>

              <Area 
                type="monotone" 
                dataKey="actual" 
                name="Trésorerie Réelle" 
                stroke={secondaryChartColor} 
                strokeWidth={2}
                fill="url(#colorActual)" 
                fillOpacity={1}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="forecast"
                name="Trésorerie Prévisionnelle"
                stroke={primaryChartColor}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: primaryChartColor }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PrevisionnelTresoreriePage;
