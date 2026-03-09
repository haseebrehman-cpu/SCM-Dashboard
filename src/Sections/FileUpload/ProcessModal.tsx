import React, { useEffect, useState } from 'react'
import { Modal } from '../../components/ui/modal'
import { Button, LinearProgress, Box, Typography } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useProcessScmFiles } from '../../api/scmFileUpload'
import toast from 'react-hot-toast'
import { useTheme } from '../../hooks/useTheme'

type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

interface ProcessModalProps {
  showSuccessModal: boolean
  closeSuccessModal: () => void
  sessionId: number | null
}

const ProcessModal: React.FC<ProcessModalProps> = ({ showSuccessModal, closeSuccessModal, sessionId }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const { mutate: processFiles, isPending, isSuccess, isError, error, reset } = useProcessScmFiles()

  const [loadingPercentage, setLoadingPercentage] = useState(0)
  const [status, setStatus] = useState<LoadStatus>('idle')

  // Determine status from points in time
  useEffect(() => {
    if (isPending) {
      setStatus('loading')
    } else if (isSuccess && status === 'loading') {
      setLoadingPercentage(100)
      setStatus('success')
    } else if (isError && status === 'loading') {
      setStatus('error')
    }
  }, [isPending, isSuccess, isError, status])

  // Simulate progress while loading
  useEffect(() => {
    if (status === 'loading') {
      const intervalId = setInterval(() => {
        setLoadingPercentage((prev) => {
          if (prev >= 95) return 95
          const randomIncrement = Math.floor(Math.random() * 5) + 1
          return Math.min(prev + randomIncrement, 95)
        })
      }, Math.floor(Math.random() * 3000) + 500)

      return () => clearInterval(intervalId)
    }
  }, [status])

  // Reset state when modal opens
  useEffect(() => {
    if (showSuccessModal) {
      setLoadingPercentage(0)
      setStatus('idle')
      reset?.()
    }
  }, [showSuccessModal, reset])

  const handleProcessClick = () => {
    if (!sessionId) {
      toast.error('Session ID is missing. Cannot process files.')
      return
    }
    setStatus('loading')
    setLoadingPercentage(0)
    processFiles({ session_id: sessionId }, {
      onSuccess: () => {
        toast.success('Files processed successfully!')
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to process files')
      },
    })
  }

  const handleClose = () => {
    if (status === 'loading') return
    closeSuccessModal()
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
        return 'Upload Successful!'
      case 'loading':
        return 'Processing Files...'
      case 'success':
        return 'Files Processed Successfully!'
      case 'error':
        return 'Failed to Process Files'
    }
  }

  const getDescription = () => {
    switch (status) {
      case 'idle':
        return 'Your files have been uploaded successfully and are ready to be processed. This may take a few minutes.'
      case 'loading':
        return 'Please wait while we process and seed your reports. Do not close this window.'
      case 'success':
        return 'All files have been successfully processed and reports are now available for viewing.'
      case 'error':
        return error?.message || 'An error occurred while processing the files. Please try again.'
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
    <Modal
      isOpen={showSuccessModal}
      onClose={handleClose}
      showCloseButton={status !== 'loading'}
    >
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
          {(status === 'loading' || status === 'success') && (
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
                {error?.message || 'Something went wrong. You can close this dialog and try again.'}
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
                onClick={handleClose}
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
                onClick={handleProcessClick}
                sx={{
                  backgroundColor: '#465fff',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#3641f5',
                  },
                }}
              >
                Process Data
              </Button>
            </>
          )}

          {(status === 'success' || status === 'error') && (
            <Button
              variant="contained"
              size="medium"
              onClick={handleClose}
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

export default ProcessModal
