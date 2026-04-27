import React from "react";
import { Link, useLocation } from "react-router";
import PageMeta from "../../components/common/PageMeta";

const AccessDenied: React.FC = () => {
  const location = useLocation();
  const featureName = (location.state as { feature?: string })?.feature;

  return (
    <>
      <PageMeta
        title="403 Access Denied | SCM Dashboard"
        description="You do not have permission to access this page."
      />
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="mb-6">
          <svg
            className="mx-auto h-24 w-24 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m0 0v2m0-2h2m-2 0H10m11 3a9 9 0 11-18 0 9 9 0 0118 0zM12 9a3 3 0 100-6 3 3 0 000 6z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          403 - Access Denied
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          {featureName ? (
            <>You do not have the necessary permissions to access the <strong>{featureName}</strong>.</>
          ) : (
            "You do not have the necessary permissions to access this page."
          )}
          <br />
          Please contact your administrator if you believe this is an error.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#047ADB] hover:bg-[#047ADB]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#047ADB] transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </>
  );
};

export default AccessDenied;
