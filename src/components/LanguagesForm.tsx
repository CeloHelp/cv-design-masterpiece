
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCVContext } from '@/contexts/CVContext';
import { Languages, Plus, Trash2 } from 'lucide-react';

const LanguagesForm = () => {
  const { languages, updateLanguages } = useCVContext();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const addLanguage = () => {
    const newLanguage = {
      id: Date.now().toString(),
      language: '',
      proficiency: 'básico'
    };
    updateLanguages([...languages, newLanguage]);
  };

  const updateLanguage = (id: string, field: string, value: string) => {
    const updated = languages.map(lang => 
      lang.id === id ? { ...lang, [field]: value } : lang
    );
    updateLanguages(updated);
  };

  const removeLanguage = (id: string) => {
    updateLanguages(languages.filter(lang => lang.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            Idiomas
          </div>
          <Button onClick={addLanguage} size="sm">
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
        
        <div className="space-y-4">
          {languages.map((lang) => (
            <div key={lang.id} className="flex gap-4 items-end">
              <div className={`flex-1 transition-all duration-500 ${
                focusedField && focusedField !== `${lang.id}-language` ? 'opacity-30' : 'opacity-100'
              } ${focusedField === `${lang.id}-language` ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 shadow-2xl ring-2 ring-primary/50 rounded-lg p-6 bg-background w-96 max-w-[90vw]' : ''}`}>
                <Label>Idioma</Label>
                <Input
                  value={lang.language}
                  onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                  onFocus={() => setFocusedField(`${lang.id}-language`)}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Português, Inglês, etc."
                />
              </div>
              <div className={`flex-1 transition-all duration-500 ${
                focusedField && focusedField !== `${lang.id}-proficiency` ? 'opacity-30' : 'opacity-100'
              } ${focusedField === `${lang.id}-proficiency` ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 shadow-2xl ring-2 ring-primary/50 rounded-lg p-6 bg-background w-96 max-w-[90vw]' : ''}`}>
                <Label>Nível</Label>
                <Select
                  value={lang.proficiency}
                  onValueChange={(value) => updateLanguage(lang.id, 'proficiency', value)}
                >
                  <SelectTrigger
                    onFocus={() => setFocusedField(`${lang.id}-proficiency`)}
                    onBlur={() => setFocusedField(null)}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="básico">Básico</SelectItem>
                    <SelectItem value="intermediário">Intermediário</SelectItem>
                    <SelectItem value="avançado">Avançado</SelectItem>
                    <SelectItem value="fluente">Fluente</SelectItem>
                    <SelectItem value="nativo">Nativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeLanguage(lang.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        
        {languages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Languages className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum idioma adicionado</p>
            <p className="text-sm">Clique em "Adicionar" para começar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LanguagesForm;
