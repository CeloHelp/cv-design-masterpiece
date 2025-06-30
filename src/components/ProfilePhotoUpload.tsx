
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, X, User } from 'lucide-react';

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoChange: (url: string | null) => void;
}

const ProfilePhotoUpload = ({ currentPhotoUrl, onPhotoChange }: ProfilePhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calcular dimensões mantendo proporção
        const maxWidth = 1200;
        const maxHeight = 1200;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Desenhar imagem redimensionada
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Converter para blob com qualidade 0.8
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', 0.8);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      let fileToUpload = file;

      // Se o arquivo for maior que 10MB, comprimir
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Comprimindo imagem...",
          description: "Sua imagem está sendo otimizada para upload.",
        });
        fileToUpload = await compressImage(file);
      }

      // Verificar se ainda está muito grande após compressão
      if (fileToUpload.size > 10 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "Não foi possível reduzir a imagem para 10MB. Tente uma imagem menor.",
          variant: "destructive",
        });
        return;
      }

      // Gerar nome único para o arquivo
      const fileExt = fileToUpload.type === 'image/jpeg' ? 'jpg' : file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload do arquivo
      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, fileToUpload);

      if (error) throw error;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(data.path);

      onPhotoChange(publicUrl);

      toast({
        title: "Sucesso!",
        description: "Foto de perfil carregada com sucesso.",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a foto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!currentPhotoUrl) return;

    try {
      // Extrair o path da URL
      const url = new URL(currentPhotoUrl);
      const path = url.pathname.split('/').slice(-2).join('/'); // user_id/filename

      // Deletar arquivo do storage
      const { error } = await supabase.storage
        .from('profile-photos')
        .remove([path]);

      if (error) throw error;

      onPhotoChange(null);

      toast({
        title: "Sucesso!",
        description: "Foto de perfil removida com sucesso.",
      });
    } catch (error) {
      console.error('Error removing photo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a foto. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="w-24 h-24">
        <AvatarImage src={currentPhotoUrl} alt="Foto de perfil" />
        <AvatarFallback>
          <User className="w-8 h-8" />
        </AvatarFallback>
      </Avatar>

      <div className="flex gap-2">
        <div className="relative">
          <Button
            variant="outline"
            disabled={isUploading}
            className="cursor-pointer"
            asChild
          >
            <label>
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? 'Carregando...' : 'Carregar Foto'}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
            </label>
          </Button>
        </div>

        {currentPhotoUrl && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleRemovePhoto}
            disabled={isUploading}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <p className="text-xs text-gray-500 text-center">
        Formatos aceitos: JPG, PNG, GIF<br />
        Tamanho máximo: 10MB (compressão automática)
      </p>
    </div>
  );
};

export default ProfilePhotoUpload;
