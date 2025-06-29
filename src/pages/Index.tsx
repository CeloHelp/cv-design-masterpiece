
import { useState } from "react";
import Header from "@/components/Header";
import CVGenerator from "@/components/CVGenerator";
import CVPreview from "@/components/CVPreview";
import SavedCVs from "@/components/SavedCVs";
import ProfileEdit from "@/components/ProfileEdit";
import PersonalDataForm from "@/components/PersonalDataForm";
import ExperienceForm from "@/components/ExperienceForm";
import EducationForm from "@/components/EducationForm";
import SkillsForm from "@/components/SkillsForm";
import LanguagesForm from "@/components/LanguagesForm";
import DesignSelector from "@/components/DesignSelector";
import StatisticsCard from "@/components/StatisticsCard";
import { CVProvider, useCVContext } from "@/contexts/CVContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Save, BarChart3 } from "lucide-react";

const CVContent = () => {
  const cvContext = useCVContext();

  const handleLoadCV = (cvData: any, cvId?: string) => {
    cvContext.setCurrentCVId(cvId || null);
    cvContext.updatePersonalData(cvData.personalData);
    cvContext.updateExperiences(cvData.experiences);
    cvContext.updateEducation(cvData.education);
    cvContext.updateSkills(cvData.skills);
    cvContext.updateLanguages(cvData.languages);
    cvContext.updateSelectedDesign(cvData.selectedDesign);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      <div className="space-y-6">
        <DesignSelector />
        <PersonalDataForm />
        <ExperienceForm />
        <EducationForm />
        <SkillsForm />
        <LanguagesForm />
        <CVGenerator />
      </div>
      <div className="lg:sticky lg:top-8 lg:self-start">
        <CVPreview />
      </div>
    </div>
  );
};

const SavedCVsContent = () => {
  const cvContext = useCVContext();

  const handleLoadCV = (cvData: any, cvId?: string) => {
    cvContext.setCurrentCVId(cvId || null);
    cvContext.updatePersonalData(cvData.personalData);
    cvContext.updateExperiences(cvData.experiences);
    cvContext.updateEducation(cvData.education);
    cvContext.updateSkills(cvData.skills);
    cvContext.updateLanguages(cvData.languages);
    cvContext.updateSelectedDesign(cvData.selectedDesign);
  };

  const currentCVData = {
    personalData: cvContext.personalData,
    experiences: cvContext.experiences,
    education: cvContext.education,
    skills: cvContext.skills,
    languages: cvContext.languages,
    selectedDesign: cvContext.selectedDesign,
  };

  return <SavedCVs currentCVData={currentCVData} onLoadCV={handleLoadCV} />;
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [showProfile, setShowProfile] = useState(false);

  if (showProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header onShowProfile={() => setShowProfile(false)} />
        <div className="container mx-auto py-8">
          <ProfileEdit />
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowProfile(false)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Voltar ao Gerador de CV
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CVProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header onShowProfile={() => setShowProfile(true)} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Crie seu currículo profissional
            </h2>
            <p className="text-gray-600 text-lg">
              Escolha um design, preencha suas informações e baixe em PDF
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-2xl grid-cols-3">
                <TabsTrigger value="create" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Criar CV
                </TabsTrigger>
                <TabsTrigger value="saved" className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  CVs Salvos
                </TabsTrigger>
                <TabsTrigger value="statistics" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Estatísticas
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="create">
              <CVContent />
            </TabsContent>

            <TabsContent value="saved">
              <SavedCVsContent />
            </TabsContent>

            <TabsContent value="statistics">
              <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Estatísticas de Uso
                  </h3>
                  <p className="text-gray-600">
                    Veja como a plataforma está sendo utilizada e seus padrões de uso
                  </p>
                </div>
                <StatisticsCard />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </CVProvider>
  );
};

export default Index;
