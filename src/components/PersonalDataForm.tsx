
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCVContext } from '@/contexts/CVContext';
import { User } from 'lucide-react';

const PersonalDataForm = () => {
  const { personalData, updatePersonalData } = useCVContext();

  const handleChange = (field: string, value: string) => {
    updatePersonalData({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Dados Pessoais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
          <Label htmlFor="professionalSummary">Resumo Profissional</Label>
          <Textarea
            id="professionalSummary"
            value={personalData.professionalSummary}
            onChange={(e) => handleChange('professionalSummary', e.target.value)}
            placeholder="Descreva brevemente sua experiência e objetivos profissionais"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalDataForm;
