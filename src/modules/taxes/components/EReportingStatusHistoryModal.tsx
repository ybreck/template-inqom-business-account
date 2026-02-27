import React from 'react';
import { EReportingHistoryEntry, EReportingStatusType } from '../types';
import { CloseIcon, CheckCircleIcon, DocumentTextIcon, ClipboardDocumentListIcon } from '../../../constants/icons';
import { CloudArrowUpIcon, CircleIcon } from '../icons';

interface EReportingStatusHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: EReportingHistoryEntry[];
}

const getStatusIcon = (statusType: EReportingStatusType) => {
    const iconProps = { className: 'w-6 h-6' };
    switch (statusType) {
        case 'ADMIN_ACK':
            return { icon: <CheckCircleIcon {...iconProps} />, color: 'text-green-500' };
        case 'PA_TO_ADMIN':
            return { icon: <CloudArrowUpIcon {...iconProps} />, color: 'text-purple-500' };
        case 'PA_ACK':
            return { icon: <ClipboardDocumentListIcon {...iconProps} />, color: 'text-teal-500' };
        case 'SENT_TO_PA':
            return { icon: <CloudArrowUpIcon {...iconProps} />, color: 'text-purple-500' };
        case 'USER_VALIDATION':
            return { icon: <CircleIcon {...iconProps} />, color: 'text-blue-500' };
        case 'FLUX_GENERATION':
            return { icon: <DocumentTextIcon {...iconProps} />, color: 'text-gray-500' };
        default:
            return { icon: <CircleIcon {...iconProps} />, color: 'text-gray-500' };
    }
};

const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    const datePart = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timePart = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `${datePart} ${timePart}`;
};

const EReportingStatusHistoryModal: React.FC<EReportingStatusHistoryModalProps> = ({ isOpen, onClose, history }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-modal-title"
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-3xl transform transition-all flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b flex justify-between items-start">
                    <div>
                        <h2 id="history-modal-title" className="text-xl font-bold text-gray-900">
                            Historique des statuts - E-reporting
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Historique des actions sur les déclarations et transmissions.
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {history.map((item, index) => {
                        const { icon, color } = getStatusIcon(item.statusType);
                        return (
                            <div key={item.id} className="flex space-x-4">
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 ${color}`}>
                                        {icon}
                                    </div>
                                    {index < history.length - 1 && (
                                        <div className="w-px h-full bg-gray-200 mt-2"></div>
                                    )}
                                </div>
                                <div className="flex-1 pb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-800">{item.title}</p>
                                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                            <p className="text-xs text-gray-500 mt-1">Par : <span className="font-medium">{item.author}</span></p>
                                        </div>
                                        <p className="text-xs text-gray-500 whitespace-nowrap ml-4">{formatTimestamp(item.timestamp)}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="p-4 bg-gray-50 rounded-b-xl flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EReportingStatusHistoryModal;
