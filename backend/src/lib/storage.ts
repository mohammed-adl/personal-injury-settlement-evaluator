import supabase from './supabase.js';
import fetch from 'node-fetch';

export const uploadFile = async (fileUrl: string, filePath: string) => {
  const response = await fetch(fileUrl);
  if (!response.ok) throw new Error('Failed to fetch file');
  
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await supabase.storage
    .from('injury-documents')
    .upload(filePath, buffer, {
      contentType: response.headers.get('content-type') || 'application/octet-stream',
      upsert: false,
    });

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from('injury-documents')
    .getPublicUrl(data.path);

  return publicUrl.publicUrl;
};