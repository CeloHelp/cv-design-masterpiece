
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useCVContext } from '@/contexts/CVContext';
import { Briefcase, Plus, Trash2 } from 'lucide-react';

const ExperienceForm = () => {
  const { experiences, updateExperiences } = useCVContext();

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
    updateExperiences([...experiences, newExperience]);
  };

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    console.log(`Updating experience ${id}, field: ${field}, value:`, value);
    const updated = experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    updateExperiences(updated);
  };

  const removeExperience = (id: string) => {
    updateExperiences(experiences.filter(exp => exp.id !== id));
  };

  const handleDateChange = (id: string, field: string, value: string) => {
    console.log(`Date input changed - ID: ${id}, Field: ${field}, Value: "${value}"`);
    updateExperience(id, field, value);
  };

  return (
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
          <div key={exp.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Experiência</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(exp.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{exp.isPersonalProject ? 'Nome do Projeto' : 'Empresa'}</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder={exp.isPersonalProject ? 'Nome do seu projeto' : 'Nome da empresa'}
                />
              </div>
              <div>
                <Label>{exp.isPersonalProject ? 'Função/Papel' : 'Cargo'}</Label>
                <Input
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  placeholder={exp.isPersonalProject ? 'Seu papel no projeto' : 'Seu cargo'}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data de Início</Label>
                <Input
                  type="text"
                  value={exp.startDate}
                  onChange={(e) => handleDateChange(exp.id, 'startDate', e.target.value)}
                  placeholder="Digite: 15/01/2023 ou 01/2023"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  ✓ Aceita: DD/MM/AAAA ou MM/AAAA
                </p>
              </div>
              <div>
                <Label>Data de Fim</Label>
                <Input
                  type="text"
                  value={exp.endDate}
                  onChange={(e) => handleDateChange(exp.id, 'endDate', e.target.value)}
                  disabled={exp.current}
                  placeholder="Digite: 30/12/2023 ou 12/2023"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  ✓ Aceita: DD/MM/AAAA ou MM/AAAA
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`personal-${exp.id}`}
                  checked={exp.isPersonalProject}
                  onCheckedChange={(checked) => updateExperience(exp.id, 'isPersonalProject', checked as boolean)}
                />
                <Label htmlFor={`personal-${exp.id}`}>Projeto pessoal</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onCheckedChange={(checked) => updateExperience(exp.id, 'current', checked as boolean)}
                />
                <Label htmlFor={`current-${exp.id}`}>
                  {exp.isPersonalProject ? 'Atualmente trabalhando no projeto' : 'Trabalho atual'}
                </Label>
              </div>
            </div>
            
            <div>
              <Label>Qual era o problema, dor ou necessidade antes da sua atuação?</Label>
              <Textarea
                value={exp.problem}
                onChange={(e) => updateExperience(exp.id, 'problem', e.target.value)}
                placeholder="Descreva qual problema ou necessidade existia"
                rows={2}
              />
            </div>
            
            <div>
              <Label>O que você fez para resolver?</Label>
              <Textarea
                value={exp.solution}
                onChange={(e) => updateExperience(exp.id, 'solution', e.target.value)}
                placeholder="Descreva as ações que você tomou"
                rows={2}
              />
            </div>
            
            <div>
              <Label>Quais tecnologias e ferramentas usou?</Label>
              <Input
                value={exp.technologies}
                onChange={(e) => updateExperience(exp.id, 'technologies', e.target.value)}
                placeholder="Ex: Java, Spring Boot, PostgreSQL, Docker..."
              />
            </div>
            
            <div>
              <Label>Qual foi o impacto ou resultado da sua atuação?</Label>
              <Textarea
                value={exp.impact}
                onChange={(e) => updateExperience(exp.id, 'impact', e.target.value)}
                placeholder="Descreva os resultados obtidos"
                rows={2}
              />
            </div>
          </div>
        ))}
        
        {experiences.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma experiência adicionada</p>
            <p className="text-sm">Clique em "Adicionar" para começar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExperienceForm;
