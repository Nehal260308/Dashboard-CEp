import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface FileUploadProps {
  bucket: string;
  onUpload: (url: string) => void;
  acceptedFileTypes?: string;
  maxSize?: number; // in bytes
}

export const FileUpload = ({ bucket, onUpload, acceptedFileTypes = '*', maxSize = 5242880 }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select a file to upload.');
      }

      const file = event.target.files[0];

      if (file.size > maxSize) {
        throw new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);

        onUpload(publicUrl);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept={acceptedFileTypes}
        onChange={handleUpload}
        disabled={uploading}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};