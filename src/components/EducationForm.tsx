
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useCVContext } from '@/contexts/CVContext';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';

const EducationForm = () => {
  const { education, updateEducation } = useCVContext();

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false
    };
    updateEducation([...education, newEducation]);
  };

  const updateEducationItem = (id: string, field: string, value: string | boolean) => {
    const updated = education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    updateEducation(updated);
  };

  const removeEducation = (id: string) => {
    updateEducation(education.filter(edu => edu.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Formação Acadêmica
          </div>
          <Button onClick={addEducation} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {education.map((edu) => (
          <div key={edu.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Formação</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(edu.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Instituição</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateEducationItem(edu.id, 'institution', e.target.value)}
                  placeholder="Nome da instituição"
                />
              </div>
              <div>
                <Label>Grau</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducationItem(edu.id, 'degree', e.target.value)}
                  placeholder="Bacharel, Mestrado, etc."
                />
              </div>
            </div>
            
            <div>
              <Label>Área de Estudo</Label>
              <Input
                value={edu.field}
                onChange={(e) => updateEducationItem(edu.id, 'field', e.target.value)}
                placeholder="Área de estudo"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data de Início</Label>
                <Input
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => updateEducationItem(edu.id, 'startDate', e.target.value)}
                />
              </div>
              <div>
                <Label>Data de Conclusão</Label>
                <Input
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => updateEducationItem(edu.id, 'endDate', e.target.value)}
                  disabled={edu.current}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`current-edu-${edu.id}`}
                checked={edu.current}
                onCheckedChange={(checked) => updateEducationItem(edu.id, 'current', checked as boolean)}
              />
              <Label htmlFor={`current-edu-${edu.id}`}>Em andamento</Label>
            </div>
          </div>
        ))}
        
        {education.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma formação adicionada</p>
            <p className="text-sm">Clique em "Adicionar" para começar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EducationForm;
