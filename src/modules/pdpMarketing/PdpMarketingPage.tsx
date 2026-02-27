import React, { useState } from 'react';
import { ModuleComponentProps, CompanyInfo } from '../../../types';
import { 
    ArrowLeftIcon,
    BoltIcon, 
    ArrowsPointingInIcon, 
    UserCircleIcon, 
    ChatBubbleLeftRightIcon, 
    DocumentTextIcon, 
    CheckCircleIcon, 
    CogIcon,
    DocumentCheckIcon 
} from '../../constants/icons';
import PDPRegistrationModal from './PDPRegistrationModal';

const PaMarketingPage: React.FC<ModuleComponentProps> = ({ onMainNavigate, activeBrand }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const paName = activeBrand === 'cabinet' ? 'Votre Cabinet' : 'Inqom';

    const handleGoBack = () => {
        if (onMainNavigate) {
            onMainNavigate('accueil');
        }
    };
    
    // This would typically come from a global state/context
    const companyInfo: CompanyInfo = {
        name: 'ACME',
        siren: '123 456 789',
        vatNumber: 'FR 12 123456789',
    };

    const steps = [
        { number: 1, title: 'Cadrage', description: 'Nous communiquons les informations sur la PA, vous nous posez vos questions et nous y répondons.', Icon: ChatBubbleLeftRightIcon, color: 'indigo' },
        { number: 2, title: 'Inscription', description: 'En quelques clics vous faites votre demande de raccordement et l’intégration de la facture électronique.', Icon: DocumentTextIcon, color: 'orange' },
        { number: 3, title: 'Vérification', description: 'Nous vérifions votre identité ou de celle représentant légal afin de confirmer la signature.', Icon: CheckCircleIcon, color: 'green' },
        { number: 4, title: 'Intégration', description: 'La facture électronique est intégrée à votre outil de gestion. Les flux sont générés automatiquement.', Icon: CogIcon, color: 'pink' },
    ];
    
    const stepColorClasses = {
        indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600' },
        orange: { bg: 'bg-orange-500', text: 'text-orange-600' },
        green: { bg: 'bg-green-500', text: 'text-green-600' },
        pink: { bg: 'bg-pink-500', text: 'text-pink-600' },
    };

    const DetailedContent = () => (
        <>
            <section className="bg-[#1E293B] text-white py-16 lg:py-24">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl lg:text-4xl font-bold text-center mb-8">Pourquoi choisir la PA sur votre portail Gestion ?</h2>
                    <div className="space-y-6 text-gray-300 text-base leading-relaxed">
                         <p>Intégrer la facturation électronique dans votre portail de gestion, c’est un véritable atout pour votre entreprise ! Cette solution innovante automatise le processus de facturation, minimise les erreurs humaines et accélère le traitement des paiements. Suivez l’état de vos factures en temps réel pour une visibilité optimale et une gestion de trésorerie améliorée.</p>
                        <p>En plus, la facturation électronique assure une conformité réglementaire sans faille grâce à un enregistrement numérique sécurisé de toutes vos transactions. Les audits deviennent un jeu d’enfant avec toutes les informations centralisées et facilement accessibles.</p>
                        <p>Et ce n’est pas tout ! En optant pour les factures électroniques, vous participez activement à la protection de l’environnement en réduisant votre consommation de papier. En résumé, intégrer la facturation électronique dans votre gestion, c’est optimiser vos processus financiers tout en renforçant votre efficacité opérationnelle.</p>
                    </div>
                </div>
            </section>
            
             <section className="bg-indigo-600 text-white py-16 lg:py-24 overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                    <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0 z-10">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Demandez une intégration dès à présent</h2>
                        <p className="text-indigo-200 mb-8">Nous proposons une intégration simple et rapide. Optimisez votre flux de travail en intégrant la facture électronique à votre outil de gestion !</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                            <button className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition w-full sm:w-auto">Demandez votre intégration</button>
                            <button className="text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-500 transition w-full sm:w-auto">En savoir plus</button>
                        </div>
                    </div>
                    <div className="md:w-1/2 flex justify-center md:justify-end">
                         <div className="relative w-64 h-64">
                            <div className="absolute inset-0 bg-white/10 rounded-3xl" style={{ backgroundImage: 'radial-gradient(circle, transparent 1px, rgba(255,255,255,0.1) 1px)', backgroundSize: '10px 10px' }}></div>
                            <div className="absolute inset-4 border-2 border-white/20 rounded-2xl flex items-center justify-center">
                                <div className="w-40 h-40 border-2 border-white/30 rounded-full flex items-center justify-center">
                                    <div className="w-28 h-28 border border-white/30 rounded-full flex items-center justify-center">
                                         <BoltIcon className="w-12 h-12 text-white" />
                                    </div>
                                </div>
                                <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white rounded-full border-4 border-indigo-600"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="bg-slate-50 py-16 lg:py-24">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Les grandes étapes</h2>
                        <p className="text-gray-600">Pensées pour vous et avec vous, elles s’adaptent à vos besoins ainsi qu’à ceux de vos équipes afin de garantir le succès de cette intégration.</p>
                    </div>
                    <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="hidden lg:block absolute top-6 left-0 w-full h-px bg-gray-300"></div>
                        {steps.map((step, index) => {
                            const colorClass = stepColorClasses[step.color as keyof typeof stepColorClasses];
                            return (
                                <div key={index} className="relative flex flex-col items-center">
                                    <div className={`z-10 w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-xl ${colorClass.bg} border-4 border-slate-50`}>
                                        {step.number}
                                    </div>
                                    <div className="text-center mt-4">
                                        <h3 className={`text-lg font-semibold ${colorClass.text}`}>{step.title}</h3>
                                        <p className="mt-2 text-sm text-gray-600">{step.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );

    return (
        <div className="bg-white text-[#0F172A] overflow-y-auto h-full">
            <button
                onClick={handleGoBack}
                className="absolute top-6 left-6 z-20 flex items-center text-sm font-medium text-gray-600 hover:text-theme-primary-500"
            >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Retour à l'accueil
            </button>
            
            <section className="relative text-center py-12 lg:py-16 overflow-hidden bg-white">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                    <div className="w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-4 flex flex-col items-center">
                    <DocumentCheckIcon className="w-24 h-24 sm:w-28 sm:h-28 text-theme-primary-500 mx-auto mb-6" />
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                        Passez à la <span className="text-indigo-600">Facturation électronique</span>
                    </h1>
                    <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                        Ça y est ! Vous pouvez désigner <strong>{paName}</strong> comme votre plateforme agréée (PA) dans l'annuaire pour faciliter votre transition obligatoire.
                    </p>
                    <p className="mt-4 text-base sm:text-lg text-gray-700">
                        Prenez <strong className="text-theme-primary-600">5 minutes</strong> pour terminer votre inscription.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row sm:justify-center gap-4">
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="w-full sm:w-auto px-8 py-3 text-base font-medium text-white bg-theme-primary-500 rounded-lg hover:bg-theme-primary-600 transition-colors focus:ring-2 focus:ring-theme-primary-300 focus:outline-none"
                        >
                            Commencer l'inscription
                        </button>
                    </div>
                </div>
            </section>
            
            <section className="bg-slate-50 py-16 lg:py-24">
                <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
                    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                        <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-lg bg-indigo-100">
                           <BoltIcon className="h-8 w-8 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900">Automatisez</h3>
                        <p className="text-gray-600">Récupérez automatiquement vos transactions et payez vos factures en un clic.</p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                        <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-lg bg-indigo-100">
                           <ArrowsPointingInIcon className="h-8 w-8 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900">Centralisez</h3>
                        <p className="text-gray-600">Un seul canal de réception pour toutes vos factures et tous vos fournisseurs</p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                        <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-lg bg-indigo-100">
                           <UserCircleIcon className="h-8 w-8 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900">Collaborez</h3>
                        <p className="text-gray-600">Renforcez la collaboration avec votre comptable</p>
                    </div>
                </div>
            </section>

            <DetailedContent />
            
            <PDPRegistrationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                activeBrand={activeBrand}
                companyInfo={companyInfo}
            />
            
            <style>{`
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
            `}</style>
        </div>
    );
};

export default PaMarketingPage;
