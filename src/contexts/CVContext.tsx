import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PersonalData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  professionalSummary: string;
  profilePhotoUrl?: string;
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

interface CVContextType {
  currentCVId: string | null;
  personalData: PersonalData;
  experiences: Experience[];
  education: Education[];
  skills: string;
  languages: Language[];
  selectedDesign: string;
  setCurrentCVId: (id: string | null) => void;
  updatePersonalData: (data: Partial<PersonalData>) => void;
  updateExperiences: (experiences: Experience[]) => void;
  updateEducation: (education: Education[]) => void;
  updateSkills: (skills: string) => void;
  updateLanguages: (languages: Language[]) => void;
  updateSelectedDesign: (design: string) => void;
  clearCV: () => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export const useCVContext = () => {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCVContext must be used within a CVProvider');
  }
  return context;
};

interface CVProviderProps {
  children: ReactNode;
}

export const CVProvider: React.FC<CVProviderProps> = ({ children }) => {
  const [currentCVId, setCurrentCVId] = useState<string | null>(null);
  const [personalData, setPersonalData] = useState<PersonalData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    professionalSummary: '',
    profilePhotoUrl: '',
  });

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string>('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<string>('modern');

  const updatePersonalData = (data: Partial<PersonalData>) => {
    setPersonalData(prev => ({ ...prev, ...data }));
  };

  const updateExperiences = (newExperiences: Experience[]) => {
    setExperiences(newExperiences);
  };

  const updateEducation = (newEducation: Education[]) => {
    setEducation(newEducation);
  };

  const updateSkills = (newSkills: string) => {
    setSkills(newSkills);
  };

  const updateLanguages = (newLanguages: Language[]) => {
    setLanguages(newLanguages);
  };

  const updateSelectedDesign = (design: string) => {
    setSelectedDesign(design);
  };

  const clearCV = () => {
    setCurrentCVId(null);
    setPersonalData({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      professionalSummary: '',
      profilePhotoUrl: '',
    });
    setExperiences([]);
    setEducation([]);
    setSkills('');
    setLanguages([]);
    setSelectedDesign('modern');
  };

  return (
    <CVContext.Provider
      value={{
        currentCVId,
        personalData,
        experiences,
        education,
        skills,
        languages,
        selectedDesign,
        setCurrentCVId,
        updatePersonalData,
        updateExperiences,
        updateEducation,
        updateSkills,
        updateLanguages,
        updateSelectedDesign,
        clearCV,
      }}
    >
      {children}
    </CVContext.Provider>
  );
};
