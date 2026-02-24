import { Equipment } from './equipment';

export interface SavedConfiguration {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  equipment: Equipment[];
  description?: string;
  metadata?: {
    layoutDirection: 'horizontal' | 'vertical';
    showDetails: boolean;
  };
}
