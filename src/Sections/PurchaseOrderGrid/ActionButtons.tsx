import React from 'react';
import { IconButton } from "@mui/material";

interface ActionButtonsProps {
  isEditing: boolean;
  isDark: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isEditing,
  isDark,
  onEdit,
  onSave,
  onCancel,
}) => {
  if (isEditing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', height: '100%', width: '100%' }}>
        <IconButton
          size="small"
          onClick={onSave}
          sx={{
            color: isDark ? '#10b981' : '#059669',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(5, 150, 105, 0.1)',
            },
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </IconButton>
        <IconButton
          size="small"
          onClick={onCancel}
          sx={{
            color: isDark ? '#ef4444' : '#dc2626',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.1)',
            },
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </IconButton>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
      <IconButton
        size="small"
        onClick={onEdit}
        sx={{
          color: isDark ? '#60a5fa' : '#2563eb',
          '&:hover': {
            backgroundColor: isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.1)',
          },
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </IconButton>
    </div>
  );
};
