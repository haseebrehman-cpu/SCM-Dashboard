import { Typography } from "@mui/material";
import PageMeta from "../../components/common/PageMeta";
import { useTheme } from "../../hooks/useTheme";

export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <>
      <PageMeta
        title="SCM Dashboard"
        description="Welcome to your SCM dashboard. Manage your business metrics and analytics in one place."
      />

      <Typography sx={{ color: isDark ? '#fff' : '#000' }}>SCM Dashboard</Typography>
    </>
  );
}
