'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;
      if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        setUserData(users || []);
      } else {
        setError('Invalid password');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Authentication failed');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 gap-6">
          {userData.map((user) => (
            <div key={user.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">{user.email}</h2>
              <div className="space-y-4">
                {/* Display user's module data */}
                {Object.entries(user).map(([key, value]) => {
                  if (key !== 'id' && key !== 'email') {
                    return (
                      <div key={key} className="border-t pt-4">
                        <h3 className="font-medium">{key}</h3>
                        <pre className="mt-2 whitespace-pre-wrap">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;