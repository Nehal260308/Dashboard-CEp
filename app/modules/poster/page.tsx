'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const PosterModule = () => {
  const [posters, setPosters] = useState<any[]>([]);
  const [title, setTitle] = useState('');
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
    fetchPosters(currentUser);
  }, [router]);

  const fetchPosters = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('posters')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setPosters(data);
    } catch (error) {
      console.error('Error fetching posters:', error);
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
        .from('posters')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('posters')
        .getPublicUrl(fileName);

      // Save poster info to database
      const { error: dbError } = await supabase
        .from('posters')
        .insert([
          {
            user_id: userId,
            image_url: publicUrl,
            title: title || 'Untitled Poster'
          }
        ]);

      if (dbError) throw dbError;

      // Refresh the posters list
      fetchPosters(userId);
      setTitle('');
    } catch (error) {
      console.error('Error uploading poster:', error);
      alert('Error uploading poster. Please try again.');
    }
  };

  const handleDelete = async (posterId: string) => {
    try {
      const { error } = await supabase
        .from('posters')
        .delete()
        .eq('id', posterId);

      if (error) throw error;
      
      setPosters(posters.filter(poster => poster.id !== posterId));
    } catch (error) {
      console.error('Error deleting poster:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Poster Upload</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-semibold mb-4">Upload New Poster</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter poster title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Poster
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <p>Loading posters...</p>
          ) : posters.length === 0 ? (
            <p>No posters uploaded yet.</p>
          ) : (
            posters.map((poster) => (
              <div key={poster.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-medium mb-2">{poster.title}</h3>
                <img
                  src={poster.image_url}
                  alt={poster.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => window.open(poster.image_url, '_blank')}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(poster.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PosterModule;