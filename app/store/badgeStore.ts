import { create } from 'zustand';
import { getBadges } from '@/app/services/api';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirements: {
    type: string;
    value: number;
  };
}

export interface UserBadge {
  id: string;
  badge: Badge;
  progress: number;
  completed: boolean;
  completed_at?: string;
}

interface BadgeStore {
  badges: UserBadge[];
  isLoading: boolean;
  error: string | null;
  fetchBadges: () => Promise<void>;
}

export const useBadgeStore = create<BadgeStore>((set) => ({
  badges: [],
  isLoading: false,
  error: null,
  fetchBadges: async () => {
    try {
      set({ isLoading: true, error: null });
      const badges = await getBadges();
      set({ badges, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch badges',
        isLoading: false 
      });
    }
  },
})); 