import React from 'react';

/**
 * Loading Spinner Component
 * Displayed while pages are being loaded via lazy loading
 */
const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin dark:border-gray-700 dark:border-t-blue-400"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">SCM DASHBOARD IS LOADING...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
