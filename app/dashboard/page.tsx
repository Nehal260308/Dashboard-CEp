'use client';

import { useRouter } from 'next/navigation';
import FeaturesCopy from '../components/FeaturesCopy';

export default function Dashboard() {
  const router = useRouter();
  const modules = [
    {
      title: 'Poster Upload',
      path: '/modules/poster',
      description: 'Upload and manage urban audit posters'
    },
    {
      title: 'Ward Maps',
      path: '/modules/ward-map',
      description: 'Manage ward maps and annotations'
    },
    {
      title: 'Skywalk',
      path: '/modules/skywalk',
      description: 'Track skywalk conditions and maintenance'
    },
    {
      title: 'Feature Status',
      path: '/modules/feature-status',
      description: 'Track urban features and their status'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Urban Audit Dashboard</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Switch User
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {modules.map((module) => (
            <div
              key={module.path}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(module.path)}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{module.title}</h2>
              <p className="text-gray-600">{module.description}</p>
            </div>
          ))}
        </div>
      </div>
      <FeaturesCopy />
    </div>
  );
}
