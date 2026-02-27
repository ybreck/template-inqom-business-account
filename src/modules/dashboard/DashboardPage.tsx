
import React from 'react';
import InvoiceSummaryCard from './components/InvoiceSummaryCard';
import HistoryChart from './components/HistoryChart';
import KPIScorecard from './components/KPIScorecard';
import { InvoiceSummaryData, MonthlyInvoiceData, KPIScorecardProps, MonthlyDataPoint, ModuleComponentProps } from './types'; 
import { clientInvoiceData, supplierInvoiceData, historyChartData, kpiData, revenueTrendData, cashTrendData } from './data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const formatCurrencyForChart = (value: number) => `${(value / 1000).toFixed(0)}k €`;

const DashboardPage: React.FC<ModuleComponentProps> = ({ themeColors }) => {
  const primaryChartColor = themeColors?.primary || '#2F30E0'; // Fallback Inqom
  const secondaryChartColor = themeColors?.secondary || '#54595F'; // Fallback gray

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-semibold text-theme-text">Tableau de bord</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <KPIScorecard
            key={index}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            change={kpi.change}
            changeType={kpi.changeType}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InvoiceSummaryCard data={clientInvoiceData} />
        <InvoiceSummaryCard data={supplierInvoiceData} />
      </div>

      <HistoryChart data={historyChartData} themeColors={themeColors} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-theme-text mb-6">Évolution du Chiffre d'Affaires</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={revenueTrendData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb"/>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#d1d5db' }} tickLine={{ stroke: '#d1d5db' }} />
                <YAxis tickFormatter={formatCurrencyForChart} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false}/>
                <Tooltip
                    formatter={(value: number) => [`${value.toLocaleString()} €`, "Chiffre d'Affaires"]}
                    contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', borderColor: '#e5e7eb' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" iconSize={8}/>
                <Line type="monotone" dataKey="value" name="Chiffre d'Affaires" stroke={primaryChartColor} strokeWidth={2} dot={{ r: 4, fill: primaryChartColor }} activeDot={{ r: 6, stroke: primaryChartColor }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-theme-text mb-6">Évolution de la Trésorerie</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={cashTrendData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#d1d5db' }} tickLine={{ stroke: '#d1d5db' }}/>
                <YAxis tickFormatter={formatCurrencyForChart} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false}/>
                 <Tooltip
                    formatter={(value: number) => [`${value.toLocaleString()} €`, "Trésorerie"]}
                    contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', borderColor: '#e5e7eb' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" iconSize={8}/>
                <Line type="monotone" dataKey="value" name="Trésorerie" stroke={secondaryChartColor} strokeWidth={2} dot={{ r: 4, fill: secondaryChartColor }} activeDot={{ r: 6, stroke: secondaryChartColor }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;