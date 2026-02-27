import React from 'react';
import { PageConfig } from '../../../types';
import PaMarketingPage from './PdpMarketingPage';
import { BoltIcon } from '../../constants/icons';

export const paMarketingPageConfig: PageConfig = {
    id: 'facturation_electronique_pa',
    title: 'Facturation Électronique',
    icon: BoltIcon,
    component: PaMarketingPage,
    description: "Découvrez l'intégration de la PA pour la facturation électronique."
};