
import React from 'react';
import TaxesPage from './TaxesPage';
import { ScaleIcon } from '../../constants/icons';
import { PageConfig } from '../../../types';

export const taxesConfig: PageConfig = {
  id: 'taxes',
  title: 'Taxes',
  icon: ScaleIcon,
  component: TaxesPage,
  description: "Consultez et gérez vos échéances fiscales."
};
