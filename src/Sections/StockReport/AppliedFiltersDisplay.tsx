import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import { Paper } from '@mui/material';

const MotionChip = motion(Chip);

interface FilterEntry {
  category: string;
  label: string;
  value: string;
}

interface AppliedFiltersDisplayProps {
  appliedFilters: { [key: string]: string[] };
  onDelete: (category: string, value: string) => void;
  onClearAll: () => void;
}

const AppliedFiltersDisplay: React.FC<AppliedFiltersDisplayProps> = ({
  appliedFilters,
  onDelete,
  onClearAll,
}) => {
  const filterEntries = React.useMemo(() => {
    const entries: FilterEntry[] = [];
    Object.entries(appliedFilters).forEach(([category, values]) => {
      values.forEach((v) => {
        const formattedLabel = category
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        entries.push({ category, label: formattedLabel, value: v });
      });
    });
    return entries;
  }, [appliedFilters]);

  if (filterEntries.length === 0) return null;

  return (
    <Box
      sx={{
        mt: 2,
        width: '100%',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: '16px',
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
          backdropFilter: 'blur(10px)',
          border: '1px solid',
          borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'divider',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '0.75rem',
            }}
          >
            <Box
              component="span"
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                display: 'inline-block',
                boxShadow: '0 0 8px rgba(25, 118, 210, 0.5)',
              }}
            />
            Applied Filters
          </Typography>
          <Typography
            variant="caption"
            onClick={onClearAll}
            sx={{
              color: 'error.main',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s',
              '&:hover': {
                opacity: 0.8,
                textDecoration: 'underline',
              },
            }}
          >
            Clear All
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <AnimatePresence>
            {filterEntries.map((filter) => (
              <MotionChip
                key={`${filter.category}-${filter.value}`}
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                layout
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.7 }}>
                      {filter.label}:
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                      {filter.value}
                    </Typography>
                  </Box>
                }
                onDelete={() => onDelete(filter.category, filter.value)}
                deleteIcon={<CloseIcon sx={{ fontSize: '14px !important' }} />}
                sx={{
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  },
                  '& .MuiChip-label': {
                    px: 1.5,
                  },
                  '& .MuiChip-deleteIcon': {
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'error.main',
                    },
                  },
                }}
              />
            ))}
          </AnimatePresence>
        </Box>
      </Paper>
    </Box>
  );
};

export default AppliedFiltersDisplay;
