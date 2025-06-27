
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCVContext } from '@/contexts/CVContext';
import { Zap } from 'lucide-react';

const SkillsForm = () => {
  const { skills, updateSkills } = useCVContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Habilidades
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Label htmlFor="skills">Habilidades (separadas por vírgula)</Label>
          <Textarea
            id="skills"
            value={skills}
            onChange={(e) => updateSkills(e.target.value)}
            placeholder="JavaScript, React, Node.js, Python, SQL, etc."
            rows={4}
          />
          <p className="text-sm text-gray-500 mt-2">
            Separe as habilidades com vírgulas
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsForm;
