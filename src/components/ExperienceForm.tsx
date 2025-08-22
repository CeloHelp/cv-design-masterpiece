
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCVContext } from '@/contexts/CVContext';
import { supabase } from '@/integrations/supabase/client';
import { Briefcase, Plus, Trash2, ArrowLeft, ArrowRight, Check, Sparkles, Loader2 } from 'lucide-react';

const ExperienceForm = () => {
  const { experiences, updateExperiences } = useCVContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [starText, setStarText] = useState('');

  // Etapas do formulário - Unindo Solução e Tecnologias
  const steps = [
    { title: 'Informações Básicas', required: ['company', 'position'] },
    { title: 'Contexto do Projeto', required: ['context'] },
    { title: 'Problema/Necessidade', required: ['problem'] },
    { title: 'Solução e Tecnologias', required: ['solution'] },
    { title: 'Impacto/Resultados', required: ['impact'] },
    { title: 'Texto STAR', required: ['starText'] }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      isPersonalProject: false,
      context: '',
      problem: '',
      solution: '',
      technologies: '',
      impact: '',
      starText: ''
    };
    setEditingExperience(newExperience);
    setCurrentStep(0);
    setIsModalOpen(true);
  };

  const editExperience = (experience: any) => {
    setEditingExperience({ ...experience });
    setCurrentStep(0);
    setIsModalOpen(true);
  };

  const updateEditingExperience = (field: string, value: string | boolean) => {
    setEditingExperience((prev: any) => ({ ...prev, [field]: value }));
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
      setCurrentStep(0);
    }
  };

  const removeExperience = (id: string) => {
    updateExperiences(experiences.filter(exp => exp.id !== id));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (!editingExperience) return false;
    const requiredFields = steps[currentStep].required;
    return requiredFields.some(field => {
      if (field === 'current' || field === 'isPersonalProject') return true;
      return editingExperience[field]?.trim();
    });
  };

  // Sugestões manuais organizadas por tipo e cargo
  const getManualSuggestions = (type: string, position: string) => {
    const suggestions = {
      description: {
        developer: [
          "Desenvolveu aplicações web utilizando React, Node.js e MongoDB, implementando funcionalidades que aumentaram a produtividade da equipe em 25%.",
          "Participou do desenvolvimento de APIs REST e integração com serviços de terceiros, garantindo alta performance e escalabilidade.",
          "Colaborou com equipes multidisciplinares para implementar soluções inovadoras e manter a qualidade do código através de code reviews."
        ],
        designer: [
          "Criou interfaces intuitivas e responsivas seguindo princípios de UX/UI, resultando em 30% de aumento na satisfação do usuário.",
          "Desenvolveu sistemas de design consistentes e bibliotecas de componentes para acelerar o processo de desenvolvimento.",
          "Realizou pesquisas com usuários e testes de usabilidade para validar soluções de design e otimizar a experiência do usuário."
        ],
        gerente: [
          "Liderou equipe de 8 pessoas, implementando metodologias ágeis que aumentaram a produtividade em 40%.",
          "Gerenciou orçamentos e recursos de projetos, garantindo entregas dentro do prazo e qualidade esperada.",
          "Desenvolveu estratégias de crescimento e processos otimizados que reduziram custos operacionais em 20%."
        ],
        analista: [
          "Analisou dados de negócio para identificar oportunidades de melhoria, gerando insights que impactaram positivamente os resultados.",
          "Desenvolveu relatórios e dashboards para monitoramento de KPIs e suporte à tomada de decisões estratégicas.",
          "Colaborou com diferentes departamentos para implementar soluções baseadas em dados e métricas de performance."
        ],
        default: [
          "Executou tarefas com excelência, superando metas estabelecidas e contribuindo para o crescimento da empresa.",
          "Colaborou efetivamente com equipes multifuncionais para atingir objetivos comuns e entregar resultados de qualidade.",
          "Demonstrou proatividade e iniciativa na resolução de problemas e implementação de melhorias nos processos."
        ]
      },
      problems: {
        developer: [
          "Baixa performance de aplicações web",
          "Código legado difícil de manter",
          "Falta de testes automatizados"
        ],
        designer: [
          "Interface pouco intuitiva para usuários",
          "Inconsistência visual entre produtos",
          "Baixa taxa de conversão"
        ],
        gerente: [
          "Baixa produtividade da equipe",
          "Processos ineficientes",
          "Falta de comunicação entre departamentos"
        ],
        analista: [
          "Dados espalhados em diferentes sistemas",
          "Relatórios manuais demorados",
          "Falta de insights para tomada de decisão"
        ],
        default: [
          "Processos manuais e repetitivos",
          "Falta de padronização",
          "Comunicação ineficiente"
        ]
      },
      solutions: {
        developer: [
          "Implementou otimizações que reduziram tempo de carregamento em 60%",
          "Refatorou código legado seguindo boas práticas de Clean Code",
          "Criou suíte de testes automatizados com cobertura de 90%"
        ],
        designer: [
          "Redesenhou interface baseada em pesquisa com usuários",
          "Desenvolveu design system unificado",
          "Implementou A/B tests que aumentaram conversão em 25%"
        ],
        gerente: [
          "Implementou metodologias ágeis (Scrum/Kanban)",
          "Criou workflows otimizados que reduziram retrabalho",
          "Estabeleceu canais de comunicação eficientes"
        ],
        analista: [
          "Implementou data warehouse centralizado",
          "Automatizou relatórios usando ferramentas de BI",
          "Criou dashboards interativos para análise em tempo real"
        ],
        default: [
          "Automatizou processos manuais usando ferramentas digitais",
          "Criou documentação e padrões de trabalho",
          "Implementou sistema de comunicação mais eficiente"
        ]
      },
      technologies: {
        developer: [
          "React, Node.js, JavaScript, TypeScript, MongoDB, PostgreSQL, Git, Docker",
          "Python, Django, REST APIs, GraphQL, AWS, Firebase, Jest, Cypress",
          "Vue.js, Angular, Express, MySQL, Redis, Kubernetes, CI/CD"
        ],
        designer: [
          "Figma, Adobe Creative Suite, Sketch, InVision, Principle, Zeplin",
          "Adobe XD, Framer, Miro, Hotjar, Google Analytics, Maze",
          "Canva, After Effects, Photoshop, Illustrator, Webflow"
        ],
        analista: [
          "Excel, Power BI, Tableau, SQL, Python, R, Google Analytics",
          "Looker, Qlik, SPSS, SAS, Jupyter, Pandas, NumPy",
          "Salesforce, HubSpot, Google Data Studio, BigQuery"
        ],
        default: [
          "Microsoft Office, Google Workspace, Slack, Trello, Asana",
          "Jira, Confluence, Notion, Zoom, Teams, CRM, ERP",
          "Monday.com, ClickUp, Zapier, Airtable, Calendly"
        ]
      },
      impact: {
        developer: [
          "Aumentou performance da aplicação em 60% e reduziu bugs em 40%",
          "Implementou funcionalidades que geraram 15% de aumento na receita",
          "Reduziu tempo de desenvolvimento em 30% através de automações"
        ],
        designer: [
          "Aumentou taxa de conversão em 25% e satisfação do usuário em 30%",
          "Reduziu tempo de design em 40% com sistema de componentes",
          "Melhorou usabilidade resultando em 50% menos suporte ao usuário"
        ],
        gerente: [
          "Aumentou produtividade da equipe em 40% e reduziu turnover em 30%",
          "Implementou processos que reduziram custos operacionais em 20%",
          "Melhorou entrega de projetos, atingindo 95% no prazo"
        ],
        analista: [
          "Identificou oportunidades que resultaram em 20% de aumento na receita",
          "Automatizou relatórios, economizando 15 horas semanais",
          "Criou insights que melhoraram tomada de decisão em 35%"
        ],
        default: [
          "Aumentou eficiência operacional em 25%",
          "Reduziu custos de processos em 15%",
          "Melhorou qualidade do atendimento ao cliente"
        ]
      }
    };

    // Determina categoria baseada no cargo
    const getCategory = (position: string) => {
      const pos = position.toLowerCase();
      if (pos.includes('desenvolv') || pos.includes('programador') || pos.includes('dev')) return 'developer';
      if (pos.includes('design') || pos.includes('ui') || pos.includes('ux')) return 'designer';
      if (pos.includes('gerente') || pos.includes('coordenador') || pos.includes('supervisor')) return 'gerente';
      if (pos.includes('analista') || pos.includes('dados') || pos.includes('business')) return 'analista';
      return 'default';
    };

    const category = getCategory(position);
    return suggestions[type]?.[category] || suggestions[type]?.default || [];
  };

  const getAISuggestion = async (type: string, field: string) => {
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('field-suggestions', {
        body: { type, context: editingExperience },
      });

      if (error) {
        console.error('Erro ao obter sugestão da IA:', error);
        alert('Erro ao obter sugestão da IA. Tente novamente.');
      } else if (data && data.suggestion) {
        updateEditingExperience(field, data.suggestion);
      }
    } catch (error) {
      console.error('Erro inesperado ao chamar a função de IA:', error);
      alert('Erro inesperado ao obter sugestão da IA.');
    } finally {
      setAiLoading(false);
    }
  };

  const generateStarText = async () => {
    if (!editingExperience.context || !editingExperience.problem || !editingExperience.solution || !editingExperience.impact) {
      alert('Por favor, preencha as informações de Contexto, Problema, Solução e Impacto antes de gerar o texto STAR.');
      return;
    }

    const prompt = `Com base nas informações fornecidas, crie um texto profissional seguindo o método STAR (Situação, Tarefa, Ação, Resultado) para um currículo. O texto deve ser corrido, bem estruturado e impactante, sem separar as seções. Foque em números e resultados quantitativos sempre que possível.

Informações fornecidas:
- Contexto do Projeto (Situação): ${editingExperience.context}
- Problema/Necessidade (Tarefa): ${editingExperience.problem}  
- Solução Implementada (Ação): ${editingExperience.solution}
- Impacto/Resultados (Resultado): ${editingExperience.impact}

Gere um texto único, fluido e profissional que incorpore todos esses elementos de forma natural. O texto deve ter entre 3-5 linhas e ser adequado para aparecer diretamente no currículo como descrição da experiência profissional.

Responda apenas com o texto sugerido, sem explicações ou comentários adicionais.`;

    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-suggestions', {
        body: { type: 'star_text', prompt, experience: editingExperience }
      });

      if (error) {
        console.error('Erro ao gerar texto STAR:', error);
        alert('Erro ao gerar texto STAR. Tente novamente.');
      } else if (data && data.suggestion) {
        updateEditingExperience('starText', data.suggestion);
      }
    } catch (error) {
      console.error('Erro inesperado ao gerar texto STAR:', error);
      alert('Erro inesperado ao gerar texto STAR.');
    } finally {
      setAiLoading(false);
    }
  };

  // Renderiza o conteúdo de cada etapa
  const renderStepContent = () => {
    if (!editingExperience) return null;
    
    switch (currentStep) {
      case 0: // Informações Básicas
        return (
          <div className="space-y-4">
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
                  <Input
                    id="startDate"
                    type="month"
                    value={editingExperience.startDate}
                    onChange={(e) => updateEditingExperience('startDate', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">Data de Término</Label>
                  <Input
                    id="endDate"
                    type="month"
                    value={editingExperience.endDate}
                    onChange={(e) => updateEditingExperience('endDate', e.target.value)}
                    disabled={editingExperience.current}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="current"
                  checked={editingExperience.current}
                  onCheckedChange={(checked) => {
                    updateEditingExperience('current', !!checked);
                    if (checked) {
                      updateEditingExperience('endDate', '');
                    }
                  }}
                />
                <Label htmlFor="current" className="text-sm font-normal">
                  Trabalho atual
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPersonalProject"
                  checked={editingExperience.isPersonalProject}
                  onCheckedChange={(checked) => {
                    updateEditingExperience('isPersonalProject', !!checked);
                  }}
                />
                <Label htmlFor="isPersonalProject" className="text-sm font-normal">
                  Projeto pessoal/freelance
                </Label>
              </div>
            </div>
          </div>
        );

      case 1: { // Contexto do Projeto
        const contextSuggestions = [
          'Desenvolvimento de um novo sistema de gestão para automatizar processos internos.',
          'Redesign da interface do usuário para melhorar a experiência e aumentar conversões.',
          'Implementação de uma solução de análise de dados para apoiar decisões estratégicas.',
          'Criação de uma plataforma de e-commerce para expandir vendas online.',
          'Desenvolvimento de APIs para integração entre sistemas legados e novas aplicações.'
        ];
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Qual era o contexto do projeto?</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => getAISuggestion('context', 'context')}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Sugestão IA
              </Button>
            </div>
            <Textarea
              value={editingExperience.context}
              onChange={(e) => updateEditingExperience('context', e.target.value)}
              placeholder="Descreva brevemente o contexto do projeto ou sua função"
              rows={4}
            />
          </div>
        );
      }

      case 2: { // Problema/Necessidade
        const problemSuggestions = [
          'Baixa performance de aplicações web ou sistemas lentos.',
          'Interface pouco intuitiva para usuários ou baixa taxa de conversão.',
          'Processos manuais e repetitivos, falta de automação.',
          'Falta de integração entre sistemas ou dados espalhados.',
          'Falta de relatórios e indicadores para tomada de decisão.'
        ];
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Qual era o problema, dor ou necessidade antes da sua atuação?</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => getAISuggestion('problems', 'problem')}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Sugestão IA
              </Button>
            </div>
            <Textarea
              value={editingExperience.problem}
              onChange={(e) => updateEditingExperience('problem', e.target.value)}
              placeholder="Descreva qual problema ou necessidade existia quando você chegou/iniciou"
              rows={4}
            />
          </div>
        );
      }

      case 3: { // Solução e Tecnologias
        const solutionSuggestions = [
          'Implementou automações e integrações para eliminar tarefas manuais utilizando JavaScript e Node.js.',
          'Redesenhou a interface do sistema com foco em usabilidade utilizando React e Material UI.',
          'Desenvolveu APIs e conectores para integração entre sistemas utilizando Python e FastAPI.',
          'Criou dashboards e relatórios automáticos para gestores utilizando Power BI e SQL.',
          'Refatorou código legado e implementou testes automatizados utilizando Jest e Cypress.'
        ];
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>O que você fez para resolver e quais tecnologias utilizou?</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => getAISuggestion('solutions', 'solution')}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Sugestão IA
              </Button>
            </div>
            <Textarea
              value={editingExperience.solution}
              onChange={(e) => updateEditingExperience('solution', e.target.value)}
              placeholder="Descreva as ações que você tomou e as tecnologias que utilizou"
              rows={4}
            />
          </div>
        );
      }

      case 4: // Impacto/Resultados
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Qual foi o impacto ou resultado da sua atuação?</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => getAISuggestion('impact', 'impact')}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Sugestão IA
              </Button>
            </div>
            <Textarea
              value={editingExperience.impact}
              onChange={(e) => updateEditingExperience('impact', e.target.value)}
              placeholder="Descreva o impacto e os resultados das suas ações"
              rows={4}
            />
          </div>
        );

      case 5: // Texto STAR
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">📝 Texto Final para o Currículo</h4>
              <p className="text-sm text-blue-700">
                Este será o texto que aparecerá no seu CV. Clique em "Gerar Texto STAR" para criar automaticamente 
                um texto profissional baseado nas informações das etapas anteriores, ou escreva sua própria versão.
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <Label>Texto da experiência para o currículo</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={generateStarText}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Gerar Texto STAR
              </Button>
            </div>
            
            <Textarea
              value={editingExperience.starText}
              onChange={(e) => updateEditingExperience('starText', e.target.value)}
              placeholder="Clique em 'Gerar Texto STAR' para criar automaticamente ou escreva seu próprio texto aqui..."
              rows={8}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Experiência Profissional
            </div>
            <Button onClick={addExperience} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {experiences.map((exp) => (
            <div 
              key={exp.id} 
              className="border rounded-lg p-4 space-y-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => editExperience(exp)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{exp.company || 'Nova Experiência'}</h4>
                  <p className="text-sm text-muted-foreground">{exp.position}</p>
                  <p className="text-xs text-muted-foreground">
                    {exp.startDate} - {exp.current ? 'Atual' : exp.endDate}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeExperience(exp.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {experiences.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma experiência adicionada</p>
              <p className="text-sm">Clique em "Adicionar" para começar</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Multi-Step */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              {editingExperience?.company ? 'Editar Experiência' : 'Nova Experiência'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Barra de Progresso */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Etapa {currentStep + 1} de {steps.length}</span>
                <span>{Math.round(progress)}% concluído</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm font-medium text-center">{steps[currentStep]?.title}</p>
            </div>

            {/* Conteúdo da Etapa */}
            <div className="min-h-[200px]">
              {renderStepContent()}
            </div>

            {/* Navegação */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              <div className="flex gap-2">
                {currentStep === steps.length - 1 ? (
                  <Button onClick={saveExperience} className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Salvar Experiência
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    disabled={!canProceed()}
                  >
                    Próximo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExperienceForm;
