import { supabase } from "./supabaseClient";

// Esta função genérica pode fazer upload para qualquer bucket
export const uploadFile = async (
  bucket: string,
  file: File
): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);
  if (uploadError) {
    // Lida com o erro de forma mais específica se necessário
    throw new Error(
      `Falha no upload para o bucket '${bucket}': ${uploadError.message}`
    );
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
};
