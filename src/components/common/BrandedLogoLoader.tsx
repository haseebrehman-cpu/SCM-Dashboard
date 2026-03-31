import React from 'react';
import { Box } from '@mui/material';

interface BrandedLogoLoaderProps {
  isLoading: boolean;
  isDark: boolean;
  message?: string;
  minHeight?: string | number;
}

const getAssetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const BrandedLogoLoader: React.FC<BrandedLogoLoaderProps> = ({ 
  isLoading, 
  isDark, 
  message = "Updating Dashboard...",
  minHeight
}) => {
  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        transition: 'all 0.3s ease-in-out',
        minHeight: minHeight || '400px',
        borderRadius: 'inherit'
      }}
    >
      <div className="animate-pulse flex flex-col items-center">
        <img
          src={getAssetPath(isDark ? "logos/Dark1.svg" : "logos/Light1.svg")}
          alt="Loading..."
          width={120}
          height={100}
        />
        <span className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          {message}
        </span>
      </div>
    </Box>
  );
};
