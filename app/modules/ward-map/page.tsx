'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const WardMapModule = () => {
  const [maps, setMaps] = useState<any[]>([]);
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
    fetchMaps(currentUser);
  }, [router]);

  const fetchMaps = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('ward_maps')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setMaps(data);
    } catch (error) {
      console.error('Error fetching maps:', error);
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

      // Upload file to Supabase storage in user-specific folder
      const timestamp = Date.now();
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${userId}/${timestamp}-${cleanFileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(`ward-maps/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(`ward-maps/${fileName}`);

      // Save map info to database
      const { error: dbError } = await supabase
        .from('ward_maps')
        .insert([
          {
            user_id: userId,
            map_url: publicUrl,
            title: title || 'Untitled Map'
          }
        ]);

      if (dbError) throw dbError;

      // Refresh the maps list
      fetchMaps(userId);
      setTitle('');
    } catch (error) {
      console.error('Error uploading map:', error);
      alert('Error uploading map. Please try again.');
    }
  };

  const handleDelete = async (mapId: string) => {
    try {
      // Get the map data first to get the file path
      const { data: mapData, error: fetchError } = await supabase
        .from('ward_maps')
        .select('*')
        .eq('id', mapId)
        .single();

      if (fetchError) throw fetchError;

      // Extract the file path from the URL
      const fileUrl = new URL(mapData.map_url);
      const filePath = fileUrl.pathname.split('/').slice(-3).join('/');

      // Delete from storage first
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Then delete from the database
      const { error: dbError } = await supabase
        .from('ward_maps')
        .delete()
        .eq('id', mapId)
        .eq('user_id', localStorage.getItem('currentUser')); // Extra safety check

      if (dbError) throw dbError;

      setMaps(maps.filter(map => map.id !== mapId));
    } catch (error) {
      console.error('Error deleting map:', error);
      alert('Error deleting map. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Ward Maps</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200 flex items-center"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">Upload New Map</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Map Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Enter map title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Map (PDF/Image)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors duration-200">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF or image files up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading maps...</p>
            </div>
          ) : maps.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <p className="text-gray-500">No maps uploaded yet.</p>
            </div>
          ) : (
            maps.map((map) => (
              <div key={map.id} className="bg-white rounded-lg shadow-md transition-transform duration-200 hover:shadow-lg transform hover:-translate-y-1">
                <a
                  href={map.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                        {map.title}
                      </h3>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(map.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(map.id);
                      }}
                      className="ml-4 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WardMapModule;