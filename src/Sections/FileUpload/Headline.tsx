import { Box, Alert, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '../../hooks/useTheme';

const StyledAlert = styled(Alert)(({ theme }) => ({
  borderLeft: '8px solid #f4b836',
  borderRadius: theme.shape.borderRadius,
  maxWidth: '100%',
  width: '100%',
  '& .MuiAlert-icon': {
    color: '#f4b836',
    alignItems: 'center'
  }
}));


const Headline = ({ alertMessage }: { alertMessage: string }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <StyledAlert
        icon={<span style={{ fontSize: 20 }}>ⓘ</span>}
        severity="success"
      >
        {/* <AlertTitle sx={{ color: '#8a6d2b', fontWeight: 600 }}>
          High Alert
        </AlertTitle> */}

        <Typography variant="body1" sx={{ color: isDark ? "#fff" : '#000', fontWeight: 500, alignItems: 'center' }}>
          {alertMessage}
        </Typography>
      </StyledAlert>
    </Box>
  );
};

export default Headline;