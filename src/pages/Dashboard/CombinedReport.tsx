import { Typography } from '@mui/material';
import { useTheme } from '../../hooks/useTheme';

const CombinedReport = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div>
      <Typography sx={{ color: isDark ? '#fff' : '#000' }}>Combined Report</Typography>
    </div>
  )
}

export default CombinedReport