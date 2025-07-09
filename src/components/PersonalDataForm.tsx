
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCVContext } from '@/contexts/CVContext';
import { User } from 'lucide-react';
import ProfilePhotoUpload from './ProfilePhotoUpload';

const PersonalDataForm = () => {
  const { personalData, updatePersonalData } = useCVContext();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    updatePersonalData({ [field]: value });
  };

  const handlePhotoChange = (url: string | null) => {
    updatePersonalData({ profilePhotoUrl: url || '' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Dados Pessoais
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        {/* Blur overlay */}
        {focusedField && (
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] z-10 pointer-events-none rounded-lg" />
        )}
        
        <div className="space-y-6">
          <div className="flex justify-center">
            <ProfilePhotoUpload
              currentPhotoUrl={personalData.profilePhotoUrl}
              onPhotoChange={handlePhotoChange}
            />
          </div>

          <div className={`transition-all duration-300 ${
            focusedField && focusedField !== 'fullName' ? 'opacity-30' : 'opacity-100'
          } ${focusedField === 'fullName' ? 'relative z-20 shadow-lg ring-2 ring-primary/50 rounded-lg p-3 bg-background' : ''}`}>
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input
              id="fullName"
              value={personalData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              onFocus={() => setFocusedField('fullName')}
              onBlur={() => setFocusedField(null)}
              placeholder="Seu nome completo"
            />
          </div>
          
          <div className={`transition-all duration-300 ${
            focusedField && focusedField !== 'email' ? 'opacity-30' : 'opacity-100'
          } ${focusedField === 'email' ? 'relative z-20 shadow-lg ring-2 ring-primary/50 rounded-lg p-3 bg-background' : ''}`}>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={personalData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder="seu@email.com"
            />
          </div>
          
          <div className={`transition-all duration-300 ${
            focusedField && focusedField !== 'phone' ? 'opacity-30' : 'opacity-100'
          } ${focusedField === 'phone' ? 'relative z-20 shadow-lg ring-2 ring-primary/50 rounded-lg p-3 bg-background' : ''}`}>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={personalData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
              placeholder="(11) 99999-9999"
            />
          </div>
          
          <div className={`transition-all duration-300 ${
            focusedField && focusedField !== 'address' ? 'opacity-30' : 'opacity-100'
          } ${focusedField === 'address' ? 'relative z-20 shadow-lg ring-2 ring-primary/50 rounded-lg p-3 bg-background' : ''}`}>
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={personalData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              onFocus={() => setFocusedField('address')}
              onBlur={() => setFocusedField(null)}
              placeholder="Cidade, Estado"
            />
          </div>
          
          <div className={`transition-all duration-300 ${
            focusedField && focusedField !== 'linkedin' ? 'opacity-30' : 'opacity-100'
          } ${focusedField === 'linkedin' ? 'relative z-20 shadow-lg ring-2 ring-primary/50 rounded-lg p-3 bg-background' : ''}`}>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={personalData.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              onFocus={() => setFocusedField('linkedin')}
              onBlur={() => setFocusedField(null)}
              placeholder="https://linkedin.com/in/seu-perfil"
            />
          </div>
          
          <div className={`transition-all duration-300 ${
            focusedField && focusedField !== 'github' ? 'opacity-30' : 'opacity-100'
          } ${focusedField === 'github' ? 'relative z-20 shadow-lg ring-2 ring-primary/50 rounded-lg p-3 bg-background' : ''}`}>
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              value={personalData.github}
              onChange={(e) => handleChange('github', e.target.value)}
              onFocus={() => setFocusedField('github')}
              onBlur={() => setFocusedField(null)}
              placeholder="https://github.com/seu-usuario"
            />
          </div>
          
          <div className={`transition-all duration-300 ${
            focusedField && focusedField !== 'portfolio' ? 'opacity-30' : 'opacity-100'
          } ${focusedField === 'portfolio' ? 'relative z-20 shadow-lg ring-2 ring-primary/50 rounded-lg p-3 bg-background' : ''}`}>
            <Label htmlFor="portfolio">Portfólio</Label>
            <Input
              id="portfolio"
              value={personalData.portfolio}
              onChange={(e) => handleChange('portfolio', e.target.value)}
              onFocus={() => setFocusedField('portfolio')}
              onBlur={() => setFocusedField(null)}
              placeholder="https://seu-portfolio.com"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalDataForm;
