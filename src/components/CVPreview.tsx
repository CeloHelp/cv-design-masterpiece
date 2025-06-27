
import React from 'react';
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useCVContext } from '@/contexts/CVContext';

const CVPreview: React.FC = () => {
  const {
    personalData,
    experiences,
    education,
    skills,
    languages,
    selectedDesign
  } = useCVContext();

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);

  if (selectedDesign === 'modern') {
    return (
      <div className="cv-preview bg-white p-8 shadow-lg max-w-4xl mx-auto" style={{ minHeight: '297mm', width: '210mm' }}>
        {/* Header */}
        <div className="border-b-4 border-blue-600 pb-6 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{personalData.fullName || 'Seu Nome'}</h1>
          <div className="flex flex-wrap gap-4 text-gray-600">
            {personalData.email && <span>📧 {personalData.email}</span>}
            {personalData.phone && <span>📞 {personalData.phone}</span>}
            {personalData.address && <span>📍 {personalData.address}</span>}
          </div>
        </div>

        {/* Professional Summary */}
        {personalData.professionalSummary && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-3 border-b border-gray-300 pb-1">Resumo Profissional</h2>
            <p className="text-gray-700 leading-relaxed">{personalData.professionalSummary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.some(exp => exp.company || exp.position) && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-3 border-b border-gray-300 pb-1">Experiência Profissional</h2>
            {experiences.map((exp) => (
              (exp.company || exp.position) && (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{exp.position || 'Cargo'}</h3>
                      <p className="text-blue-600 font-medium">{exp.company || 'Empresa'}</p>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {formatDate(exp.startDate)} - {exp.current ? 'Atual' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>}
                </div>
              )
            ))}
          </div>
        )}

        {/* Education */}
        {education.some(edu => edu.institution || edu.degree) && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-3 border-b border-gray-300 pb-1">Formação Acadêmica</h2>
            {education.map((edu) => (
              (edu.institution || edu.degree) && (
                <div key={edu.id} className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{edu.degree || 'Grau'}</h3>
                      <p className="text-blue-600 font-medium">{edu.field && `${edu.field} - `}{edu.institution || 'Instituição'}</p>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {formatDate(edu.startDate)} - {edu.current ? 'Em andamento' : formatDate(edu.endDate)}
                    </span>
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* Skills */}
          {skillsArray.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-blue-600 mb-3 border-b border-gray-300 pb-1">Habilidades</h2>
              <div className="flex flex-wrap gap-2">
                {skillsArray.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.some(lang => lang.language) && (
            <div>
              <h2 className="text-2xl font-bold text-blue-600 mb-3 border-b border-gray-300 pb-1">Idiomas</h2>
              {languages.map((lang) => (
                lang.language && (
                  <div key={lang.id} className="flex justify-between mb-2">
                    <span className="text-gray-800">{lang.language}</span>
                    <span className="text-gray-600 text-sm capitalize">{lang.proficiency}</span>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (selectedDesign === 'classic') {
    return (
      <div className="cv-preview bg-white p-8 shadow-lg max-w-4xl mx-auto border" style={{ minHeight: '297mm', width: '210mm' }}>
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">{personalData.fullName || 'Seu Nome'}</h1>
          <div className="text-gray-600 space-y-1">
            {personalData.email && <div>{personalData.email}</div>}
            {personalData.phone && <div>{personalData.phone}</div>}
            {personalData.address && <div>{personalData.address}</div>}
          </div>
        </div>

        {/* Professional Summary */}
        {personalData.professionalSummary && (
          <div className="mb-6">
            <h2 className="text-xl font-serif font-bold text-gray-800 mb-3 uppercase tracking-wider">Objetivo Profissional</h2>
            <p className="text-gray-700 leading-relaxed text-justify">{personalData.professionalSummary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.some(exp => exp.company || exp.position) && (
          <div className="mb-6">
            <h2 className="text-xl font-serif font-bold text-gray-800 mb-3 uppercase tracking-wider">Experiência Profissional</h2>
            {experiences.map((exp) => (
              (exp.company || exp.position) && (
                <div key={exp.id} className="mb-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-serif font-semibold text-gray-800">{exp.position || 'Cargo'}</h3>
                    <p className="text-gray-700 italic">{exp.company || 'Empresa'}</p>
                    <p className="text-gray-600 text-sm">
                      {formatDate(exp.startDate)} - {exp.current ? 'Atual' : formatDate(exp.endDate)}
                    </p>
                  </div>
                  {exp.description && <p className="text-gray-700 text-sm leading-relaxed text-justify">{exp.description}</p>}
                </div>
              )
            ))}
          </div>
        )}

        {/* Education */}
        {education.some(edu => edu.institution || edu.degree) && (
          <div className="mb-6">
            <h2 className="text-xl font-serif font-bold text-gray-800 mb-3 uppercase tracking-wider">Formação Acadêmica</h2>
            {education.map((edu) => (
              (edu.institution || edu.degree) && (
                <div key={edu.id} className="mb-3">
                  <h3 className="text-lg font-serif font-semibold text-gray-800">{edu.degree || 'Grau'}</h3>
                  <p className="text-gray-700">{edu.field && `${edu.field} - `}{edu.institution || 'Instituição'}</p>
                  <p className="text-gray-600 text-sm">
                    {formatDate(edu.startDate)} - {edu.current ? 'Em andamento' : formatDate(edu.endDate)}
                  </p>
                </div>
              )
            ))}
          </div>
        )}

        {/* Skills and Languages */}
        <div className="grid grid-cols-2 gap-6">
          {skillsArray.length > 0 && (
            <div>
              <h2 className="text-xl font-serif font-bold text-gray-800 mb-3 uppercase tracking-wider">Habilidades</h2>
              <ul className="text-gray-700 space-y-1">
                {skillsArray.map((skill, index) => (
                  <li key={index} className="text-sm">• {skill}</li>
                ))}
              </ul>
            </div>
          )}

          {languages.some(lang => lang.language) && (
            <div>
              <h2 className="text-xl font-serif font-bold text-gray-800 mb-3 uppercase tracking-wider">Idiomas</h2>
              {languages.map((lang) => (
                lang.language && (
                  <div key={lang.id} className="text-sm text-gray-700 mb-1">
                    <strong>{lang.language}:</strong> <span className="capitalize">{lang.proficiency}</span>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (selectedDesign === 'creative') {
    return (
      <div className="cv-preview bg-gradient-to-br from-purple-50 to-pink-50 p-8 shadow-lg max-w-4xl mx-auto" style={{ minHeight: '297mm', width: '210mm' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg mb-6">
          <h1 className="text-4xl font-bold mb-2">{personalData.fullName || 'Seu Nome'}</h1>
          <div className="grid grid-cols-1 gap-2 text-purple-100">
            {personalData.email && <div>✉️ {personalData.email}</div>}
            {personalData.phone && <div>📱 {personalData.phone}</div>}
            {personalData.address && <div>🌍 {personalData.address}</div>}
          </div>
        </div>

        {/* Professional Summary */}
        {personalData.professionalSummary && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-purple-700 mb-3 flex items-center">
              <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">💼</span>
              Sobre Mim
            </h2>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-gray-700 leading-relaxed">{personalData.professionalSummary}</p>
            </div>
          </div>
        )}

        {/* Experience */}
        {experiences.some(exp => exp.company || exp.position) && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-purple-700 mb-3 flex items-center">
              <span className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">🚀</span>
              Experiência
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                (exp.company || exp.position) && (
                  <div key={exp.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{exp.position || 'Cargo'}</h3>
                        <p className="text-purple-600 font-semibold">{exp.company || 'Empresa'}</p>
                      </div>
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">
                        {formatDate(exp.startDate)} - {exp.current ? 'Atual' : formatDate(exp.endDate)}
                      </span>
                    </div>
                    {exp.description && <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>}
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.some(edu => edu.institution || edu.degree) && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-purple-700 mb-3 flex items-center">
              <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">🎓</span>
              Educação
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                (edu.institution || edu.degree) && (
                  <div key={edu.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{edu.degree || 'Grau'}</h3>
                        <p className="text-green-600 font-semibold">{edu.field && `${edu.field} - `}{edu.institution || 'Instituição'}</p>
                      </div>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                        {formatDate(edu.startDate)} - {edu.current ? 'Em andamento' : formatDate(edu.endDate)}
                      </span>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Skills and Languages */}
        <div className="grid grid-cols-2 gap-6">
          {skillsArray.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-purple-700 mb-3 flex items-center">
                <span className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">⚡</span>
                Skills
              </h2>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex flex-wrap gap-2">
                  {skillsArray.map((skill, index) => (
                    <span key={index} className="bg-gradient-to-r from-orange-400 to-red-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {languages.some(lang => lang.language) && (
            <div>
              <h2 className="text-2xl font-bold text-purple-700 mb-3 flex items-center">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">🌐</span>
                Idiomas
              </h2>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                {languages.map((lang) => (
                  lang.language && (
                    <div key={lang.id} className="flex justify-between items-center mb-2 last:mb-0">
                      <span className="text-gray-800 font-medium">{lang.language}</span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm capitalize">{lang.proficiency}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default empty state
  return (
    <div className="cv-preview bg-white p-8 shadow-lg max-w-4xl mx-auto border-2 border-dashed border-gray-300 flex items-center justify-center" style={{ minHeight: '400px' }}>
      <div className="text-center text-gray-500">
        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-xl font-semibold mb-2">Preview do Currículo</h3>
        <p>Preencha os campos e selecione um design para ver seu currículo</p>
      </div>
    </div>
  );
};

export default CVPreview;
