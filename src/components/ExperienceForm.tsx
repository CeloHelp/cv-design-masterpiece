
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
import { Briefcase, Plus, Trash2, ArrowLeft, ArrowRight, Check } from 'lucide-react';

const ExperienceForm = () => {
  const { experiences, updateExperiences } = useCVContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Informações Básicas', fields: ['company', 'position', 'startDate', 'endDate', 'current', 'isPersonalProject'] },
    { title: 'Problema/Contexto', fields: ['problem'] },
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

      case 1: // Problema/Contexto
        return (
          <div>
            <Label>Qual era o problema, dor ou necessidade antes da sua atuação?</Label>
            <Textarea
              value={editingExperience.problem}
              onChange={(e) => updateEditingExperience('problem', e.target.value)}
              placeholder="Descreva qual problema ou necessidade existia"
              rows={4}
              className="mt-2"
            />
          </div>
        );

      case 2: // Solução
        return (
          <div>
            <Label>O que você fez para resolver?</Label>
            <Textarea
              value={editingExperience.solution}
              onChange={(e) => updateEditingExperience('solution', e.target.value)}
              placeholder="Descreva as ações que você tomou"
              rows={4}
              className="mt-2"
            />
          </div>
        );

      case 3: // Tecnologias
        return (
          <div>
            <Label>Quais tecnologias e ferramentas usou?</Label>
            <Input
              value={editingExperience.technologies}
              onChange={(e) => updateEditingExperience('technologies', e.target.value)}
              placeholder="Ex: Java, Spring Boot, PostgreSQL, Docker..."
              className="mt-2"
            />
          </div>
        );

      case 4: // Impacto/Resultados
        return (
          <div>
            <Label>Qual foi o impacto ou resultado da sua atuação?</Label>
            <Textarea
              value={editingExperience.impact}
              onChange={(e) => updateEditingExperience('impact', e.target.value)}
              placeholder="Descreva os resultados obtidos"
              rows={4}
              className="mt-2"
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
