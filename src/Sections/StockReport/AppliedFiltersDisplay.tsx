import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import { Paper } from '@mui/material';

const MotionChip = motion(Chip);

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
  const groupedFilters = React.useMemo(() => {
    return Object.entries(appliedFilters)
      .filter(([_, values]) => values && values.length > 0)
      .map(([category, values]) => {
        const formattedLabel = category
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        return { category, label: formattedLabel, values };
      });
  }, [appliedFilters]);

  if (groupedFilters.length === 0) return null;

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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <AnimatePresence mode="popLayout">
            {groupedFilters.map((group) => (
              <Box
                key={group.category}
                component={motion.div}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 0.5,
                  minHeight: '32px',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    color: 'text.primary',
                    fontSize: '0.75rem',
                    mr: 1,
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                  }}
                >
                  {group.label}:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.25 }}>
                  {group.values.map((v, index) => (
                    <React.Fragment key={`${group.category}-${v}`}>
                      {index > 0 && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'divider',
                            mx: 0.5,
                            fontWeight: 300,
                            userSelect: 'none'
                          }}
                        >
                          |
                        </Typography>
                      )}
                      <MotionChip
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        label={v}
                        onDelete={() => onDelete(group.category, v)}
                        deleteIcon={<CloseIcon sx={{ fontSize: '14px !important' }} />}
                        sx={{
                          height: '24px',
                          borderRadius: '6px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: (theme) => 
                              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                            transform: 'translateY(-1px)',
                          },
                          '& .MuiChip-label': {
                            px: 1,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            color: 'primary.main',
                          },
                          '& .MuiChip-deleteIcon': {
                            color: 'text.secondary',
                            ml: '2px !important',
                            mr: '4px !important',
                            '&:hover': {
                              color: 'error.main',
                            },
                          },
                        }}
                      />
                    </React.Fragment>
                  ))}
                </Box>
              </Box>
            ))}
          </AnimatePresence>
        </Box>
      </Paper>
    </Box>
  );
};

export default AppliedFiltersDisplay;
