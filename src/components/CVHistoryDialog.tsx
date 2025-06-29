
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCVHistory } from '@/hooks/useCVHistory';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { History, Calendar, FileText, Download } from 'lucide-react';

interface CVHistoryDialogProps {
  cvId: string;
  cvTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onRestoreVersion: (versionData: any) => void;
}

const CVHistoryDialog: React.FC<CVHistoryDialogProps> = ({
  cvId,
  cvTitle,
  isOpen,
  onClose,
  onRestoreVersion,
}) => {
  const { history, isLoading } = useCVHistory(cvId);

  const handleRestoreVersion = (historyEntry: any) => {
    const versionData = {
      personalData: historyEntry.personal_data,
      experiences: historyEntry.experiences,
      education: historyEntry.education,
      skills: historyEntry.skills,
      languages: historyEntry.languages,
      selectedDesign: historyEntry.selected_design,
    };
    
    onRestoreVersion(versionData);
    onClose();
  };

  // Helper function to safely get array length
  const getArrayLength = (jsonData: any): number => {
    return Array.isArray(jsonData) ? jsonData.length : 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Histórico de Versões - {cvTitle}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-96 pr-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-500">Carregando histórico...</div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma versão anterior encontrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div key={entry.id} className="border rounded-lg p-4 bg-gray-50/50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        v{entry.version_number}
                      </Badge>
                      {index === 0 && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Atual
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(entry.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-800 mb-1">{entry.title}</h4>
                    {entry.change_description && (
                      <p className="text-sm text-gray-600">{entry.change_description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Design: <span className="capitalize">{entry.selected_design}</span>
                      </span>
                      <span>
                        Experiências: {getArrayLength(entry.experiences)}
                      </span>
                      <span>
                        Educação: {getArrayLength(entry.education)}
                      </span>
                    </div>
                    
                    {index > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestoreVersion(entry)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Restaurar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CVHistoryDialog;
