
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCVContext } from '@/contexts/CVContext';
import { Palette, Check } from 'lucide-react';

const DesignSelector = () => {
  const { selectedDesign, updateSelectedDesign } = useCVContext();

  const designs = [
    {
      id: 'modern',
      name: 'Moderno',
      description: 'Design clean com cores azuis e layout organizado',
      preview: 'bg-gradient-to-br from-blue-50 to-blue-100'
    },
    {
      id: 'classic',
      name: 'Clássico',
      description: 'Design tradicional e elegante',
      preview: 'bg-gradient-to-br from-gray-50 to-gray-100'
    },
    {
      id: 'creative',
      name: 'Criativo',
      description: 'Design colorido e moderno com gradientes',
      preview: 'bg-gradient-to-br from-purple-50 to-pink-100'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Escolha o Design
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {designs.map((design) => (
            <div
              key={design.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedDesign === design.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => updateSelectedDesign(design.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg ${design.preview}`} />
                  <div>
                    <h3 className="font-medium">{design.name}</h3>
                    <p className="text-sm text-gray-600">{design.description}</p>
                  </div>
                </div>
                {selectedDesign === design.id && (
                  <Check className="w-5 h-5 text-blue-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignSelector;
