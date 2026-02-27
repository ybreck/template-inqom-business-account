
import React from 'react';
import TresorerieModulePage from './TresorerieModulePage';
import BankPage from '../bank/BankPage'; // Assuming BankPage is the content for 'banque' tab
import FinancingTablePage from '../financingTable/FinancingTablePage'; // For 'tableau_financement' tab
import { BuildingLibraryIcon, TableCellsIcon, ArrowsRightLeftIcon, PresentationChartLineIcon } from '../../constants/icons';
import { PageConfig } from '../../../types';

export const tresorerieModuleConfig: PageConfig = {
  id: 'tresorerie',
  title: 'Trésorerie',
  icon: BuildingLibraryIcon,
  component: TresorerieModulePage,
  description: "Gérez votre trésorerie, vos comptes bancaires et vos prévisions."
};

export const tresorerieBanqueConfig: PageConfig = {
  id: 'banque',
  title: 'Banque',
  icon: BuildingLibraryIcon,
  component: BankPage,
  description: "Consultez vos soldes, mouvements et gérez vos opérations bancaires."
};

export const tresorerieTableauFinancementConfig: PageConfig = {
  id: 'tableau_financement',
  title: 'Tableau de financement',
  icon: TableCellsIcon,
  component: FinancingTablePage,
  description: "Visualisez et analysez votre tableau de financement prévisionnel et réel."
};

export const tresorerieEncaissementDecaissementConfig: PageConfig = {
  id: 'encaissement_decaissement',
  title: 'Encaissement / Décaissement',
  icon: ArrowsRightLeftIcon,
  description: "Suivez en détail vos flux de trésorerie entrants (encaissements) et sortants (décaissements)."
};

export const tresoreriePrevisionsConfig: PageConfig = {
  id: 'previsions_tresorerie',
  title: 'Prévisions',
  icon: PresentationChartLineIcon,
  description: "Établissez, ajustez et suivez vos prévisions de trésorerie à court et moyen terme."
};
