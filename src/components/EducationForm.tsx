
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
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
            Formação Acadêmica
          </div>
          <Button onClick={addEducation} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        {/* Blur overlay */}
        {focusedField && (
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] z-10 pointer-events-none rounded-lg" />
        )}
        
        <div className="space-y-6">
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
                <div className={`transition-all duration-300 ${
                  focusedField && focusedField !== `${edu.id}-institution` ? 'opacity-30' : 'opacity-100'
                } ${focusedField === `${edu.id}-institution` ? 'relative z-20 shadow-lg ring-2 ring-primary/50 rounded-lg p-3 bg-background' : ''}`}>
                  <Label>Instituição</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => updateEducationItem(edu.id, 'institution', e.target.value)}
                    onFocus={() => setFocusedField(`${edu.id}-institution`)}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Nome da instituição"
                  />
                </div>
                <div className={`transition-all duration-300 ${
                  focusedField && focusedField !== `${edu.id}-degree` ? 'opacity-30' : 'opacity-100'
                } ${focusedField === `${edu.id}-degree` ? 'relative z-20 shadow-lg ring-2 ring-primary/50 rounded-lg p-3 bg-background' : ''}`}>
                  <Label>Grau</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducationItem(edu.id, 'degree', e.target.value)}
                    onFocus={() => setFocusedField(`${edu.id}-degree`)}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Bacharel, Mestrado, etc."
                  />
                </div>
              </div>
              
              <div className={`transition-all duration-300 ${
                focusedField && focusedField !== `${edu.id}-field` ? 'opacity-30' : 'opacity-100'
              } ${focusedField === `${edu.id}-field` ? 'relative z-20 shadow-lg ring-2 ring-primary/50 rounded-lg p-3 bg-background' : ''}`}>
                <Label>Área de Estudo</Label>
                <Input
                  value={edu.field}
                  onChange={(e) => updateEducationItem(edu.id, 'field', e.target.value)}
                  onFocus={() => setFocusedField(`${edu.id}-field`)}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Área de estudo"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className={`transition-all duration-300 ${
                  focusedField && focusedField !== `${edu.id}-startDate` ? 'opacity-30' : 'opacity-100'
                } ${focusedField === `${edu.id}-startDate` ? 'relative z-20 shadow-lg ring-2 ring-primary/50 rounded-lg p-3 bg-background' : ''}`}>
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
                <div className={`transition-all duration-300 ${
                  focusedField && focusedField !== `${edu.id}-endDate` ? 'opacity-30' : 'opacity-100'
                } ${focusedField === `${edu.id}-endDate` ? 'relative z-20 shadow-lg ring-2 ring-primary/50 rounded-lg p-3 bg-background' : ''}`}>
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
            <p>Nenhuma formação adicionada</p>
            <p className="text-sm">Clique em "Adicionar" para começar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EducationForm;
