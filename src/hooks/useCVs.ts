
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface CVData {
  id?: string;
  title: string;
  personal_data: any;
  experiences: any[];
  education: any[];
  skills: string;
  languages: any[];
  selected_design: string;
  created_at?: string;
  updated_at?: string;
}

export const useCVs = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all CVs for the current user
  const { data: cvs, isLoading, error } = useQuery({
    queryKey: ['cvs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching CVs:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });

  // Save CV (create or update)
  const saveCVMutation = useMutation({
    mutationFn: async (cvData: CVData) => {
      if (!user) throw new Error('User not authenticated');

      const payload = {
        user_id: user.id,
        title: cvData.title,
        personal_data: cvData.personal_data,
        experiences: cvData.experiences,
        education: cvData.education,
        skills: cvData.skills,
        languages: cvData.languages,
        selected_design: cvData.selected_design,
      };

      if (cvData.id) {
        // Update existing CV
        const { data, error } = await supabase
          .from('cvs')
          .update(payload)
          .eq('id', cvData.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new CV
        const { data, error } = await supabase
          .from('cvs')
          .insert(payload)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cvs', user?.id] });
      toast({
        title: "CV salvo com sucesso!",
        description: `"${data.title}" foi salvo em sua conta.`,
      });
    },
    onError: (error) => {
      console.error('Error saving CV:', error);
      toast({
        title: "Erro ao salvar CV",
        description: "Não foi possível salvar o currículo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Delete CV
  const deleteCVMutation = useMutation({
    mutationFn: async (cvId: string) => {
      const { error } = await supabase
        .from('cvs')
        .delete()
        .eq('id', cvId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cvs', user?.id] });
      toast({
        title: "CV excluído",
        description: "O currículo foi removido com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error deleting CV:', error);
      toast({
        title: "Erro ao excluir CV",
        description: "Não foi possível excluir o currículo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Load a specific CV
  const loadCVMutation = useMutation({
    mutationFn: async (cvId: string) => {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('id', cvId)
        .single();

      if (error) throw error;
      return data;
    },
    onError: (error) => {
      console.error('Error loading CV:', error);
      toast({
        title: "Erro ao carregar CV",
        description: "Não foi possível carregar o currículo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    cvs: cvs || [],
    isLoading,
    error,
    saveCV: saveCVMutation.mutateAsync,
    deleteCV: deleteCVMutation.mutateAsync,
    loadCV: loadCVMutation.mutateAsync,
    isSaving: saveCVMutation.isPending,
    isDeleting: deleteCVMutation.isPending,
    isLoading: loadCVMutation.isPending,
  };
};
