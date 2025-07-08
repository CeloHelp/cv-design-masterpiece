import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCVContext } from '@/contexts/CVContext';
import { Target } from 'lucide-react';

const ObjectiveForm = () => {
  const { objective, updateObjective } = useCVContext();

  const handleChange = (field: string, value: string) => {
    updateObjective({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Objetivo Profissional
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="position">Cargo Pretendido</Label>
          <Select value={objective.position} onValueChange={(value) => handleChange('position', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o nível desejado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="estagio">Estágio</SelectItem>
              <SelectItem value="primeira-oportunidade">Primeira oportunidade</SelectItem>
              <SelectItem value="junior">Júnior</SelectItem>
              <SelectItem value="pleno">Pleno</SelectItem>
              <SelectItem value="senior">Sênior</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="stack">Stack Principal</Label>
          <Input
            id="stack"
            value={objective.stack}
            onChange={(e) => handleChange('stack', e.target.value)}
            placeholder="Ex: Java, Spring Boot, PostgreSQL, React..."
          />
        </div>
        
        <div>
          <Label htmlFor="goal">Objetivo em uma frase</Label>
          <Textarea
            id="goal"
            value={objective.goal}
            onChange={(e) => handleChange('goal', e.target.value)}
            placeholder="Ex: Quero iniciar minha carreira como dev Java backend contribuindo com projetos reais e evoluindo tecnicamente."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ObjectiveForm;