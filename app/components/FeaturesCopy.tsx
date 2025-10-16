'use client';

import { useState } from 'react';

const requirements = `Urban Audit Dashboard Requirements

1. Module Requirements:

   a) Skywalk Module
      - Location data entry form
      - Condition assessment fields
      - Multiple photo upload with descriptions
      - Status tracking for each skywalk
      - Maintenance history
      - GPS coordinates

   b) Ward Map Module
      - Area selection functionality
      - Map annotations
      - Map overlays
      - Location markers
      - Data points on map
      - Export map with data

   c) Poster Module
      - Location tagging
      - Multiple image gallery
      - Description for each image
      - Date and time tracking
      - Status updates

   d) Feature Status Module
      - Real-time status updates
      - Comments section
      - Priority levels
      - Status history
      - Team assignments

2. Data Features
   - Search functionality
   - Filter options
   - Sort capabilities
   - Export data
   - Bulk import
   - Data validation

3. Interface Needs
   - Mobile responsive design
   - Better navigation
   - Consistent styling
   - Form validations
   - Loading states
   - Error handling
   - Success messages
   - Confirmation dialogs

4. Dashboard Features
   - Activity overview
   - Recent updates
   - Status summary
   - Quick actions
   - User statistics
   - Progress tracking

5. Admin Features
   - User management
   - Access control
   - Audit logs
   - System settings
   - Backup options

6. Reports
   - Daily summaries
   - Progress reports
   - Team performance
   - Issue tracking
   - Status analytics`;

export default function FeaturesCopy() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(requirements);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleCopy}
        className={`${
          copied ? 'bg-green-500' : 'bg-blue-500'
        } text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {copied ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          )}
        </svg>
        <span>{copied ? 'Copied!' : 'Copy Requirements'}</span>
      </button>
    </div>
  );
}