
import React from 'react';
// Import ModuleComponentProps from root types.ts
import { ModuleComponentProps as GlobalModuleComponentProps } from '../types';


// Shared type for Sidebar navigation items
export interface NavItem {
  id: string; 
  name: string;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>; 
  active?: boolean; 
  badge?: number;
  isDropdown?: boolean; 
  href?: string; 
  children?: NavItem[]; 
  isOpen?: boolean; 
}

// Make ModuleComponentProps available locally
export type ModuleComponentProps = GlobalModuleComponentProps;

// Shared type for Page Configuration in App.tsx
export interface PageConfig {
  title: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>; // Icon component for placeholders
  description?: string; // Description for placeholders
  component?: React.FC<ModuleComponentProps>; // Use the imported/re-exported ModuleComponentProps
}

// For News Feed
export interface NewsItem {
  id: string;
  title: string;
  date: string; // ISO 8601 string or display-friendly
  category: string; // Changed to string to allow more categories like 'Fiscalité'
  content: string;
  imageUrl?: string;
  link?: string; // Optional link for "Read more"
  read?: boolean; // Optional: for tracking read status
}
