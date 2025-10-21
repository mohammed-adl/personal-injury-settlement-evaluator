import supabase from './supabase.js';
import fetch from 'node-fetch';

export const uploadFile = async (fileUrl: string, filePath: string) => {
  console.log('Fetching file from:', fileUrl);
  
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  
  try {
    const response = await fetch(fileUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0' 
      }
    });
    
    clearTimeout(timeout);
    
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
  

    const { data, error } = await supabase.storage
      .from('injury-documents')
      .upload(filePath, buffer, {
        contentType: response.headers.get('content-type') || 'application/octet-stream',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }
    
    console.log('Upload successful:', data.path);

    const { data: publicUrl } = supabase.storage
      .from('injury-documents')
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  } catch (error: any) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new Error('File fetch timed out after 30 seconds');
    }
    throw error;
  }
};