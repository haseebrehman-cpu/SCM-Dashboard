export const REQUIRED_FILES_COUNT = 4;

export const FILE_ACCEPT_TYPES = {
  'text/csv': ['.csv'],
  // Uncomment if needed:
  // 'application/pdf': ['.pdf'],
  // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  // 'application/vnd.ms-excel': ['.xls'],
};

export const STEP_CONFIG = {
  1: {
    title: 'Step 1: Upload Last 60 days (According to current date) Files',
    description: 'Please upload your last 60 days (According to current date) files to continue',
    multiple: true,
    nextButtonText: 'Continue to Step 2',
  },
  2: {
    title: 'Step 2: Upload Next 60 days (Of Last Year according to current date) Files',
    description: 'Please upload your next 60 days (Last Year) files to continue',
    multiple: true,
    nextButtonText: 'Continue to Step 3',
  },
  3: {
    title: 'Step 3: Upload Purchase Orders by Status and Date (status : open last 12 month file) Files',
    description: 'Please upload your purchase orders by status and date (status : open last 12 month file) file to complete the process',
    multiple: false,
    nextButtonText: 'Complete Process',
  },
} as const;

export type StepNumber = 1 | 2 | 3;
