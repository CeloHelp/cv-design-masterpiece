
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCVContext } from '@/contexts/CVContext';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';

const EducationForm = () => {
  const { education, updateEducation } = useCVContext();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      type: 'academic', // academic, technical, certification
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
    console.log(`Updating education ${id}, field: ${field}, value:`, value);
    const updated = education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    updateEducation(updated);
  };

  const removeEducation = (id: string) => {
    updateEducation(education.filter(edu => edu.id !== id));
  };

  const handleDateChange = (id: string, field: string, value: string) => {
    console.log(`Education date input changed - ID: ${id}, Field: ${field}, Value: "${value}"`);
    updateEducationItem(id, field, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Educação
          </div>
          <Button onClick={addEducation} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        {/* Full screen overlay */}
        {focusedField && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 pointer-events-none" />
        )}
        
        <div className="space-y-6">
          {education.map((edu) => (
            <div key={edu.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">
                  {edu.type === 'academic' ? 'Formação Acadêmica' : 
                   edu.type === 'technical' ? 'Curso Técnico' : 'Certificação'}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(edu.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className={`transition-all duration-500 ${
                focusedField && focusedField !== `${edu.id}-type` ? 'opacity-30' : 'opacity-100'
              } ${focusedField === `${edu.id}-type` ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 shadow-2xl ring-2 ring-primary/50 rounded-lg p-6 bg-background w-96 max-w-[90vw]' : ''}`}>
                <Label>Tipo</Label>
                <Select 
                  value={edu.type || 'academic'} 
                  onValueChange={(value) => updateEducationItem(edu.id, 'type', value)}
                  onOpenChange={(open) => {
                    if (open) setFocusedField(`${edu.id}-type`);
                    else setFocusedField(null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Formação Acadêmica</SelectItem>
                    <SelectItem value="technical">Curso Técnico</SelectItem>
                    <SelectItem value="certification">Certificação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className={`transition-all duration-500 ${
                  focusedField && focusedField !== `${edu.id}-institution` ? 'opacity-30' : 'opacity-100'
                } ${focusedField === `${edu.id}-institution` ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 shadow-2xl ring-2 ring-primary/50 rounded-lg p-6 bg-background w-96 max-w-[90vw]' : ''}`}>
                  <Label>
                    {edu.type === 'academic' ? 'Instituição' : 
                     edu.type === 'technical' ? 'Escola/Instituto' : 'Emissor'}
                  </Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => updateEducationItem(edu.id, 'institution', e.target.value)}
                    onFocus={() => setFocusedField(`${edu.id}-institution`)}
                    onBlur={() => setFocusedField(null)}
                    placeholder={
                      edu.type === 'academic' ? 'Nome da universidade' : 
                      edu.type === 'technical' ? 'Nome da escola técnica' : 'Empresa/plataforma que emitiu'
                    }
                  />
                </div>
                <div className={`transition-all duration-500 ${
                  focusedField && focusedField !== `${edu.id}-degree` ? 'opacity-30' : 'opacity-100'
                } ${focusedField === `${edu.id}-degree` ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 shadow-2xl ring-2 ring-primary/50 rounded-lg p-6 bg-background w-96 max-w-[90vw]' : ''}`}>
                  <Label>
                    {edu.type === 'academic' ? 'Grau' : 
                     edu.type === 'technical' ? 'Curso' : 'Certificação'}
                  </Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducationItem(edu.id, 'degree', e.target.value)}
                    onFocus={() => setFocusedField(`${edu.id}-degree`)}
                    onBlur={() => setFocusedField(null)}
                    placeholder={
                      edu.type === 'academic' ? 'Bacharel, Mestrado, etc.' : 
                      edu.type === 'technical' ? 'Nome do curso técnico' : 'Nome da certificação'
                    }
                  />
                </div>
              </div>
              
              <div className={`transition-all duration-500 ${
                focusedField && focusedField !== `${edu.id}-field` ? 'opacity-30' : 'opacity-100'
              } ${focusedField === `${edu.id}-field` ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 shadow-2xl ring-2 ring-primary/50 rounded-lg p-6 bg-background w-96 max-w-[90vw]' : ''}`}>
                <Label>
                  {edu.type === 'academic' ? 'Área de Estudo' : 
                   edu.type === 'technical' ? 'Área Técnica' : 'Área/Tecnologia'}
                </Label>
                <Input
                  value={edu.field}
                  onChange={(e) => updateEducationItem(edu.id, 'field', e.target.value)}
                  onFocus={() => setFocusedField(`${edu.id}-field`)}
                  onBlur={() => setFocusedField(null)}
                  placeholder={
                    edu.type === 'academic' ? 'Ex: Ciência da Computação' : 
                    edu.type === 'technical' ? 'Ex: Informática, Eletrônica' : 'Ex: React, AWS, Scrum'
                  }
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className={`transition-all duration-500 ${
                  focusedField && focusedField !== `${edu.id}-startDate` ? 'opacity-30' : 'opacity-100'
                } ${focusedField === `${edu.id}-startDate` ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 shadow-2xl ring-2 ring-primary/50 rounded-lg p-6 bg-background w-96 max-w-[90vw]' : ''}`}>
                  <Label>Data de Início</Label>
                  <Input
                    type="text"
                    value={edu.startDate}
                    onChange={(e) => handleDateChange(edu.id, 'startDate', e.target.value)}
                    onFocus={() => setFocusedField(`${edu.id}-startDate`)}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Digite: 15/02/2020 ou 02/2020"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ✓ Aceita: DD/MM/AAAA ou MM/AAAA
                  </p>
                </div>
                <div className={`transition-all duration-500 ${
                  focusedField && focusedField !== `${edu.id}-endDate` ? 'opacity-30' : 'opacity-100'
                } ${focusedField === `${edu.id}-endDate` ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 shadow-2xl ring-2 ring-primary/50 rounded-lg p-6 bg-background w-96 max-w-[90vw]' : ''}`}>
                  <Label>Data de Conclusão</Label>
                  <Input
                    type="text"
                    value={edu.endDate}
                    onChange={(e) => handleDateChange(edu.id, 'endDate', e.target.value)}
                    onFocus={() => setFocusedField(`${edu.id}-endDate`)}
                    onBlur={() => setFocusedField(null)}
                    disabled={edu.current}
                    placeholder="Digite: 30/12/2024 ou 12/2024"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ✓ Aceita: DD/MM/AAAA ou MM/AAAA
                  </p>
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
        </div>
        
        {education.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma educação adicionada</p>
            <p className="text-sm">Adicione formações acadêmicas, cursos técnicos ou certificações</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EducationForm;
