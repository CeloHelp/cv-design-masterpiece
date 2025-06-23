
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, FileText, Download, User, Briefcase, Book, List, Language } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PersonalData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  professionalSummary: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

interface Language {
  id: string;
  language: string;
  proficiency: string;
}

const Index = () => {
  const { toast } = useToast();
  
  const [personalData, setPersonalData] = useState<PersonalData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    professionalSummary: ""
  });

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    }
  ]);

  const [education, setEducation] = useState<Education[]>([
    {
      id: "1",
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false
    }
  ]);

  const [skills, setSkills] = useState<string>("");
  const [languages, setLanguages] = useState<Language[]>([
    {
      id: "1",
      language: "",
      proficiency: ""
    }
  ]);

  const [selectedDesign, setSelectedDesign] = useState<string>("");

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    };
    setExperiences([...experiences, newExp]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false
    };
    setEducation([...education, newEdu]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const addLanguage = () => {
    const newLang: Language = {
      id: Date.now().toString(),
      language: "",
      proficiency: ""
    };
    setLanguages([...languages, newLang]);
  };

  const removeLanguage = (id: string) => {
    setLanguages(languages.filter(lang => lang.id !== id));
  };

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    setLanguages(languages.map(lang => 
      lang.id === id ? { ...lang, [field]: value } : lang
    ));
  };

  const generateCV = () => {
    if (!personalData.fullName || !personalData.email || !selectedDesign) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha pelo menos o nome, email e selecione um design.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "CV Gerado com sucesso!",
      description: "Seu currículo foi gerado com o design selecionado.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Gerador de Currículo
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Crie seu currículo profissional de forma rápida e fácil. Preencha os campos abaixo e escolha o design que mais combina com você.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Data */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Nome Completo *</Label>
                    <Input
                      id="fullName"
                      value={personalData.fullName}
                      onChange={(e) => setPersonalData({...personalData, fullName: e.target.value})}
                      placeholder="Seu nome completo"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={personalData.email}
                      onChange={(e) => setPersonalData({...personalData, email: e.target.value})}
                      placeholder="seu.email@exemplo.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={personalData.phone}
                      onChange={(e) => setPersonalData({...personalData, phone: e.target.value})}
                      placeholder="(11) 99999-9999"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={personalData.address}
                      onChange={(e) => setPersonalData({...personalData, address: e.target.value})}
                      placeholder="Cidade, Estado"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="summary">Resumo Profissional</Label>
                  <Textarea
                    id="summary"
                    value={personalData.professionalSummary}
                    onChange={(e) => setPersonalData({...personalData, professionalSummary: e.target.value})}
                    placeholder="Descreva brevemente sua experiência e objetivos profissionais..."
                    className="mt-1 h-24"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Experience */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Experiência Profissional
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className="border rounded-lg p-4 bg-gray-50/50">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-gray-800">Experiência {index + 1}</h4>
                      {experiences.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeExperience(exp.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Empresa</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="Nome da empresa"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Cargo</Label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          placeholder="Seu cargo"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Data de Início</Label>
                        <Input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Data de Fim</Label>
                        <Input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          disabled={exp.current}
                          className="mt-1"
                        />
                        <div className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            id={`current-${exp.id}`}
                            checked={exp.current}
                            onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                            className="mr-2"
                          />
                          <Label htmlFor={`current-${exp.id}`} className="text-sm">Trabalho atual</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label>Descrição das Atividades</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        placeholder="Descreva suas principais responsabilidades e conquistas..."
                        className="mt-1 h-20"
                      />
                    </div>
                  </div>
                ))}
                
                <Button onClick={addExperience} className="w-full" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Experiência
                </Button>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Book className="w-5 h-5" />
                  Educação
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {education.map((edu, index) => (
                  <div key={edu.id} className="border rounded-lg p-4 bg-gray-50/50">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-gray-800">Formação {index + 1}</h4>
                      {education.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeEducation(edu.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Instituição</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          placeholder="Nome da instituição"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Grau/Título</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          placeholder="Ex: Bacharelado, Mestrado"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Área de Estudo</Label>
                        <Input
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                          placeholder="Ex: Engenharia, Administração"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Período</Label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <Input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                            placeholder="Início"
                          />
                          <Input
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                            disabled={edu.current}
                            placeholder="Fim"
                          />
                        </div>
                        <div className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            id={`current-edu-${edu.id}`}
                            checked={edu.current}
                            onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                            className="mr-2"
                          />
                          <Label htmlFor={`current-edu-${edu.id}`} className="text-sm">Em andamento</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button onClick={addEducation} className="w-full" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Formação
                </Button>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <List className="w-5 h-5" />
                  Habilidades
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Label htmlFor="skills">Suas Habilidades</Label>
                <Textarea
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Liste suas habilidades técnicas e comportamentais, separadas por vírgula..."
                  className="mt-1 h-32"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Exemplo: JavaScript, React, Liderança, Comunicação, Excel, Inglês
                </p>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Language className="w-5 h-5" />
                  Idiomas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {languages.map((lang, index) => (
                  <div key={lang.id} className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Label>Idioma</Label>
                      <Input
                        value={lang.language}
                        onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                        placeholder="Ex: Inglês, Espanhol"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Nível</Label>
                      <Select value={lang.proficiency} onValueChange={(value) => updateLanguage(lang.id, 'proficiency', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecione o nível" />
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
                    {languages.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeLanguage(lang.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button onClick={addLanguage} className="w-full" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Idioma
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Design Selection & Actions */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm sticky top-6">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-t-lg">
                <CardTitle>Design do Currículo</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Label>Escolha o Design *</Label>
                <Select value={selectedDesign} onValueChange={setSelectedDesign}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione um design" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Moderno</SelectItem>
                    <SelectItem value="classic">Clássico</SelectItem>
                    <SelectItem value="creative">Criativo</SelectItem>
                    <SelectItem value="minimal">Minimalista</SelectItem>
                    <SelectItem value="professional">Profissional</SelectItem>
                  </SelectContent>
                </Select>

                {selectedDesign && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Prévia do Design:</h4>
                    <div className="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded border-2 border-dashed border-gray-400 flex items-center justify-center">
                      <span className="text-gray-600 text-center">
                        Prévia do design<br />
                        <strong>{selectedDesign}</strong>
                      </span>
                    </div>
                  </div>
                )}

                <Separator className="my-6" />

                <div className="space-y-3">
                  <Button onClick={generateCV} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3">
                    <FileText className="w-5 h-5 mr-2" />
                    Gerar Currículo
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Download className="w-5 h-5 mr-2" />
                    Baixar PDF
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Dicas:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Seja conciso e objetivo</li>
                    <li>• Use palavras-chave da área</li>
                    <li>• Destaque suas conquistas</li>
                    <li>• Mantenha informações atualizadas</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
