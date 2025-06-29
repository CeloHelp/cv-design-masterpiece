
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Statistics {
  totalCVs: number;
  designsPopularity: Array<{
    design: string;
    count: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    date: string;
    count: number;
  }>;
  userStats: {
    totalCVs: number;
    mostUsedDesign: string;
    lastActivity: string;
  };
}

export const useStatistics = () => {
  const { user } = useAuth();

  const { data: statistics, isLoading, error } = useQuery({
    queryKey: ['statistics', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Buscar estatísticas globais (todos os CVs)
      const { data: allCVs, error: allCVsError } = await supabase
        .from('cvs')
        .select('selected_design, created_at');

      if (allCVsError) {
        console.error('Error fetching all CVs:', allCVsError);
        throw allCVsError;
      }

      // Buscar CVs do usuário atual
      const { data: userCVs, error: userCVsError } = await supabase
        .from('cvs')
        .select('selected_design, created_at, updated_at')
        .order('updated_at', { ascending: false });

      if (userCVsError) {
        console.error('Error fetching user CVs:', userCVsError);
        throw userCVsError;
      }

      // Calcular popularidade dos designs
      const designCounts = (allCVs || []).reduce((acc, cv) => {
        acc[cv.selected_design] = (acc[cv.selected_design] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const totalCVs = allCVs?.length || 0;
      const designsPopularity = Object.entries(designCounts).map(([design, count]) => ({
        design,
        count,
        percentage: totalCVs > 0 ? Math.round((count / totalCVs) * 100) : 0,
      })).sort((a, b) => b.count - a.count);

      // Calcular atividade recente (últimos 7 dias)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentCVs = (allCVs || []).filter(cv => 
        new Date(cv.created_at) >= sevenDaysAgo
      );

      const activityByDate = recentCVs.reduce((acc, cv) => {
        const date = new Date(cv.created_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const recentActivity = Object.entries(activityByDate).map(([date, count]) => ({
        date,
        count,
      })).sort((a, b) => a.date.localeCompare(b.date));

      // Estatísticas do usuário
      const userDesignCounts = (userCVs || []).reduce((acc, cv) => {
        acc[cv.selected_design] = (acc[cv.selected_design] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostUsedDesign = Object.entries(userDesignCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'modern';
      const lastActivity = userCVs?.[0]?.updated_at || userCVs?.[0]?.created_at || '';

      const statistics: Statistics = {
        totalCVs,
        designsPopularity,
        recentActivity,
        userStats: {
          totalCVs: userCVs?.length || 0,
          mostUsedDesign,
          lastActivity,
        },
      };

      return statistics;
    },
    enabled: !!user,
  });

  return {
    statistics,
    isLoading,
    error,
  };
};
