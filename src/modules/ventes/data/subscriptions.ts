import { Subscription, SubscriptionInvoice, SubscriptionProduct } from '../../../../types';

// --- DATA FOR SUB_1 (from screenshot) ---
const sub1_products: SubscriptionProduct[] = [
    { id: 'prod_s1_1', name: 'Souris', reference: '003', unit: 'Unité', unitPriceHT: 20, tva: 20 },
    { id: 'prod_s1_2', name: 'Ipad Pro', reference: '016', unit: 'Unité', unitPriceHT: 1600, tva: 15 },
    { id: 'prod_s1_3', name: 'Chaise de bureau', reference: '100', unit: 'Unité', unitPriceHT: 800, tva: 10 },
];
const sub1_pastInvoices: SubscriptionInvoice[] = [
    { id: 'F-202301', status: 'Encaissée', issueDate: '2025-08-12', dueDate: '2025-09-12', amountTTC: 3300 },
    { id: 'F-202302', status: 'Encaissée', issueDate: '2025-07-12', dueDate: '2025-08-12', amountTTC: 3300 },
    { id: 'F-202303', status: 'Encaissée', issueDate: '2025-06-12', dueDate: '2025-07-12', amountTTC: 3300 },
    { id: 'F-202304', status: 'Encaissée', issueDate: '2025-05-12', dueDate: '2025-06-12', amountTTC: 3300 },
];
const sub1_futureInvoices: SubscriptionInvoice[] = [
    { id: 'F-202305-fut', status: 'En attente', issueDate: '2025-09-12', dueDate: '2025-10-12', amountTTC: 3300 },
    { id: 'F-202306-fut', status: 'En attente', issueDate: '2025-10-12', dueDate: '2025-11-12', amountTTC: 3300 },
    { id: 'F-202307-fut', status: 'En attente', issueDate: '2025-11-12', dueDate: '2025-12-12', amountTTC: 3300 },
];


// --- DATA FOR SUB_ALPHA ---
const sub_alpha_products: SubscriptionProduct[] = [{ id: 'prod_s_alpha_1', name: 'Licence Logiciel Basic', reference: 'LIC-BAS', unit: 'Mois', unitPriceHT: 480, tva: 20 }];
const sub_alpha_pastInvoices: SubscriptionInvoice[] = [
    { id: 'F-ALPHA-01', status: 'Encaissée', issueDate: '2025-09-10', dueDate: '2025-09-10', amountTTC: 576 },
    { id: 'F-ALPHA-02', status: 'Encaissée', issueDate: '2025-10-10', dueDate: '2025-10-10', amountTTC: 576 },
    { id: 'F-ALPHA-03', status: 'Encaissée', issueDate: '2025-11-10', dueDate: '2025-11-10', amountTTC: 576 },
];
const sub_alpha_futureInvoices: SubscriptionInvoice[] = [
    { id: 'F-ALPHA-04-fut', status: 'En attente', issueDate: '2026-02-10', dueDate: '2026-02-10', amountTTC: 576 },
    { id: 'F-ALPHA-05-fut', status: 'En attente', issueDate: '2026-03-10', dueDate: '2026-03-10', amountTTC: 576 },
];

// --- DATA FOR SUB_EPSILON ---
const sub_epsilon_products: SubscriptionProduct[] = [{ id: 'prod_s_eps_1', name: 'Support Technique Tier 1', reference: 'SUP-T1', unit: 'Mois', unitPriceHT: 50, tva: 20 }];
const sub_epsilon_pastInvoices: SubscriptionInvoice[] = Array.from({ length: 8 }, (_, i) => ({
    id: `F-EPS-${i + 1}`, status: 'Encaissée', issueDate: `2025-${10 + i > 12 ? (10 + i) % 12 : 10 + i}-11`, dueDate: `2025-${10 + i > 12 ? (10 + i) % 12 : 10 + i}-11`, amountTTC: 60
}));
const sub_epsilon_futureInvoices: SubscriptionInvoice[] = Array.from({ length: 4 }, (_, i) => ({
    id: `F-EPS-${i + 9}-fut`, status: 'En attente', issueDate: `2026-06-${11 + i}`, dueDate: `2026-06-${11 + i}`, amountTTC: 60
}));

// --- DATA FOR SUB_GAMMA ---
const sub_gamma_products: SubscriptionProduct[] = [{ id: 'prod_s_gam_1', name: 'Hébergement Web Micro', reference: 'WEB-MIC', unit: 'Mois', unitPriceHT: 10, tva: 20 }];
const sub_gamma_pastInvoices: SubscriptionInvoice[] = Array.from({ length: 6 }, (_, i) => ({
    id: `F-GAM-${i + 1}`, status: 'Encaissée', issueDate: `2024-${11 + i > 12 ? (11 + i) % 12 : 11 + i}-12`, dueDate: `2024-${11 + i > 12 ? (11 + i) % 12 : 11 + i}-12`, amountTTC: 12
}));

// --- DATA FOR SUB_THETA ---
const sub_theta_products: SubscriptionProduct[] = [{ id: 'prod_s_the_1', name: 'Service Maintenance Trimestriel', reference: 'MAIN-TRI', unit: 'Trimestre', unitPriceHT: 125, tva: 20 }];
const sub_theta_pastInvoices: SubscriptionInvoice[] = [
    { id: 'F-THE-01', status: 'Encaissée', issueDate: '2025-08-05', dueDate: '2025-08-05', amountTTC: 150 },
    { id: 'F-THE-02', status: 'Encaissée', issueDate: '2025-11-05', dueDate: '2025-11-05', amountTTC: 150 },
];
const sub_theta_futureInvoices: SubscriptionInvoice[] = [
    { id: 'F-THE-03-fut', status: 'En attente', issueDate: '2026-02-05', dueDate: '2026-02-05', amountTTC: 150 },
];

// --- DATA FOR SUB_IOTA ---
const sub_iota_products: SubscriptionProduct[] = [{ id: 'prod_s_iot_1', name: 'Consulting Expert - Mensuel', reference: 'CONS-EXP', unit: 'Mois', unitPriceHT: 1500, tva: 20 }];
const sub_iota_pastInvoices: SubscriptionInvoice[] = [
    { id: 'F-IOTA-01', status: 'Encaissée', issueDate: '2025-08-04', dueDate: '2025-09-04', amountTTC: 1800 },
    { id: 'F-IOTA-02', status: 'Encaissée', issueDate: '2025-09-04', dueDate: '2025-10-04', amountTTC: 1800 },
    { id: 'F-IOTA-03', status: 'En retard', issueDate: '2025-10-04', dueDate: '2025-11-04', amountTTC: 1800 },
];
const sub_iota_futureInvoices: SubscriptionInvoice[] = [
    { id: 'F-IOTA-04-fut', status: 'En attente', issueDate: '2025-11-04', dueDate: '2025-12-04', amountTTC: 1800 },
    { id: 'F-IOTA-05-fut', status: 'En attente', issueDate: '2025-12-04', dueDate: '2026-01-04', amountTTC: 1800 },
];

// --- DATA FOR SUB_LAMBDA ---
const sub_lambda_products: SubscriptionProduct[] = [{ id: 'prod_s_lam_1', name: 'Domaine & Hébergement Annuel', reference: 'DOM-ANN', unit: 'An', unitPriceHT: 180, tva: 20 }];
const sub_lambda_futureInvoices: SubscriptionInvoice[] = [
    { id: 'F-LAM-01-fut', status: 'En attente', issueDate: '2025-12-12', dueDate: '2025-12-12', amountTTC: 216 },
];


export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub_1',
    name: 'Abonnement 1',
    status: 'Actif',
    creationDate: '2025-01-12',
    invoiceCount: 12,
    amountHT: 2420, // Calculated from products
    amountTTC: 3300, // From screenshot
    // detail fields
    startDate: '2025-01-12',
    endDate: '2025-12-12',
    paymentMethod: 'Virement',
    recurrence: 'Tous les mois',
    paymentConditions: 'Paiement sous 25 jours',
    finalizationMode: 'Brouillon',
    invoicesIssued: { objective: 18, current: 12 },
    invoicesToIssue: 6,
    totalBilled: { objective: 23360, current: 40000 },
    remainingToBill: 5000,
    pastInvoices: sub1_pastInvoices,
    futureInvoices: sub1_futureInvoices,
    products: sub1_products,
  },
  {
    id: 'sub_alpha',
    name: 'Abonnement Alpha',
    status: 'En pause',
    creationDate: '2025-09-10',
    invoiceCount: 12,
    amountHT: 480,
    amountTTC: 576,
    startDate: '2025-09-10',
    endDate: '2026-09-09',
    paymentMethod: 'Prélèvement',
    recurrence: 'Tous les mois',
    paymentConditions: 'Comptant',
    finalizationMode: 'Validé',
    invoicesIssued: { objective: 12, current: 3 },
    invoicesToIssue: 9,
    totalBilled: { objective: 6912, current: 1728 },
    remainingToBill: 5184,
    products: sub_alpha_products,
    pastInvoices: sub_alpha_pastInvoices,
    futureInvoices: sub_alpha_futureInvoices,
  },
  {
    id: 'sub_epsilon',
    name: 'Abonnement Epsilon',
    status: 'Actif',
    creationDate: '2025-10-11',
    invoiceCount: 12,
    amountHT: 50,
    amountTTC: 60,
    startDate: '2025-10-11',
    endDate: '2026-10-10',
    paymentMethod: 'Prélèvement',
    recurrence: 'Tous les mois',
    paymentConditions: 'Comptant',
    finalizationMode: 'Validé',
    invoicesIssued: { objective: 12, current: 8 },
    invoicesToIssue: 4,
    totalBilled: { objective: 720, current: 480 },
    remainingToBill: 240,
    products: sub_epsilon_products,
    pastInvoices: sub_epsilon_pastInvoices,
    futureInvoices: sub_epsilon_futureInvoices,
  },
  {
    id: 'sub_gamma',
    name: 'Abonnement Gamma',
    status: 'Résilié',
    creationDate: '2024-11-12',
    invoiceCount: 6,
    amountHT: 10,
    amountTTC: 12,
    startDate: '2024-11-12',
    endDate: '2025-05-11',
    paymentMethod: 'Virement',
    recurrence: 'Tous les mois',
    paymentConditions: 'Paiement sous 25 jours',
    finalizationMode: 'Validé',
    invoicesIssued: { objective: 6, current: 6 },
    invoicesToIssue: 0,
    totalBilled: { objective: 72, current: 72 },
    remainingToBill: 0,
    products: sub_gamma_products,
    pastInvoices: sub_gamma_pastInvoices,
    futureInvoices: [],
  },
  {
    id: 'sub_theta',
    name: 'Abonnement Theta',
    status: 'En pause',
    creationDate: '2025-08-05',
    invoiceCount: 4,
    amountHT: 125,
    amountTTC: 150,
    startDate: '2025-08-05',
    endDate: '2026-08-04',
    paymentMethod: 'Prélèvement',
    recurrence: 'Tous les trimestres',
    paymentConditions: 'Comptant',
    finalizationMode: 'Validé',
    invoicesIssued: { objective: 4, current: 2 },
    invoicesToIssue: 2,
    totalBilled: { objective: 600, current: 300 },
    remainingToBill: 300,
    products: sub_theta_products,
    pastInvoices: sub_theta_pastInvoices,
    futureInvoices: sub_theta_futureInvoices,
  },
  {
    id: 'sub_iota',
    name: 'Abonnement Iota',
    status: 'Actif',
    creationDate: '2025-08-04',
    invoiceCount: 6,
    amountHT: 1500,
    amountTTC: 1800,
    startDate: '2025-08-04',
    endDate: '2026-02-03',
    paymentMethod: 'Virement',
    recurrence: 'Tous les mois',
    paymentConditions: 'Paiement sous 25 jours',
    finalizationMode: 'Brouillon',
    invoicesIssued: { objective: 6, current: 3 },
    invoicesToIssue: 3,
    totalBilled: { objective: 10800, current: 5400 },
    remainingToBill: 5400,
    products: sub_iota_products,
    pastInvoices: sub_iota_pastInvoices,
    futureInvoices: sub_iota_futureInvoices,
  },
  {
    id: 'sub_lambda',
    name: 'Abonnement Lambda',
    status: 'Actif',
    creationDate: '2025-12-12',
    invoiceCount: 1,
    amountHT: 180,
    amountTTC: 216,
    startDate: '2025-12-12',
    endDate: '2026-12-11',
    paymentMethod: 'Prélèvement',
    recurrence: 'Tous les ans',
    paymentConditions: 'Comptant',
    finalizationMode: 'Validé',
    invoicesIssued: { objective: 1, current: 0 },
    invoicesToIssue: 1,
    totalBilled: { objective: 216, current: 0 },
    remainingToBill: 216,
    products: sub_lambda_products,
    pastInvoices: [],
    futureInvoices: sub_lambda_futureInvoices,
  },
];
