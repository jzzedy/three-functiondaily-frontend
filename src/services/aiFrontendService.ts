import apiClient from './apiService'; 
export type SuggestionType = 
  | 'general_greeting' | 'task_tip' | 'expense_insight' 
  | 'habit_motivation' | 'daily_summary_prompt';
export interface AiSuggestionRequest { suggestionType: SuggestionType; }
export interface AiSuggestionResponse { messageType: string; text: string; suggestionCategory: SuggestionType; }
export const getAiSuggestionFromBackend = async (payload: AiSuggestionRequest): Promise<AiSuggestionResponse> => {
  const response = await apiClient.post<AiSuggestionResponse>('/ai/suggestion', payload);
  return response.data;
};