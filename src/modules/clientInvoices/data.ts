import { ClientInvoice, PAStatus } from './types'; // PAStatus might come from global types

export const mockClientInvoices: ClientInvoice[] = [
  { 
    id: 'F2023001', 
    invoiceNumber: 'F2023001', 
    clientName: 'Alpha SARL', 
    issueDate: '2023-10-15', 
    dueDate: '2023-11-14', 
    totalAmountTTC: 1200.50, 
    status: 'ENCAISSEE' as PAStatus, 
    pdpTransmissionDate: '2023-10-16T10:00:00Z', // Date de paiement ou de transmission validée
    statusHistory: [
      { id: 'sh1-f001', date: '2023-10-15T09:00:00Z', status: 'Créée (BROUILLON)', changedBy: 'Système' },
      { id: 'sh2-f001', date: '2023-10-15T10:00:00Z', status: 'Approuvée (APPROUVEE_INTERNE)', changedBy: 'Marcel GENIALLY' },
      { id: 'sh3-f001', date: '2023-10-15T14:00:00Z', status: 'Déposée PA (DEPOSEE_PA)', changedBy: 'Système' },
      { id: 'sh4-f001', date: '2023-10-15T15:00:00Z', status: 'Transmise Client (VALIDEE_PA)', changedBy: 'PA Partenaire' },
      { id: 'sh5-f001', date: '2023-10-16T09:00:00Z', status: 'Reçue Client (TELECHARGEE_CLIENT)', changedBy: 'PA Client XYZ' },
      { id: 'sh6-f001', date: '2023-10-20T10:00:00Z', status: 'Payée (PAYEE)', changedBy: 'Système Bancaire', notes: 'Paiement reçu via virement.' },
      { id: 'sh7-f001', date: '2023-10-20T11:00:00Z', status: 'Encaissée (ENCAISSEE)', changedBy: 'Système Comptable', notes: 'Paiement rapproché.' },
    ],
    communicationHistory: [
      { id: 'ch1-f001', date: '2023-10-15T15:05:00Z', type: 'Notification Système', summary: 'Facture F2023001 transmise au client Alpha SARL.' },
    ]
  },
  { 
    id: 'F2023002', 
    invoiceNumber: 'F2023002', 
    clientName: 'Beta Industries', 
    issueDate: '2023-10-20', 
    dueDate: '2023-11-19', 
    totalAmountTTC: 350.00, 
    status: 'EN_RETARD' as PAStatus, 
    reminderSent: true,
    pdpTransmissionDate: '2023-10-21T11:30:00Z', // Date de transmission validée
    statusHistory: [
      { id: 'sh1-f002', date: '2023-10-20T10:00:00Z', status: 'Créée (BROUILLON)', changedBy: 'Système' },
      { id: 'sh2-f002', date: '2023-10-20T12:00:00Z', status: 'Approuvée (APPROUVEE_INTERNE)', changedBy: 'Marcel GENIALLY' },
      { id: 'sh3-f002', date: '2023-10-21T11:30:00Z', status: 'Déposée PA (DEPOSEE_PA)', changedBy: 'Système' },
      { id: 'sh4-f002', date: '2023-10-21T12:00:00Z', status: 'Transmise Client (VALIDEE_PA)', changedBy: 'PA Partenaire' },
      { id: 'sh5-f002', date: '2023-10-22T09:00:00Z', status: 'Reçue Client (TELECHARGEE_CLIENT)', changedBy: 'PA Client ABC' },
      { id: 'sh6-f002', date: '2023-11-20T00:00:01Z', status: 'En Retard (EN_RETARD)', changedBy: 'Système', notes: 'Échéance dépassée.' },
    ],
    communicationHistory: [
      { id: 'ch1-f002', date: '2023-11-21T10:00:00Z', type: 'Email', summary: 'Première relance envoyée à Beta Industries.', user: 'Sophie D.' },
    ] 
  },
  { 
    id: 'F2023003', 
    invoiceNumber: 'F2023003', 
    clientName: 'Gamma Services', 
    issueDate: '2023-11-01', 
    dueDate: '2023-12-01', 
    totalAmountTTC: 780.75, 
    status: 'VALIDEE_PA' as PAStatus, // Transmise au client
    pdpTransmissionDate: '2023-11-02T09:15:00Z',
    statusHistory: [
        { id: 'sh1-f003', date: '2023-11-01T08:00:00Z', status: 'Créée (BROUILLON)', changedBy: 'Système' },
        { id: 'sh2-f003', date: '2023-11-01T09:00:00Z', status: 'Approuvée (APPROUVEE_INTERNE)', changedBy: 'Aline P.' },
        { id: 'sh3-f003', date: '2023-11-02T09:15:00Z', status: 'Déposée PA (DEPOSEE_PA)', changedBy: 'Système' },
        { id: 'sh4-f003', date: '2023-11-02T10:00:00Z', status: 'Transmise Client (VALIDEE_PA)', changedBy: 'PA Partenaire' },
    ],
    communicationHistory: []
  },
  { 
    id: 'F2023004', 
    invoiceNumber: 'F2023004', 
    clientName: 'Delta Solutions', 
    issueDate: '2023-11-05', 
    dueDate: '2023-12-05', 
    totalAmountTTC: 2100.00, 
    status: 'APPROUVEE_INTERNE' as PAStatus, 
    pdpTransmissionDate: '2023-11-06T14:00:00Z', // This date might be for a future step
    statusHistory: [
        { id: 'sh1-f004', date: '2023-11-05T00:00:00Z', status: 'Créée (BROUILLON)', changedBy: 'Marcel GENIALLY'},
        { id: 'sh2-f004', date: '2023-11-05T10:00:00Z', status: 'Approuvée (APPROUVEE_INTERNE)', changedBy: 'Marcel GENIALLY'},
    ],
    communicationHistory: []
  },
  { 
    id: 'F2023005', 
    invoiceNumber: 'F2023005', 
    clientName: 'Epsilon Tech', 
    issueDate: '2023-11-10', 
    dueDate: '2023-12-10', 
    totalAmountTTC: 550.20, 
    status: 'DEPOSEE_PA' as PAStatus, 
    pdpTransmissionDate: '2023-11-10T16:45:00Z',
    statusHistory: [
        { id: 'sh1-f005', date: '2023-11-10T09:00:00Z', status: 'Créée (BROUILLON)', changedBy: 'Système'},
        { id: 'sh2-f005', date: '2023-11-10T10:00:00Z', status: 'Approuvée (APPROUVEE_INTERNE)', changedBy: 'Aline P.'},
        { id: 'sh3-f005', date: '2023-11-10T16:45:00Z', status: 'Déposée PA (DEPOSEE_PA)', changedBy: 'Système' },
    ],
    communicationHistory: []
  },
  { 
    id: 'F2023006', 
    invoiceNumber: 'F2023006', 
    clientName: 'Zeta Corp', 
    issueDate: '2023-11-12', 
    dueDate: '2023-12-12', 
    totalAmountTTC: 95.80, 
    status: 'REJETEE_PA' as PAStatus, 
    pdpTransmissionDate: '2023-11-13T08:30:00Z', 
    rejectionReason: 'Format de fichier incorrect',
    statusHistory: [
        { id: 'sh1-f006', date: '2023-11-12T00:00:00Z', status: 'Créée (BROUILLON)', changedBy: 'Aline P.'},
        { id: 'sh2-f006', date: '2023-11-12T09:00:00Z', status: 'Approuvée (APPROUVEE_INTERNE)', changedBy: 'Aline P.'},
        { id: 'sh3-f006', date: '2023-11-13T08:00:00Z', status: 'Déposée PA (DEPOSEE_PA)', changedBy: 'Système'},
        { id: 'sh4-f006', date: '2023-11-13T08:30:00Z', status: 'Rejetée PA (REJETEE_PA)', changedBy: 'PA Partenaire', notes: 'Format de fichier incorrect'},
    ],
    communicationHistory: []
  },
  { 
    id: 'F2023007', 
    invoiceNumber: 'F2023007', 
    clientName: 'Omega SARL', 
    issueDate: '2023-11-15', 
    dueDate: '2023-12-15', 
    totalAmountTTC: 120.00, 
    status: 'REFUSEE_CLIENT' as PAStatus, 
    pdpTransmissionDate: '2023-11-16T10:00:00Z', // Date of transmission
    statusHistory: [
        { id: 'sh1-f007', date: '2023-11-15T09:00:00Z', status: 'Créée (BROUILLON)', changedBy: 'Système' },
        { id: 'sh2-f007', date: '2023-11-15T10:00:00Z', status: 'Approuvée (APPROUVEE_INTERNE)', changedBy: 'Marcel GENIALLY' },
        { id: 'sh3-f007', date: '2023-11-16T10:00:00Z', status: 'Déposée PA (DEPOSEE_PA)', changedBy: 'Système' },
        { id: 'sh4-f007', date: '2023-11-16T11:00:00Z', status: 'Transmise Client (VALIDEE_PA)', changedBy: 'PA Partenaire' },
        { id: 'sh5-f007', date: '2023-11-17T09:00:00Z', status: 'Reçue Client (TELECHARGEE_CLIENT)', changedBy: 'PA Client XYZ' },
        { id: 'sh6-f007', date: '2023-11-18T14:00:00Z', status: 'Refusée Client (REFUSEE_CLIENT)', changedBy: 'Client Omega SARL', notes: 'Article incorrect sur la facture.' },
    ],
    communicationHistory: [
        { id: 'ch1-f007', date: '2023-11-18T14:05:00Z', type: 'Notification Système', summary: 'Le client Omega SARL a refusé la facture F2023007.' },
    ] 
  },
  { 
    id: 'F2023008', 
    invoiceNumber: 'F2023008', 
    clientName: 'Kappa Co.', 
    issueDate: '2023-11-20', 
    dueDate: '2023-12-20', 
    totalAmountTTC: 3000.00, 
    status: 'BROUILLON' as PAStatus,
    statusHistory: [
        { id: 'sh1-f008', date: '2023-11-20T00:00:00Z', status: 'Créée (BROUILLON)', changedBy: 'Système' },
    ],
    communicationHistory: [] 
  },
  { 
    id: 'F2023009', 
    invoiceNumber: 'F2023009', 
    clientName: 'Lambda Group', 
    issueDate: '2023-11-25', 
    dueDate: '2023-12-25', 
    totalAmountTTC: 450.00, 
    status: 'ANNULEE' as PAStatus, 
    pdpTransmissionDate: '2023-11-26T11:00:00Z', // Date d'annulation
    statusHistory: [
        { id: 'sh1-f009', date: '2023-11-25T00:00:00Z', status: 'Créée (BROUILLON)', changedBy: 'Aline P.'},
        { id: 'sh2-f009', date: '2023-11-26T11:00:00Z', status: 'Annulée (ANNULEE)', changedBy: 'Aline P.', notes: 'Erreur de saisie client.'},
    ],
    communicationHistory: []
  },
  { 
    id: 'F2023010', 
    invoiceNumber: 'F2023010', 
    clientName: 'Alpha SARL', 
    issueDate: '2024-05-01', 
    dueDate: '2024-05-31', 
    totalAmountTTC: 500.00, 
    status: 'EN_RETARD' as PAStatus, 
    reminderSent: false,
  },
];