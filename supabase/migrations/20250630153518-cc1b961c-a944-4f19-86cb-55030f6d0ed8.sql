
-- Criar o bucket para fotos de perfil
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true);

-- Criar política para permitir que usuários vejam todas as fotos (público)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-photos');

-- Criar política para permitir que usuários autenticados façam upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profile-photos' AND auth.role() = 'authenticated');

-- Criar política para permitir que usuários deletem suas próprias fotos
CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
