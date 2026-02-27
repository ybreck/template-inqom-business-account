

import React from 'react';
import { InvoiceSummaryData, MonthlyInvoiceData, KPIScorecardProps, MonthlyDataPoint } from './types';
import { CurrencyEuroIcon, ClockIcon } from './icons';
import { ScaleIcon } from '../../constants/icons';

export const clientInvoiceData: InvoiceSummaryData = {
  title: "Factures clients",
  totalNonCategorized: "6 233,31 €",
  infoTooltip: "Montant total des factures non-catégorisées",
  enRetard: {
    total: "25 195 €",
    segments: [
      { label: "0 à 30 j", value: 0, amount: "0 €", color: "bg-red-500" },
      { label: "30 à 60 j", value: 0, amount: "0 €", color: "bg-red-500" },
      { label: "> 60 j", value: 25195, amount: "25 195 €", color: "bg-red-500" },
    ]
  },
  aVenir: {
    total: "0 €",
    segments: [
      { label: "0 à 30 j", value: 0, amount: "0 €", color: "bg-gray-300" },
      { label: "30 à 60 j", value: 0, amount: "0 €", color: "bg-gray-300" },
      { label: "> 60 j", value: 0, amount: "0 €", color: "bg-gray-300" },
    ]
  }
};

export const supplierInvoiceData: InvoiceSummaryData = {
  title: "Factures fournisseurs",
  totalNonCategorized: "18 441,06 €",
  infoTooltip: "Montant total des factures non-catégorisées",
  enRetard: {
    total: "78 530 €",
    segments: [
      { label: "0 à 30 j", value: 543, amount: "543 €", color: "bg-red-400" },
      { label: "30 à 60 j", value: 0, amount: "0 €", color: "bg-red-500" },
      { label: "> 60 j", value: 77987, amount: "77 987 €", color: "bg-red-500" },
    ]
  },
  aVenir: {
    total: "0 €",
    segments: [
      { label: "0 à 30 j", value: 0, amount: "0 €", color: "bg-gray-300" },
      { label: "30 à 60 j", value: 0, amount: "0 €", color: "bg-gray-300" },
      { label: "> 60 j", value: 0, amount: "0 €", color: "bg-gray-300" },
    ]
  }
};

export const historyChartData: MonthlyInvoiceData[] = [
  { month: 'Sept. 23', clients: 1500, fournisseurs: 500 },
  { month: 'Oct. 23', clients: 8000, fournisseurs: 2000 },
  { month: 'Nov. 23', clients: 3000, fournisseurs: 1200 },
  { month: 'Déc. 23', clients: 6000, fournisseurs: 2500 },
  { month: 'Janv. 24', clients: 5000, fournisseurs: 1000 },
  { month: 'Févr. 24', clients: 7500, fournisseurs: 3000 },
  { month: 'Mars 24', clients: 1500, fournisseurs: 800 },
  { month: 'Avr. 24', clients: 20000, fournisseurs: 2000 },
  { month: 'Mai 24', clients: 12000, fournisseurs: 4000 },
  { month: 'Juin 24', clients: 9000, fournisseurs: 3500 },
  { month: 'Juil. 24', clients: 3500, fournisseurs: 1200 },
  { month: 'Août 24', clients: 2500, fournisseurs: 1800 },
];

export const kpiData: KPIScorecardProps[] = [
  {
    title: "Chiffre d'Affaires (Mois en cours)",
    value: "42 580 €",
    icon: React.createElement(CurrencyEuroIcon, {className: "text-theme-primary-500"}), 
    change: "+12.5%",
    changeType: "positive",
  },
  {
    title: "Marge Brute (Mois en cours)",
    value: "35.2%",
    icon: React.createElement(ScaleIcon, {className: "text-theme-primary-500"}), 
    change: "-1.8%",
    changeType: "negative",
  },
  {
    title: "Trésorerie Actuelle",
    value: "115 230 €",
    icon: React.createElement(CurrencyEuroIcon, {className: "text-theme-primary-500"}), 
    change: "+8 200 €",
    changeType: "positive",
  },
  {
    title: "Délai Moyen Paiement Clients (DSO)",
    value: "42 jours",
    icon: React.createElement(ClockIcon, {className: "text-theme-primary-500"}), 
    change: "+3 jours",
    changeType: "negative",
  },
];

export const revenueTrendData: MonthlyDataPoint[] = [
  { month: 'Janv', value: 35000 }, { month: 'Févr', value: 38000 }, { month: 'Mars', value: 41000 },
  { month: 'Avr', value: 39000 }, { month: 'Mai', value: 45000 }, { month: 'Juin', value: 42580 },
];

export const cashTrendData: MonthlyDataPoint[] = [
  { month: 'Janv', value: 85000 }, { month: 'Févr', value: 92000 }, { month: 'Mars', value: 78000 },
  { month: 'Avr', value: 105000 }, { month: 'Mai', value: 98000 }, { month: 'Juin', value: 115230 },
];
