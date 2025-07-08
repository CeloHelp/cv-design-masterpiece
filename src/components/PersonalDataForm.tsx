
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
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <ProfilePhotoUpload
            currentPhotoUrl={personalData.profilePhotoUrl}
            onPhotoChange={handlePhotoChange}
          />
        </div>

        <div>
          <Label htmlFor="fullName">Nome Completo</Label>
          <Input
            id="fullName"
            value={personalData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Seu nome completo"
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={personalData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="seu@email.com"
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={personalData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="(11) 99999-9999"
          />
        </div>
        
        <div>
          <Label htmlFor="address">Endereço</Label>
          <Input
            id="address"
            value={personalData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Cidade, Estado"
          />
        </div>
        
        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            value={personalData.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/seu-perfil"
          />
        </div>
        
        <div>
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            value={personalData.github}
            onChange={(e) => handleChange('github', e.target.value)}
            placeholder="https://github.com/seu-usuario"
          />
        </div>
        
        <div>
          <Label htmlFor="portfolio">Portfólio</Label>
          <Input
            id="portfolio"
            value={personalData.portfolio}
            onChange={(e) => handleChange('portfolio', e.target.value)}
            placeholder="https://seu-portfolio.com"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalDataForm;
