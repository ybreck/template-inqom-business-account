import React from 'react';
import { EReporting } from '../types';
import { DocumentTextIcon, CalendarDaysIcon, ClockIcon } from '../../../constants/icons';

interface EReportingCardProps {
    data: EReporting;
    onViewHistory: () => void;
}

const EReportingCard: React.FC<EReportingCardProps> = ({ data, onViewHistory }) => {
    return (
        <div>
             <h2 className="text-xl font-semibold text-gray-800 mb-4">Votre point sur le E-reporting</h2>
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="font-semibold text-gray-800">Suivi E-reporting</h3>
                        <p className="text-sm text-gray-600">Suivi en temps réel de la transmission de vos données à l'administration fiscale.</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {data.status}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white p-3 rounded-lg border">
                               <DocumentTextIcon className="w-6 h-6 text-theme-primary-500"/>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Transactions ce mois-ci</p>
                                <p className="text-xl font-bold text-gray-800">{data.transactionsThisMonth}</p>
                            </div>
                        </div>
                         <div className="flex items-center space-x-3">
                            <div className="bg-white p-3 rounded-lg border">
                               <CalendarDaysIcon className="w-6 h-6 text-theme-primary-500"/>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Prochaine transmission</p>
                                <p className="text-xl font-bold text-gray-800">{data.nextTransmissionDate}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onViewHistory}
                        className="flex items-center space-x-2 text-sm font-medium text-theme-primary-600 hover:underline">
                        <ClockIcon className="w-4 h-4" />
                        <span>Historique des statuts</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EReportingCard;
