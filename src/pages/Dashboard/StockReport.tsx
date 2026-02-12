import { useTheme } from '../../hooks/useTheme';
import { Typography } from '@mui/material';

const StockReport = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div>
      <Typography sx={{ color: isDark ? '#fff' : '#000' }}>Stock Report</Typography>
    </div>
  )
}

export default StockReport