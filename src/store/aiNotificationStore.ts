import { create } from 'zustand';
import type { SuggestionType } from '../services/aiFrontendService'; 

export type AiAction = 
  | 'added' 
  | 'completed' 
  | 'created' 
  | 'threshold_reached' 
  | 'streak_update' 
  | 'repeated_category_expense' 
  | 'general_info' 
  | 'milestone';

export interface AiTriggerEventData { 
  itemName?: string; 
  itemValue?: string | number; 
  itemCategory?: string; 
  action?: AiAction; 
  count?: number; 
  currency?: 'PHP' | 'USD'; 
  
  [key: string]: unknown; 
}

export interface AiTriggerEvent {
  type: SuggestionType; 
  data?: AiTriggerEventData; 
  timestamp: number; 
}

interface AiNotificationState {
  lastEvent: AiTriggerEvent | null;
  triggerAiSuggestion: (eventData: Omit<AiTriggerEvent, 'timestamp'>) => void;
  clearLastEvent: () => void;
}

export const useAiNotificationStore = create<AiNotificationState>((set) => ({
  lastEvent: null,
  triggerAiSuggestion: (eventData) => {
    console.log('[AI_NOTIF_STORE] Triggering AI Suggestion:', eventData);
    set({ 
      lastEvent: { ...eventData, timestamp: Date.now() } 
    });
  },
  clearLastEvent: () => set({ lastEvent: null }),
}));
