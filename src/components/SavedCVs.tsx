
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Save, FolderOpen, Trash2, Edit, Calendar } from 'lucide-react';
import { useCVs, CVData } from '@/hooks/useCVs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SavedCVsProps {
  currentCVData: {
    personalData: any;
    experiences: any[];
    education: any[];
    skills: string;
    languages: any[];
    selectedDesign: string;
  };
  onLoadCV: (cvData: any) => void;
}

const SavedCVs: React.FC<SavedCVsProps> = ({ currentCVData, onLoadCV }) => {
  const { cvs, saveCV, deleteCV, loadCV, isSaving, isDeleting } = useCVs();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [cvTitle, setCvTitle] = useState('');
  const [selectedCVId, setSelectedCVId] = useState<string | null>(null);

  const handleSaveCV = async () => {
    if (!cvTitle.trim()) return;

    const cvData: CVData = {
      id: selectedCVId || undefined,
      title: cvTitle,
      personal_data: currentCVData.personalData,
      experiences: currentCVData.experiences,
      education: currentCVData.education,
      skills: currentCVData.skills,
      languages: currentCVData.languages,
      selected_design: currentCVData.selectedDesign,
    };

    try {
      await saveCV(cvData);
      setSaveDialogOpen(false);
      setCvTitle('');
      setSelectedCVId(null);
    } catch (error) {
      console.error('Error saving CV:', error);
    }
  };

  const handleLoadCV = async (cvId: string) => {
    try {
      const cvData = await loadCV(cvId);
      onLoadCV({
        personalData: cvData.personal_data,
        experiences: cvData.experiences,
        education: cvData.education,
        skills: cvData.skills,
        languages: cvData.languages,
        selectedDesign: cvData.selected_design,
      });
    } catch (error) {
      console.error('Error loading CV:', error);
    }
  };

  const handleDeleteCV = async (cvId: string) => {
    try {
      await deleteCV(cvId);
    } catch (error) {
      console.error('Error deleting CV:', error);
    }
  };

  const openSaveDialog = (cvId?: string, title?: string) => {
    setSelectedCVId(cvId || null);
    setCvTitle(title || '');
    setSaveDialogOpen(true);
  };

  return (
    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5" />
          Meus Currículos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Save Current CV Button */}
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => openSaveDialog()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Currículo Atual
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedCVId ? 'Atualizar Currículo' : 'Salvar Currículo'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cv-title">Nome do Currículo</Label>
                <Input
                  id="cv-title"
                  value={cvTitle}
                  onChange={(e) => setCvTitle(e.target.value)}
                  placeholder="Ex: Currículo para Desenvolvedor"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveCV}
                  disabled={!cvTitle.trim() || isSaving}
                  className="flex-1"
                >
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSaveDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Saved CVs List */}
        <div className="space-y-3">
          {cvs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum currículo salvo ainda</p>
              <p className="text-sm">Salve seu primeiro currículo acima!</p>
            </div>
          ) : (
            cvs.map((cv) => (
              <div key={cv.id} className="border rounded-lg p-4 bg-gray-50/50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{cv.title}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Calendar className="w-3 h-3" />
                      Atualizado em {format(new Date(cv.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Design: <span className="capitalize font-medium">{cv.selected_design}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLoadCV(cv.id)}
                    className="flex-1"
                  >
                    <FolderOpen className="w-3 h-3 mr-1" />
                    Carregar
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openSaveDialog(cv.id, cv.title)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Currículo</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir "{cv.title}"? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCV(cv.id)}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={isDeleting}
                        >
                          {isDeleting ? 'Excluindo...' : 'Excluir'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedCVs;
