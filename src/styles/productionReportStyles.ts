export const getDataGridStyles = (isDark: boolean, height: string) => ({
  border: 'none',
  backgroundColor: 'transparent',
  width: '100%',
  height: height,
  maxHeight: 'calc(52px * 14)',
  overflow: 'hidden',
  '& .MuiDataGrid-main': {
    backgroundColor: 'transparent',
    overflow: 'auto',
  },
  '& .MuiDataGrid-container--top [role=row]': {
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-virtualScroller': {
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-row': {
    backgroundColor: 'transparent !important',
    '&:hover': {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03) !important' : 'rgba(0, 0, 0, 0.02) !important',
    },
  },
  '& .MuiDataGrid-cell': {
    borderColor: isDark ? '#1f2937' : '#f2f4f7',
    color: isDark ? '#f2f4f7' : '#1d2939',
    backgroundColor: 'transparent',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
  },
  '& .MuiDataGrid-columnHeaders': {
    borderColor: isDark ? '#1f2937' : '#f2f4f7',
    backgroundColor: isDark ? '#111827' : '#f9fafb',
    color: isDark ? "#f9fafb" : '#101828',
    borderBottomWidth: '1px',
  },
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: isDark ? '#111827' : '#f9fafb',
    '&:focus': {
      outline: 'none',
    },
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    color: isDark ? '#98a2b3' : '#475467',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  '& .MuiDataGrid-footerContainer': {
    borderColor: isDark ? '#1f2937' : '#f2f4f7',
    backgroundColor: 'transparent',
  },
  '& .MuiTablePagination-root': {
    color: isDark ? '#98a2b3' : '#475467',
  },
  '& .MuiIconButton-root': {
    color: isDark ? '#98a2b3' : '#667085',
    '&:hover': {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    },
  },
  '& .MuiDataGrid-selectedRowCount': {
    color: isDark ? '#98a2b3' : '#475467',
  },
  '& .MuiDataGrid-columnSeparator': {
    color: isDark ? '#1f2937' : '#f2f4f7',
  },
  '& .MuiDataGrid-sortIcon': {
    color: isDark ? '#667085' : '#98a2b3',
  },
  '& .MuiDataGrid-menuIconButton': {
    color: isDark ? '#98a2b3' : '#667085',
  },
  '& .MuiDataGrid-iconButtonContainer': {
    color: isDark ? '#98a2b3' : '#667085',
  },
  '& .MuiDataGrid-columnHeader .MuiIconButton-root': {
    color: isDark ? '#98a2b3' : '#667085',
  },
  /* Specific target for MUI X License Watermark */
  '& div[style*="z-index: 100000"], & div[style*="z-index: 100000;"]': {
    display: 'none !important',
    visibility: 'hidden !important',
    opacity: '0 !important',
    pointerEvents: 'none !important',
  },
});

export const getFormControlStyles = (isDark: boolean) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 2,
  '& .MuiOutlinedInput-root': {
    backgroundColor: isDark ? '#0c111d' : 'white',
    borderRadius: '8px',
    '& fieldset': {
      borderColor: isDark ? '#1f2937' : '#d0d5dd',
    },
    '&:hover fieldset': {
      borderColor: isDark ? '#344054' : '#98a2b3',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#465fff',
      borderWidth: '1px',
    },
  },
  '& .MuiInputLabel-root': {
    color: isDark ? '#98a2b3' : '#667085',
    '&.Mui-focused': {
      color: '#465fff',
    },
  },
  '& .MuiSelect-select': {
    color: isDark ? '#f2f4f7' : '#1d2939',
    fontSize: '14px',
    padding: '10px 14px',
  },
  '& .MuiSelect-icon': {
    color: isDark ? '#98a2b3' : '#667085',
  },
});
