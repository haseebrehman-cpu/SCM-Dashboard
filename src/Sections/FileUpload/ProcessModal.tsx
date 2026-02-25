import React from 'react'
import { Modal } from '../../components/ui/modal'
import { CheckCircleIcon } from '../../icons'
import { useProcessScmFiles } from '../../api/scmFileUpload'
import toast from 'react-hot-toast'

interface ProcessModalProps {
  showSuccessModal: boolean
  closeSuccessModal: () => void
  sessionId: number | null
}

const ProcessModal: React.FC<ProcessModalProps> = ({ showSuccessModal, closeSuccessModal, sessionId }) => {
  const { mutate: processFiles, isPending } = useProcessScmFiles()

  const handleProcessClick = () => {
    if (!sessionId) {
      toast.error('Session ID is missing. Cannot process files.')
      return
    }
    processFiles(sessionId, {
      onSuccess: () => {
        toast.success('Files processed successfully!')
        closeSuccessModal()
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to process files')
      },
    })
  }

  return (
    <Modal isOpen={showSuccessModal} onClose={closeSuccessModal}>
      <div className="text-center p-6">
        <div className="mb-4">
          <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Upload Successful!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Your files have been uploaded successfully and are ready to be processed.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleProcessClick}
            disabled={isPending || !sessionId}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition"
          >
            {isPending ? 'Processing...' : (!sessionId ? 'Cannot Process' : 'Process')}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ProcessModal