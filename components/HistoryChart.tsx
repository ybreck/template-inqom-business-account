
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MonthlyInvoiceData } from '../types';

interface HistoryChartProps {
  data: MonthlyInvoiceData[];
}

const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
  const formatYAxis = (tickItem: number) => {
    if (tickItem >= 1000) {
      return `${tickItem / 1000}k €`;
    }
    return `${tickItem} €`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Historique des factures réglées</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-sm bg-teal-500 mr-2"></span>
            <span className="text-sm text-gray-600">Factures clients</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-sm bg-cogep-blue-600 mr-2"></span> {/* This color 'cogep-blue-600' is not in index.html, might render default */}
            <span className="text-sm text-gray-600">Factures fournisseurs</span>
          </div>
        </div>
      </div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{
              top: 5, right: 0, left: 0, bottom: 5,
            }}
            barGap={10}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: '#6b7280' }} 
              axisLine={{ stroke: '#d1d5db' }} 
              tickLine={{ stroke: '#d1d5db' }}
            />
            <YAxis 
              tickFormatter={formatYAxis} 
              tick={{ fontSize: 12, fill: '#6b7280' }} 
              axisLine={false} 
              tickLine={false}
              domain={[0, 'dataMax + 2000']} // Add some padding to the top
            />
            <Tooltip
              cursor={{ fill: 'rgba(230, 230, 230, 0.3)' }}
              contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', borderColor: '#e5e7eb' }}
              formatter={(value: number, name: string) => [`${value.toLocaleString()} €`, name === 'clients' ? 'Factures clients' : 'Factures fournisseurs']}
            />
            {/* Legend component is not used here as custom legend is above */}
            {/* <Legend 
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} 
              iconType="square"
              iconSize={10}
            /> */}
            <Bar dataKey="clients" fill="#14B8A6" radius={[4, 4, 0, 0]} name="Factures clients" />
            <Bar dataKey="fournisseurs" fill="#0055A4" radius={[4, 4, 0, 0]} name="Factures fournisseurs" /> {/* This color is standard blue, not dbf-purple or dbf-secondary-gray */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HistoryChart;