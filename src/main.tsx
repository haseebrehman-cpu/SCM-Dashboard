import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { getMuiTheme } from "./theme/muiTheme";
import { ErrorBoundary } from "./components/common/ErrorBoundary.tsx";
import { useTheme } from "./hooks/useTheme";
import { queryClient } from "./lib/queryClient.ts";

export const MuiThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      {children}
    </MuiThemeProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <MuiThemeWrapper>
          <AppWrapper>
            <QueryClientProvider client={queryClient}>
              <Toaster position="bottom-right" />
              <App />
            </QueryClientProvider>
          </AppWrapper>
        </MuiThemeWrapper>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);

