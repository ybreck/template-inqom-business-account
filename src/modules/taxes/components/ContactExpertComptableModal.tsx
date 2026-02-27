import React, { useState, useEffect } from 'react';
import { CloseIcon } from '../../../constants/icons';

interface ContactExpertComptableModalProps {
    isOpen: boolean;
    onClose: () => void;
    subject: string;
    defaultReason: string;
}

const ContactExpertComptableModal: React.FC<ContactExpertComptableModalProps> = ({ isOpen, onClose, subject, defaultReason }) => {
    const [reason, setReason] = useState(defaultReason);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Reset state when props change (modal is reopened for a different reason)
        setReason(defaultReason);
        setMessage('');
    }, [isOpen, defaultReason]);


    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulation of sending the message
        alert(`Message envoyé !\n\nSujet: ${subject}\nMotif: ${reason}\nMessage: ${message}`);
        setMessage('');
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="bg-white rounded-xl shadow-lg w-full max-w-lg transform transition-all"
                onClick={e => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Contacter votre expert-comptable</h2>
                                <p className="text-sm text-gray-500 mt-1">Concernant : {subject}</p>
                            </div>
                            <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
                                <CloseIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="reason-select" className="block text-sm font-medium text-gray-700 mb-1">Motif de la demande</label>
                            <div className="relative">
                                <select
                                    id="reason-select"
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                    className="w-full appearance-none p-3 pr-8 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-theme-primary-300"
                                >
                                    <option>Demander le crédit de TVA</option>
                                    <option>Question sur le crédit de TVA</option>
                                    <option>Question sur une échéance</option>
                                    <option>Autre question</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="message-textarea" className="block text-sm font-medium text-gray-700 mb-1">Votre message</label>
                            <textarea
                                id="message-textarea"
                                rows={5}
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Expliquez votre situation ou votre question ici..."
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary-300 resize-y"
                            />
                        </div>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-b-xl flex justify-end items-center space-x-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100">
                            Annuler
                        </button>
                        <button type="submit" disabled={!message.trim()} className="px-5 py-2.5 text-sm font-semibold text-white bg-theme-primary-600 rounded-lg hover:bg-theme-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                            Envoyer le message
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactExpertComptableModal;
