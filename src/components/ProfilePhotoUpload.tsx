
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

    // Validar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload do arquivo
      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file);

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
        Tamanho máximo: 5MB
      </p>
    </div>
  );
};

export default ProfilePhotoUpload;
