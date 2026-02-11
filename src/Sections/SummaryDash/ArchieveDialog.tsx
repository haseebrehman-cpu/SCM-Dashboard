import { Button } from '@mui/material';
import { Modal } from '../../components/ui/modal';


interface ArchieveDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ArchieveDialog: React.FC<ArchieveDialogProps> = ({ isOpen, onClose }) => {

  const handleClose = () => {
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="flex flex-col  max-w-xl w-[600px] mx-auto p-10">
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Select a date to view archieved report
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Please select a date
          </p>
        </div>



        <div className="flex justify-end gap-3">
          <Button variant='outlined' size='small' onClick={handleClose}>Cancel</Button>
          <Button variant='outlined' size='small' onClick={handleClose}>Submit</Button>
        </div>
      </div>
    </Modal >
  )
}

export default ArchieveDialog