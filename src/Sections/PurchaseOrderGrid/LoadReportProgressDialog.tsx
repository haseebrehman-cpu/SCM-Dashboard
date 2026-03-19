import React from 'react'
import { Modal } from '../../components/ui/modal'
import { Button } from '@mui/material'
import { LinearProgress, Box, Typography } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

interface LoadReportProgressDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  onRetry: () => Promise<void>
  onCancel: () => void
  isDark: boolean
  status: LoadStatus
  progress: number
  errorMessage?: string
  showRetry?: boolean
}

const LoadReportProgressDialog: React.FC<LoadReportProgressDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onRetry,
  onCancel,
  isDark,
  status,
  progress: loadingPercentage,
  errorMessage,
  showRetry = true,
}) => {
  const handleConfirm = async () => {
    await onConfirm()
  }

  const handleCancel = () => {
    if (status === 'loading') {
      onCancel()
    }
    onClose()
  }

  const handleCloseAfterDone = () => {
    onClose()
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'idle':
        return (
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <CloudUploadIcon sx={{ fontSize: 32, color: '#465fff' }} />
          </div>
        )
      case 'loading':
        return (
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center animate-pulse">
            <CloudUploadIcon sx={{ fontSize: 32, color: '#465fff' }} />
          </div>
        )
      case 'success':
        return (
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircleOutlineIcon sx={{ fontSize: 32, color: '#22c55e' }} />
          </div>
        )
      case 'error':
        return (
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
            <ErrorOutlineIcon sx={{ fontSize: 32, color: '#ef4444' }} />
          </div>
        )
    }
  }

  const getTitle = () => {
    switch (status) {
      case 'idle':
        return 'Load Reports'
      case 'loading':
        return 'Seeding Reports...'
      case 'success':
        return 'Reports Loaded Successfully!'
      case 'error':
        return 'Failed to Load Reports'
    }
  }

  const getDescription = () => {
    switch (status) {
      case 'idle':
        return 'This will seed and generate all reports from the uploaded purchase order data. This process may take a few minutes.'
      case 'loading':
        return 'Please wait while we process and seed your reports. Do not close this window.'
      case 'success':
        return 'All reports have been successfully generated and are now available for viewing.'
      case 'error':
        return errorMessage || 'An error occurred while loading the reports. Please try again.'
    }
  }

  const getProgressColor = () => {
    switch (status) {
      case 'success':
        return '#22c55e'
      case 'error':
        return '#ef4444'
      default:
        return '#465fff'
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={status === 'loading' ? () => { } : handleCloseAfterDone} showCloseButton={status !== 'loading'}>
      <div className="flex flex-col max-w-xl w-full sm:w-[500px] mx-auto p-6 sm:p-8">
        <div className="text-center">
          {getStatusIcon()}

          <h2 className="text-xl font-bold text-gray-900 dark:text-white/90 mb-2">
            {getTitle()}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
            {getDescription()}
          </p>

          {/* Progress Section */}
          {(status === 'loading' || status === 'success' || status === 'error') && (
            <Box sx={{ width: '100%', mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                    fontWeight: 500,
                    fontSize: '0.8rem',
                  }}
                >
                  {status === 'success' ? 'Completed' : 'Processing...'}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                  }}
                >
                  {loadingPercentage}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={loadingPercentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor: getProgressColor(),
                    transition: 'transform 0.4s ease',
                  },
                }}
              />
            </Box>
          )}

          {/* Error retry hint */}
          {status === 'error' && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-xs text-red-700 dark:text-red-300">
                {errorMessage || 'Something went wrong. You can close this dialog and try again.'}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-2">
          {status === 'idle' && (
            <>
              <Button
                variant="outlined"
                size="medium"
                onClick={handleCancel}
                sx={{
                  color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="medium"
                onClick={handleConfirm}
                sx={{
                  backgroundColor: '#465fff',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#3641f5',
                  },
                }}
              >
                Load Reports
              </Button>
            </>
          )}

          {status === 'loading' && (
            <Button
              variant="outlined"
              size="medium"
              onClick={handleCancel}
              sx={{
                color: isDark ? '#ef4444' : '#dc2626',
                borderColor: isDark ? 'rgba(239,68,68,0.4)' : 'rgba(220,38,38,0.4)',
                '&:hover': {
                  borderColor: isDark ? 'rgba(239,68,68,0.7)' : 'rgba(220,38,38,0.7)',
                  backgroundColor: isDark ? 'rgba(239,68,68,0.08)' : 'rgba(220,38,38,0.05)',
                },
              }}
            >
              Cancel
            </Button>
          )}

          {status === 'error' && showRetry && (
            <Button
              variant="contained"
              size="medium"
              onClick={onRetry}
              sx={{
                backgroundColor: '#465fff',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#3641f5',
                },
              }}
            >
              Retry
            </Button>
          )}

          {(status === 'success' || status === 'error') && (
            <Button
              variant="contained"
              size="medium"
              onClick={handleCloseAfterDone}
              sx={{
                backgroundColor: status === 'success' ? '#22c55e' : '#465fff',
                color: '#fff',
                '&:hover': {
                  backgroundColor: status === 'success' ? '#16a34a' : '#3641f5',
                },
              }}
            >
              {status === 'success' ? 'Done' : 'Close'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default LoadReportProgressDialog