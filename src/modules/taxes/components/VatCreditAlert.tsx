import React from 'react';
import { ChatBubbleOvalLeftEllipsisIcon } from '../../../constants/icons';

interface VatCreditAlertProps {
    creditAmount: number;
    onRequestRefund: () => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        signDisplay: 'always'
    }).format(amount);
};

const VatCreditAlert: React.FC<VatCreditAlertProps> = ({ creditAmount, onRequestRefund }) => {
    return (
        <div className="bg-green-50/70 p-6 rounded-lg border-l-4 border-green-500 flex items-center space-x-6">
            <div className="flex-shrink-0">
                <div className="bg-green-100 p-3 rounded-full">
                    <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8 text-green-600" />
                </div>
            </div>
            <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">Vous avez un crédit de TVA !</h3>
                <p className="text-sm text-gray-600">Vous pouvez demander son remboursement ou le reporter sur vos prochaines déclarations.</p>
            </div>
            <div className="flex items-center space-x-6">
                 <div>
                    <p className="text-sm text-gray-500">Montant du crédit</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(creditAmount)}</p>
                </div>
                <button 
                    onClick={onRequestRefund}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-theme-primary-500 rounded-lg hover:bg-theme-primary-600 transition-colors shadow-sm">
                    Demander le remboursement
                </button>
            </div>
        </div>
    );
};

export default VatCreditAlert;
