
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileText, Eye, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCVs, CVData } from '@/hooks/useCVs';

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

interface CVGeneratorProps {
  personalData: PersonalData;
  experiences: Experience[];
  education: Education[];
  skills: string;
  languages: Language[];
  selectedDesign: string;
  onShowPreview: () => void;
}

const CVGenerator: React.FC<CVGeneratorProps> = ({
  personalData,
  experiences,
  education,
  skills,
  languages,
  selectedDesign,
  onShowPreview
}) => {
  const { toast } = useToast();
  const { saveCV, isSaving } = useCVs();

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
    
    onShowPreview();
  };

  const handleQuickSave = async () => {
    if (!personalData.fullName || !personalData.email || !selectedDesign) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha pelo menos o nome, email e selecione um design antes de salvar.",
        variant: "destructive"
      });
      return;
    }

    const cvData: CVData = {
      title: `CV - ${personalData.fullName}`,
      personal_data: personalData,
      experiences,
      education,
      skills,
      languages,
      selected_design: selectedDesign,
    };

    try {
      await saveCV(cvData);
    } catch (error) {
      console.error('Error quick saving CV:', error);
    }
  };

  const downloadPDF = () => {
    if (!personalData.fullName || !personalData.email || !selectedDesign) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha pelo menos o nome, email e selecione um design antes de baixar.",
        variant: "destructive"
      });
      return;
    }

    // Simular download do PDF
    toast({
      title: "Download iniciado!",
      description: "Seu currículo em PDF está sendo preparado...",
    });

    // Em uma implementação real, aqui seria feita a geração e download do PDF
    setTimeout(() => {
      toast({
        title: "PDF pronto!",
        description: "Seu currículo foi baixado com sucesso.",
      });
    }, 2000);
  };

  const hasValidData = personalData.fullName || personalData.email || 
                      experiences.some(exp => exp.company || exp.position) ||
                      education.some(edu => edu.institution || edu.degree) ||
                      skills.trim();

  return (
    <div className="space-y-3">
      <Button 
        onClick={generateCV} 
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
      >
        <FileText className="w-5 h-5 mr-2" />
        Gerar Currículo
      </Button>
      
      {hasValidData && selectedDesign && (
        <>
          <Button 
            onClick={handleQuickSave}
            variant="outline" 
            className="w-full"
            disabled={isSaving}
          >
            <Save className="w-5 h-5 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar Rápido'}
          </Button>

          <Button 
            onClick={onShowPreview}
            variant="outline" 
            className="w-full"
          >
            <Eye className="w-5 h-5 mr-2" />
            Visualizar Preview
          </Button>
          
          <Button 
            onClick={downloadPDF}
            variant="outline" 
            className="w-full"
          >
            <Download className="w-5 h-5 mr-2" />
            Baixar PDF
          </Button>
        </>
      )}
    </div>
  );
};

export default CVGenerator;
