
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

  const steps = [
    { title: 'Informações Básicas', fields: ['company', 'position', 'startDate', 'endDate', 'current', 'isPersonalProject'] },
    { title: 'Contexto do Projeto', fields: ['context'] },
    { title: 'Problema/Necessidade', fields: ['problem'] },
    { title: 'Solução', fields: ['solution'] },
    { title: 'Tecnologias', fields: ['technologies'] },
    { title: 'Impacto/Resultados', fields: ['impact'] }
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
      impact: ''
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
    const currentFields = steps[currentStep].fields;
    return currentFields.some(field => {
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
    if (!editingExperience?.position) {
      alert('Por favor, preencha o cargo para receber sugestões');
      return;
    }

    setAiLoading(true);
    try {
      // Primeiro tenta obter sugestões manuais
      const manualSuggestions = getManualSuggestions(type, editingExperience.position);
      
      if (manualSuggestions.length > 0) {
        // Seleciona uma sugestão aleatória
        const randomSuggestion = manualSuggestions[Math.floor(Math.random() * manualSuggestions.length)];
        updateEditingExperience(field, randomSuggestion);
        return;
      }

      // Fallback para IA (se disponível)
      const context = {
        company: editingExperience.company,
        position: editingExperience.position,
        startDate: editingExperience.startDate,
        endDate: editingExperience.endDate,
        problems: editingExperience.problem,
        solutions: editingExperience.solution
      };

      const { data, error } = await supabase.functions.invoke('ai-suggestions', {
        body: { type, context }
      });

      if (error) throw error;

      if (data?.suggestion) {
        updateEditingExperience(field, data.suggestion);
      }
    } catch (error) {
      console.error('Error getting suggestion:', error);
      alert('Erro ao obter sugestão. Tente novamente.');
    } finally {
      setAiLoading(false);
    }
  };

  const renderStepContent = () => {
    if (!editingExperience) return null;

    switch (currentStep) {
      case 0: // Informações Básicas
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{editingExperience.isPersonalProject ? 'Nome do Projeto' : 'Empresa'}</Label>
                <Input
                  value={editingExperience.company}
                  onChange={(e) => updateEditingExperience('company', e.target.value)}
                  placeholder={editingExperience.isPersonalProject ? 'Nome do seu projeto' : 'Nome da empresa'}
                />
              </div>
              <div>
                <Label>{editingExperience.isPersonalProject ? 'Função/Papel' : 'Cargo'}</Label>
                <Input
                  value={editingExperience.position}
                  onChange={(e) => updateEditingExperience('position', e.target.value)}
                  placeholder={editingExperience.isPersonalProject ? 'Seu papel no projeto' : 'Seu cargo'}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data de Início</Label>
                <Input
                  type="text"
                  value={editingExperience.startDate}
                  onChange={(e) => updateEditingExperience('startDate', e.target.value)}
                  placeholder="Digite: 15/01/2023 ou 01/2023"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  ✓ Aceita: DD/MM/AAAA ou MM/AAAA
                </p>
              </div>
              <div>
                <Label>Data de Fim</Label>
                <Input
                  type="text"
                  value={editingExperience.endDate}
                  onChange={(e) => updateEditingExperience('endDate', e.target.value)}
                  disabled={editingExperience.current}
                  placeholder="Digite: 30/12/2023 ou 12/2023"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  ✓ Aceita: DD/MM/AAAA ou MM/AAAA
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="personal-project"
                  checked={editingExperience.isPersonalProject}
                  onCheckedChange={(checked) => updateEditingExperience('isPersonalProject', checked as boolean)}
                />
                <Label htmlFor="personal-project">Projeto pessoal</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="current-job"
                  checked={editingExperience.current}
                  onCheckedChange={(checked) => updateEditingExperience('current', checked as boolean)}
                />
                <Label htmlFor="current-job">
                  {editingExperience.isPersonalProject ? 'Atualmente trabalhando no projeto' : 'Trabalho atual'}
                </Label>
              </div>
            </div>
          </div>
        );

      case 1: { // Contexto do Projeto
        const contextSuggestions = [
          'Sistema interno de cadastro de exames médicos usado por clínicas da rede.',
          'Aplicação de pagamentos que processa transações feitas pelos clientes no app mobile.',
          'Plataforma de agendamento de consultas integrada a sistemas legados.',
          'CRUD de gerenciamento de produtos para uso de atendentes no e-commerce.',
          'Dashboard de indicadores para líderes técnicos visualizarem a performance dos serviços.'
        ];
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Conte sobre o contexto do projeto</Label>
            </div>
            <Textarea
              value={editingExperience.context}
              onChange={(e) => updateEditingExperience('context', e.target.value)}
              placeholder="Descreva o que era o projeto, o que ele solucionava e para quem foi desenvolvido"
              rows={4}
            />
            {/* Card de sugestões de projetos */}
            <div className="mt-2">
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Exemplos de Respostas:</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {contextSuggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        className="rounded border border-blue-100 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm text-left hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                        onClick={() => updateEditingExperience('context', s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
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
            {/* Card de exemplos de problemas */}
            <div className="mt-2">
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Exemplos de Respostas:</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {problemSuggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        className="rounded border border-blue-100 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm text-left hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                        onClick={() => updateEditingExperience('problem', s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      }

      case 3: { // Solução
        const solutionSuggestions = [
          'Implementou automações e integrações para eliminar tarefas manuais.',
          'Redesenhou a interface do sistema com foco em usabilidade.',
          'Desenvolveu APIs e conectores para integração entre sistemas.',
          'Criou dashboards e relatórios automáticos para gestores.',
          'Refatorou código legado e implementou testes automatizados.'
        ];
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>O que você fez para resolver?</Label>
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
              placeholder="Descreva as ações que você tomou"
              rows={4}
            />
            {/* Card de exemplos de soluções */}
            <div className="mt-2">
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Exemplos de Respostas:</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {solutionSuggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        className="rounded border border-blue-100 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm text-left hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                        onClick={() => updateEditingExperience('solution', s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      }

      case 4: // Tecnologias
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Quais tecnologias e ferramentas usou?</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => getAISuggestion('technologies', 'technologies')}
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
            <Input
              value={editingExperience.technologies}
              onChange={(e) => updateEditingExperience('technologies', e.target.value)}
              placeholder="Ex: Java, Spring Boot, PostgreSQL, Docker..."
            />
          </div>
        );

      case 5: // Impacto/Resultados
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
              placeholder="Descreva os resultados obtidos"
              rows={4}
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
