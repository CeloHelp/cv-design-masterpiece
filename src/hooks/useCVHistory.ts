
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CVHistoryEntry {
  id: string;
  cv_id: string;
  version_number: number;
  title: string;
  personal_data: any;
  experiences: any[];
  education: any[];
  skills: string;
  languages: any[];
  selected_design: string;
  change_description: string | null;
  created_at: string;
}

export const useCVHistory = (cvId?: string) => {
  const { user } = useAuth();

  // Fetch history for a specific CV
  const { data: history, isLoading, error } = useQuery({
    queryKey: ['cv-history', cvId],
    queryFn: async () => {
      if (!user || !cvId) return [];
      
      const { data, error } = await supabase
        .from('cv_history')
        .select('*')
        .eq('cv_id', cvId)
        .order('version_number', { ascending: false });

      if (error) {
        console.error('Error fetching CV history:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user && !!cvId,
  });

  return {
    history: history || [],
    isLoading,
    error,
  };
};
