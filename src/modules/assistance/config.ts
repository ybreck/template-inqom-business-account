
import React from 'react';
import AssistancePage from './AssistancePage';
import { QuestionMarkCircleIcon } from '../../constants/icons';
import { PageConfig } from '../../../types';

export const assistanceConfig: PageConfig = {
  id: 'assistance',
  title: 'Besoin d’assistance ?',
  icon: QuestionMarkCircleIcon,
  component: AssistancePage,
  description: "Accédez à notre centre d'aide, FAQ, ou contactez notre support client."
};
