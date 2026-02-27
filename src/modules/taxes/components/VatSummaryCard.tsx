import React from 'react';
import { VatSummary } from '../types';
import { ChatBubbleOvalLeftEllipsisIcon } from '../../../constants/icons';

interface VatSummaryCardProps {
    data: VatSummary;
    onContact: () => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        signDisplay: 'always'
    }).format(amount);
};

const VatSummaryCard: React.FC<VatSummaryCardProps> = ({ data, onContact }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Votre point sur la TVA (Juillet 2025)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <p className="text-sm text-gray-500">TVA collectée sur vos ventes</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(data.collected)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">TVA déductible sur vos achats</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(data.deductible)}</p>
                </div>
                <div className="relative">
                    <p className="text-sm text-gray-500">Crédit de TVA</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(data.credit)}</p>
                    <button onClick={onContact} className="absolute top-0 right-0 text-gray-400 hover:text-gray-600" aria-label="Contacter votre expert-comptable à propos du crédit de TVA">
                        <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VatSummaryCard;
