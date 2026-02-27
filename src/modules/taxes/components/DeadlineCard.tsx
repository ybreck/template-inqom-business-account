import React from 'react';
import { Deadline } from '../types';
import { CalendarDaysIcon, ChatBubbleOvalLeftEllipsisIcon } from '../../../constants/icons';

interface DeadlineCardProps {
    deadline: Deadline;
    onContact: (deadline: Deadline) => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        signDisplay: 'never'
    }).format(amount);
};

const DeadlineCard: React.FC<DeadlineCardProps> = ({ deadline, onContact }) => {
    const isCredit = deadline.amountLabel === 'Crédit à recevoir';

    return (
        <div className="bg-white p-5 rounded-lg shadow-md border-t-4 border-theme-primary-500 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-gray-800">{deadline.title}</h3>
                    <p className="text-xs text-gray-500">{deadline.subtitle}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">{deadline.status}</span>
            </div>
            
            <div className="text-center py-2">
                <p className={`text-4xl font-bold ${isCredit ? 'text-green-600' : 'text-gray-800'}`}>
                    {isCredit && '+ '}{formatCurrency(deadline.amount)}
                </p>
                <p className={`text-sm font-medium ${isCredit ? 'text-green-600' : 'text-gray-600'}`}>{deadline.amountLabel}</p>
                <p className="text-xs text-gray-500 mt-1">{deadline.calculationBasis}</p>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t">
                <div className="flex items-center">
                    <CalendarDaysIcon className="w-4 h-4 mr-1.5" />
                    <span>Échéance le {deadline.dueDate}</span>
                </div>
                {deadline.hasChat && (
                    <button onClick={() => onContact(deadline)} className="text-gray-400 hover:text-gray-600" aria-label={`Contacter votre expert-comptable à propos de ${deadline.title}`}>
                        <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default DeadlineCard;
