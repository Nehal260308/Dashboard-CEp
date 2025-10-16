'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const SkywalkModule = () => {
  const [images, setImages] = useState<any[]>([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      router.push('/');
      return;
    }
    setUsername(currentUser);
    fetchImages(currentUser);
  }, [router]);

  const fetchImages = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('skywalk_images')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const userId = localStorage.getItem('currentUser');
      if (!userId) {
        router.push('/');
        return;
      }

      // Upload file to Supabase storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(`skywalk/${fileName}`, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(`skywalk/${fileName}`);

      // Save image info to database
      const { error: dbError } = await supabase
        .from('skywalk_images')
        .insert([
          {
            user_id: userId,
            image_url: publicUrl,
            description: description || 'No description provided'
          }
        ]);

      if (dbError) throw dbError;

      // Refresh the images list
      fetchImages(userId);
      setDescription('');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('skywalk_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      setImages(images.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Skywalk Audit</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter image description"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <p>Loading images...</p>
          ) : images.length === 0 ? (
            <p>No images uploaded yet.</p>
          ) : (
            images.map((img) => (
              <div key={img.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={img.image_url}
                  alt={img.description}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-gray-700 mb-2">{img.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(img.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SkywalkModule;