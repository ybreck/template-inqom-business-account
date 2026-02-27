

import React from 'react';
import { ModuleComponentProps } from './types'; // Added ModuleComponentProps

interface FinancingRow {
  label: string;
  yearN?: number;
  yearN1?: number;
  isBold?: boolean;
  isHeader?: boolean;
  isSubHeader?: boolean;
  isTotal?: boolean;
  isGrandTotal?: boolean;
  className?: string;
}

const formatCurrency = (value?: number): string => {
  if (value === undefined || isNaN(value)) return '-';
  return value.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

// Updated to accept ModuleComponentProps
const FinancingTablePage: React.FC<ModuleComponentProps> = (props) => {
  // props.onMainNavigate and props.onSubNavigate are available if needed
  const data: FinancingRow[] = [
    { label: 'EMPLOIS STABLES', isHeader: true },
    { label: 'ACQUISITIONS D\'IMMOBILISATIONS', isSubHeader: true },
    { label: 'Immobilisations incorporelles', yearN: 5000, yearN1: 3000 },
    { label: 'Immobilisations corporelles', yearN: 25000, yearN1: 18000 },
    { label: 'Immobilisations financières', yearN: 2000, yearN1: 1000 },
    { label: 'REMBOURSEMENT DE DETTES FINANCIÈRES', yearN: 10000, yearN1: 8000, isSubHeader: true },
    { label: 'VARIATION DU BESOIN EN FONDS DE ROULEMENT (BFR)', yearN: 7000, yearN1: -2000, isSubHeader: true },
    { label: 'DIVIDENDES VERSÉS', yearN: 15000, yearN1: 12000, isSubHeader: true },
    { label: 'TOTAL DES EMPLOIS STABLES (A)', yearN: 64000, yearN1: 40000, isTotal: true },

    { label: 'RESSOURCES STABLES', isHeader: true, className: 'pt-6' },
    { label: 'CAPACITÉ D\'AUTOFINANCEMENT (CAF)', yearN: 45000, yearN1: 42000, isSubHeader: true },
    { label: 'CESSIONS D\'IMMOBILISATIONS', yearN: 3000, yearN1: 5000, isSubHeader: true },
    { label: 'AUGMENTATION DE CAPITAL', yearN: 20000, yearN1: 0, isSubHeader: true },
    { label: 'NOUVELLES DETTES FINANCIÈRES (MLT)', yearN: 5000, yearN1: 10000, isSubHeader: true },
    { label: 'TOTAL DES RESSOURCES STABLES (B)', yearN: 73000, yearN1: 57000, isTotal: true },

    { label: 'VARIATION DE LA TRÉSORERIE NETTE (B - A)', yearN: 9000, yearN1: 17000, isGrandTotal: true, className: 'pt-6' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white shadow-xl rounded-lg max-w-5xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-semibold text-dbf-text mb-6 text-center">
        Tableau de Financement Prévisionnel
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-3/5 sm:w-1/2">
                Libellé
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Année N (€)
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Année N+1 (€)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr 
                key={index} 
                className={`
                  ${row.isHeader ? 'bg-dbf-purple-50' : ''} 
                  ${row.isTotal || row.isGrandTotal ? 'bg-gray-50' : ''}
                `}
              >
                <td className={`px-4 sm:px-6 py-3 whitespace-nowrap text-sm 
                  ${row.isHeader || row.isSubHeader || row.isTotal || row.isGrandTotal ? 'font-semibold' : ''} 
                  ${row.isHeader ? 'text-dbf-purple-700' : 'text-dbf-text'} 
                  ${row.isSubHeader ? 'pl-6 sm:pl-8' : ''}
                  ${row.className || ''}
                `}>
                  {row.label}
                </td>
                <td className={`px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-right 
                  ${row.isTotal || row.isGrandTotal ? 'font-bold' : ''} 
                  ${row.isGrandTotal ? 'text-lg text-dbf-purple-700' : 'text-dbf-text'} 
                  ${row.className || ''}
                `}>
                  {formatCurrency(row.yearN)}
                </td>
                <td className={`px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-right 
                  ${row.isTotal || row.isGrandTotal ? 'font-bold' : ''} 
                  ${row.isGrandTotal ? 'text-lg text-dbf-purple-700' : 'text-dbf-text'} 
                  ${row.className || ''}
                `}>
                  {formatCurrency(row.yearN1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-xs text-gray-500 italic text-center">
        Note: Ceci est un exemple de tableau de financement avec des données fictives à des fins de démonstration.
      </p>
    </div>
  );
};

export default FinancingTablePage;