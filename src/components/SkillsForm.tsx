
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCVContext } from '@/contexts/CVContext';
import { Zap } from 'lucide-react';

const SkillsForm = () => {
  const { skills, updateSkills } = useCVContext();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Habilidades
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        {/* Blur overlay */}
        {focusedField && (
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] z-10 pointer-events-none rounded-lg" />
        )}
        
        <div className={`transition-all duration-300 ${
          focusedField && focusedField !== 'skills' ? 'opacity-30' : 'opacity-100'
        } ${focusedField === 'skills' ? 'relative z-20 shadow-lg ring-2 ring-primary/50 rounded-lg p-3 bg-background' : ''}`}>
          <Label htmlFor="skills">Habilidades (separadas por vírgula)</Label>
          <Textarea
            id="skills"
            value={skills}
            onChange={(e) => updateSkills(e.target.value)}
            onFocus={() => setFocusedField('skills')}
            onBlur={() => setFocusedField(null)}
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
