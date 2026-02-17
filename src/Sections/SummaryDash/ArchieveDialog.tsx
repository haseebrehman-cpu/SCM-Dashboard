import React, { useState } from 'react';
import { Button } from '@mui/material';
import { Modal } from '../../components/ui/modal';
import { DateEditor } from '../PurchaseOrderGrid/DateEditor';
import { useTheme } from '../../hooks/useTheme';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface ArchieveDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ArchieveDialog: React.FC<ArchieveDialogProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    console.log('Viewing archived report for:', startDate, "to", endDate);
    // Add logic here to load archived data based on startDate
    if (startDate !== null && startDate !== ''&& endDate !== null && endDate !== "") {
      toast.success('Archieved Filter Applied Successfully');
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="flex flex-col max-w-xl w-full sm:w-[600px] mx-auto p-6 sm:p-10 bg-white dark:bg-gray-900 rounded-2xl">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white/90">
            Select a date to view archived report
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-6">
            Choose a specific date to retrieve historical report data.
          </p>

          <div className='flex flex-col items-center gap-4'>
            <div className="w-full max-w-sm">
              <label
                htmlFor="archive-date"
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left'
              >
                Start Date
              </label>
              <DateEditor
                value={startDate}
                onChange={setStartDate}
                isDark={isDark}
                max={format(new Date(), 'yyyy-MM-dd')}
              />
              <label
                htmlFor="archive-date"
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left'
              >
                End Date
              </label>
              <DateEditor
                value={endDate}
                onChange={setEndDate}
                isDark={isDark}
                max={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant='outlined'
            size='medium'
            onClick={handleClose}
            sx={{
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
              '&:hover': {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            size='medium'
            onClick={handleSubmit}
            sx={{
              backgroundColor: '#465fff',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#3641f5',
              }
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ArchieveDialog;
