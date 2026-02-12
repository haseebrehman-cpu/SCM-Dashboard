import { Typography } from "@mui/material";
import { useTheme } from "../../hooks/useTheme";

const WHContainerReport = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div>
      <Typography sx={{ color: isDark ? '#fff' : '#000' }}>Warehouse Container Report</Typography>
    </div>
  )
}

export default WHContainerReport