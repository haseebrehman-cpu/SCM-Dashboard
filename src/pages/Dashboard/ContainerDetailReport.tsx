import { useTheme } from '../../hooks/useTheme';
import { Typography } from '@mui/material';

const ContainerDetailReport = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div>
      <Typography sx={{ color: isDark ? '#fff' : '#000' }}>Container Detail Report</Typography>
    </div>
  )
}

export default ContainerDetailReport