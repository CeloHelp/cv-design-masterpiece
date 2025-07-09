
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
        {/* Full screen overlay */}
        {focusedField && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 pointer-events-none" />
        )}
        
        <div className={`transition-all duration-500 ${
          focusedField && focusedField !== 'skills' ? 'opacity-30' : 'opacity-100'
        } ${focusedField === 'skills' ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 shadow-2xl ring-2 ring-primary/50 rounded-lg p-6 bg-background w-96 max-w-[90vw]' : ''}`}>
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
