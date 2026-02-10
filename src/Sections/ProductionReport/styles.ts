export const getDataGridStyles = (isDark: boolean) => ({
  border: 'none',
  backgroundColor: 'transparent',
  width: '100%',
  '& .MuiDataGrid-main': {
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-container--top [role=row]': {
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-virtualScroller': {
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-row': {
    backgroundColor: 'transparent !important',
  },
  '& .MuiDataGrid-cell': {
    borderColor: isDark ? 'rgb(31 41 55)' : 'rgb(229 231 235)',
    color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
    backgroundColor: 'transparent',
    fontSize: '12px'
  },
  '& .MuiDataGrid-columnHeaders': {
    borderColor: isDark ? 'rgb(31 41 55)' : 'rgb(229 231 235)',
    backgroundColor: isDark ? 'rgb(31 41 55)' : 'rgb(229 231 235)',
    color: isDark ? "#fff" : '#000',
  },
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
    fontSize: '12px'
  },
  '& .MuiDataGrid-footerContainer': {
    borderColor: isDark ? 'rgb(31 41 55)' : 'rgb(229 231 235)',
    backgroundColor: 'transparent',
  },
  '& .MuiTablePagination-root': {
    color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
  },
  '& .MuiIconButton-root': {
    color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05) !important' : 'rgba(0, 0, 0, 0.04) !important',
  },
  '& .MuiDataGrid-selectedRowCount': {
    color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
  },
  '& .MuiDataGrid-columnSeparator': {
    color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgb(229 231 235)',
  },
  '& .MuiDataGrid-sortIcon': {
    color: isDark ? '#000' : 'rgb(107 114 128)',
  },
  '& .MuiDataGrid-menuIconButton': {
    color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)',
  },
  '& .MuiDataGrid-iconButtonContainer': {
    color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)',
  },
  '& .MuiDataGrid-columnHeader .MuiIconButton-root': {
    color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)',
  },
});

export const getFormControlStyles = (isDark: boolean) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 2,
  minWidth: 200,
  '& .MuiOutlinedInput-root': {
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
    '& fieldset': {
      borderColor: isDark ? 'rgb(55 65 81)' : 'rgb(209 213 219)',
    },
    '&:hover fieldset': {
      borderColor: isDark ? 'rgb(75 85 99)' : 'rgb(156 163 175)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#465fff',
    },
  },
  '& .MuiInputLabel-root': {
    color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)',
    '&.Mui-focused': {
      color: '#465fff',
    },
  },
  '& .MuiSelect-select': {
    color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
  },
  '& .MuiSelect-icon': {
    color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)',
  },
});
