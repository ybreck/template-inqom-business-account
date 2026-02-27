import { ModuleComponentProps as GlobalModuleComponentProps } from '../../../types';

export interface CashFlowDataPoint {
    month: string;
    actual?: number;
    forecast?: number;
}

export interface Activity {
    id: string;
    name: string;
}

export interface ActivityClient {
    id: string;
    name: string;
}

export type ModuleComponentProps = GlobalModuleComponentProps;
