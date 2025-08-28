import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DatePicker } from '@/components/ui/date-picker';
import { useCVContext } from '@/contexts/CVContext';
import { supabase } from '@/integrations/supabase/client';
import { Briefcase, Plus, Trash2, Check, Sparkles, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface Achievement {
  id: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  finalDescription: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  isPersonalProject: boolean;
  achievements: Achievement[];
}

const ExperienceForm = () => {
  const { experiences, updateExperiences } = useCVContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [aiLoading, setAiLoading] = useState<{[key: string]: boolean}>({});

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      isPersonalProject: false,
      achievements: [{
        id: Date.now().toString(),
        situation: '',
        task: '',
        action: '',
        result: '',
        finalDescription: ''
      }]
    };
    setEditingExperience(newExperience);
    setIsModalOpen(true);
  };

  const editExperience = (experience: Experience) => {
    setEditingExperience({ ...experience });
    setIsModalOpen(true);
  };

  const updateEditingExperience = (field: string, value: string | boolean | Date) => {
    if (!editingExperience) return;
    
    if (value instanceof Date) {
      const formattedDate = format(value, 'yyyy-MM-dd');
      setEditingExperience(prev => prev ? { ...prev, [field]: formattedDate } : null);
    } else {
      setEditingExperience(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    try {
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return new Date(dateString + 'T00:00:00.000Z');
      }
      const parsed = new Date(dateString);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    } catch {
      return undefined;
    }
  };

  const saveExperience = () => {
    if (editingExperience) {
      const existingIndex = experiences.findIndex(exp => exp.id === editingExperience.id);
      if (existingIndex >= 0) {
        const updated = [...experiences];
        updated[existingIndex] = editingExperience;
        updateExperiences(updated);
      } else {
        updateExperiences([...experiences, editingExperience]);
      }
      setIsModalOpen(false);
      setEditingExperience(null);
    }
  };

  const removeExperience = (id: string) => {
    updateExperiences(experiences.filter(exp => exp.id !== id));
  };

  const addAchievement = () => {
    if (!editingExperience) return;
    
    const newAchievement: Achievement = {
      id: Date.now().toString(),
      situation: '',
      task: '',
      action: '',
      result: '',
      finalDescription: ''
    };
    
    setEditingExperience(prev => prev ? {
      ...prev,
      achievements: [...prev.achievements, newAchievement]
    } : null);
  };

  const updateAchievement = (achievementId: string, field: string, value: string) => {
    if (!editingExperience) return;
    
    setEditingExperience(prev => prev ? {
      ...prev,
      achievements: prev.achievements.map(achievement =>
        achievement.id === achievementId
          ? { ...achievement, [field]: value }
          : achievement
      )
    } : null);
  };

  const removeAchievement = (achievementId: string) => {
    if (!editingExperience) return;
    
    setEditingExperience(prev => prev ? {
      ...prev,
      achievements: prev.achievements.filter(achievement => achievement.id !== achievementId)
    } : null);
  };

  const refineWithAI = async (achievementId: string, field: string) => {
    if (!editingExperience) return;
    
    const achievement = editingExperience.achievements.find(a => a.id === achievementId);
    if (!achievement || !achievement[field as keyof Achievement]?.trim()) {
      alert('Preencha o campo primeiro para que a IA possa refiná-lo.');
      return;
    }

    const loadingKey = `${achievementId}-${field}`;
    setAiLoading(prev => ({ ...prev, [loadingKey]: true }));

    try {
      const { data, error } = await supabase.functions.invoke('field-suggestions', {
        body: {
          type: 'refine',
          context: editingExperience,
          fieldToRefine: field,
          currentText: achievement[field as keyof Achievement]
        },
      });

      if (error) {
        console.error('Erro ao obter sugestão da IA:', error);
        alert('Erro ao obter sugestão da IA. Tente novamente.');
      } else if (data && data.suggestion) {
        updateAchievement(achievementId, field, data.suggestion);
      }
    } catch (error) {
      console.error('Erro inesperado ao chamar a função de IA:', error);
      alert('Erro inesperado ao obter sugestão da IA.');
    } finally {
      setAiLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const generateDescription = async (achievementId: string) => {
    if (!editingExperience) return;
    
    const achievement = editingExperience.achievements.find(a => a.id === achievementId);
    if (!achievement || !achievement.situation || !achievement.task || !achievement.action || !achievement.result) {
      alert('Preencha todos os campos STAR antes de gerar a descrição.');
      return;
    }

    const loadingKey = `${achievementId}-description`;
    setAiLoading(prev => ({ ...prev, [loadingKey]: true }));

    const prompt = `Com base nas informações STAR fornecidas, crie um texto profissional para currículo que incorpore todos os elementos de forma natural e fluida:

Situação: ${achievement.situation}
Tarefa: ${achievement.task}
Ação: ${achievement.action}
Resultado: ${achievement.result}

Gere um texto único, fluido e profissional entre 2-4 linhas adequado para currículo.
Responda apenas com o texto sugerido.`;

    try {
      const { data, error } = await supabase.functions.invoke('ai-suggestions', {
        body: { prompt }
      });

      if (error) {
        console.error('Erro ao gerar descrição:', error);
        alert('Erro ao gerar descrição. Tente novamente.');
      } else if (data && data.suggestion) {
        updateAchievement(achievementId, 'finalDescription', data.suggestion);
      }
    } catch (error) {
      console.error('Erro inesperado ao gerar descrição:', error);
      alert('Erro inesperado ao gerar descrição.');
    } finally {
      setAiLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Experiência Profissional
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {experiences.map((experience) => (
            <Card key={experience.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardContent className="p-4" onClick={() => editExperience(experience)}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{experience.position}</h3>
                    <p className="text-sm text-muted-foreground">{experience.company}</p>
                    <p className="text-xs text-muted-foreground">
                      {experience.startDate} - {experience.current ? 'Atual' : experience.endDate}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeExperience(experience.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button onClick={addExperience} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Experiência
          </Button>
        </div>
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingExperience?.id ? 'Editar Experiência' : 'Nova Experiência'}
            </DialogTitle>
          </DialogHeader>

          {editingExperience && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informações Básicas</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="company">Empresa/Organização</Label>
                    <Input
                      id="company"
                      value={editingExperience.company}
                      onChange={(e) => updateEditingExperience('company', e.target.value)}
                      placeholder="Nome da empresa ou organização"
                    />
                  </div>

                  <div>
                    <Label htmlFor="position">Cargo/Posição</Label>
                    <Input
                      id="position"
                      value={editingExperience.position}
                      onChange={(e) => updateEditingExperience('position', e.target.value)}
                      placeholder="Seu cargo ou função"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Data de Início</Label>
                      <DatePicker
                        date={parseDate(editingExperience.startDate)}
                        onSelect={(date) => {
                          if (date) {
                            updateEditingExperience('startDate', date);
                          }
                        }}
                        placeholder="Selecione a data de início"
                      />
                    </div>

                    <div>
                      <Label htmlFor="endDate">Data de Término</Label>
                      <DatePicker
                        date={parseDate(editingExperience.endDate)}
                        onSelect={(date) => {
                          if (date) {
                            updateEditingExperience('endDate', date);
                          }
                        }}
                        placeholder="Selecione a data de término"
                        disabled={editingExperience.current}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="current"
                      checked={editingExperience.current}
                      onCheckedChange={(checked) => updateEditingExperience('current', !!checked)}
                    />
                    <Label htmlFor="current">Trabalho atual</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isPersonalProject"
                      checked={editingExperience.isPersonalProject}
                      onCheckedChange={(checked) => updateEditingExperience('isPersonalProject', !!checked)}
                    />
                    <Label htmlFor="isPersonalProject">Projeto pessoal</Label>
                  </div>
                </div>
              </div>

              {/* Conquistas e Responsabilidades */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Conquistas e Responsabilidades</h3>
                
                {editingExperience.achievements.map((achievement, index) => (
                  <Card key={achievement.id} className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-md font-medium">Conquista #{index + 1}</h4>
                      {editingExperience.achievements.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAchievement(achievement.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* Situação (S) */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="flex items-center gap-2">
                            Situação (S)
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              ℹ️
                            </span>
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => refineWithAI(achievement.id, 'situation')}
                            disabled={aiLoading[`${achievement.id}-situation`]}
                          >
                            {aiLoading[`${achievement.id}-situation`] ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Sparkles className="w-4 h-4" />
                            )}
                            Melhorar
                          </Button>
                        </div>
                        <Textarea
                          value={achievement.situation}
                          onChange={(e) => updateAchievement(achievement.id, 'situation', e.target.value)}
                          placeholder="Ex: A API de pagamentos apresentava alta latência em picos de uso..."
                          className="min-h-[80px]"
                        />
                      </div>

                      {/* Tarefa (T) */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="flex items-center gap-2">
                            Tarefa (T)
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              ℹ️
                            </span>
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => refineWithAI(achievement.id, 'task')}
                            disabled={aiLoading[`${achievement.id}-task`]}
                          >
                            {aiLoading[`${achievement.id}-task`] ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Sparkles className="w-4 h-4" />
                            )}
                            Melhorar
                          </Button>
                        </div>
                        <Textarea
                          value={achievement.task}
                          onChange={(e) => updateAchievement(achievement.id, 'task', e.target.value)}
                          placeholder="Ex: Minha tarefa era otimizar a performance da API para reduzir o tempo de resposta em 50%."
                          className="min-h-[80px]"
                        />
                      </div>

                      {/* Ação (A) */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="flex items-center gap-2">
                            Ação (A)
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              ℹ️
                            </span>
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => refineWithAI(achievement.id, 'action')}
                            disabled={aiLoading[`${achievement.id}-action`]}
                          >
                            {aiLoading[`${achievement.id}-action`] ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Sparkles className="w-4 h-4" />
                            )}
                            Melhorar
                          </Button>
                        </div>
                        <Textarea
                          value={achievement.action}
                          onChange={(e) => updateAchievement(achievement.id, 'action', e.target.value)}
                          placeholder="Ex: Implementei um sistema de cache com Redis, otimizei queries no banco de dados PostgreSQL e refatorei o código para usar processamento assíncrono."
                          className="min-h-[80px]"
                        />
                      </div>

                      {/* Resultado (R) */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="flex items-center gap-2">
                            Resultado (R)
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              ℹ️
                            </span>
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => refineWithAI(achievement.id, 'result')}
                            disabled={aiLoading[`${achievement.id}-result`]}
                          >
                            {aiLoading[`${achievement.id}-result`] ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Sparkles className="w-4 h-4" />
                            )}
                            Melhorar
                          </Button>
                        </div>
                        <Textarea
                          value={achievement.result}
                          onChange={(e) => updateAchievement(achievement.id, 'result', e.target.value)}
                          placeholder="Ex: Redução de 60% no tempo de resposta médio, suportando 20k requisições por minuto e eliminando 99% dos erros de timeout."
                          className="min-h-[80px]"
                        />
                      </div>

                      {/* Descrição Final */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Descrição Final (Gerada)</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generateDescription(achievement.id)}
                            disabled={aiLoading[`${achievement.id}-description`]}
                          >
                            {aiLoading[`${achievement.id}-description`] ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Sparkles className="w-4 h-4" />
                            )}
                            Gerar Descrição
                          </Button>
                        </div>
                        <Textarea
                          value={achievement.finalDescription}
                          onChange={(e) => updateAchievement(achievement.id, 'finalDescription', e.target.value)}
                          placeholder="Preencha todos os campos STAR acima para gerar a descrição final..."
                          className="min-h-[100px] bg-muted/50"
                          readOnly={!achievement.finalDescription}
                        />
                      </div>
                    </div>
                  </Card>
                ))}

                <Button onClick={addAchievement} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Outra Conquista
                </Button>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={saveExperience} className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Salvar Experiência
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ExperienceForm;