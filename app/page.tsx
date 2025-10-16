'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  const users = [
    { id: 'manthan', name: 'Manthan' },
    { id: 'vihan', name: 'Vihan' },
    { id: 'nemi', name: 'Nemi' }
  ];

  const handleUserSelect = (userId: string) => {
    localStorage.setItem('currentUser', userId);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="p-8 bg-white rounded-lg shadow-xl w-96">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Urban Audit Dashboard
        </h1>
        <div className="space-y-4">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleUserSelect(user.id)}
              className="w-full p-4 text-left bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 transition-all hover:border-blue-300 hover:shadow-md"
            >
              <span className="text-lg font-medium text-gray-700">{user.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}