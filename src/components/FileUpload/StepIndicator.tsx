import React from 'react';
import { CheckCircleIcon } from '../../icons';

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
  file1Status?: 'uploading' | 'completed' | 'error';
  file2Status?: 'uploading' | 'completed' | 'error';
  file3Status?: 'uploading' | 'completed' | 'error';
}

/**
 * StepIndicator Component
 * Single Responsibility: Renders the visual step progress indicator
 */
export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  file1Status,
  file2Status,
  file3Status,
}) => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center">
        {/* Step 1 */}
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-20 h-12 rounded-full border-2 transition-all duration-300 ${
              currentStep >= 1
                ? 'bg-brand-500 border-brand-500 text-white'
                : 'bg-gray-100 border-gray-300 text-gray-400 dark:bg-gray-800 dark:border-gray-700'
            }`}
          >
            {file1Status === 'completed' ? (
              <CheckCircleIcon className="w-6 h-6" />
            ) : (
              <span className="text-sm font-semibold">Step 1</span>
            )}
          </div>
          <div className={`ml-3 ${currentStep >= 1 ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
            <p className="text-sm font-medium">Last 60 days (Current Date)</p>
            {file1Status === 'completed' && (
              <p className="text-xs text-green-600 dark:text-green-400">Uploaded</p>
            )}
          </div>
        </div>

        {/* Connector 1 */}
        <div
          className={`w-24 h-0.5 mx-4 transition-all duration-300 ${
            file1Status === 'completed' ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-700'
          }`}
        />

        {/* Step 2 */}
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-20 h-12 rounded-full border-2 transition-all duration-300 ${
              currentStep >= 2 && file1Status === 'completed'
                ? 'bg-brand-500 border-brand-500 text-white'
                : 'bg-gray-100 border-gray-300 text-gray-400 dark:bg-gray-800 dark:border-gray-700'
            }`}
          >
            {file2Status === 'completed' ? (
              <CheckCircleIcon className="w-6 h-6" />
            ) : (
              <span className="text-sm font-semibold">Step 2</span>
            )}
          </div>
          <div
            className={`ml-3 ${
              currentStep >= 2 && file1Status === 'completed' ? 'text-gray-900 dark:text-white' : 'text-gray-400'
            }`}
          >
            <p className="text-sm font-medium">Next 60 days (Last Year)</p>
            {file2Status === 'completed' && (
              <p className="text-xs text-green-600 dark:text-green-400">Uploaded</p>
            )}
          </div>
        </div>

        {/* Connector 2 */}
        <div
          className={`w-24 h-0.5 mx-4 transition-all duration-300 ${
            file2Status === 'completed' ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-700'
          }`}
        />

        {/* Step 3 */}
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-20 h-12 rounded-full border-2 transition-all duration-300 ${
              currentStep >= 3 && file2Status === 'completed'
                ? 'bg-brand-500 border-brand-500 text-white'
                : 'bg-gray-100 border-gray-300 text-gray-400 dark:bg-gray-800 dark:border-gray-700'
            }`}
          >
            {file3Status === 'completed' ? (
              <CheckCircleIcon className="w-6 h-6" />
            ) : (
              <span className="text-sm font-semibold">Step 3</span>
            )}
          </div>
          <div
            className={`ml-3 ${
              currentStep >= 3 && file2Status === 'completed' ? 'text-gray-900 dark:text-white' : 'text-gray-400'
            }`}
          >
            <p className="text-sm font-medium">Purchase Orders by Status and Date</p>
            {file3Status === 'completed' && (
              <p className="text-xs text-green-600 dark:text-green-400">Uploaded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
