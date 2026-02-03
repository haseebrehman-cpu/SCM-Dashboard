import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { muiTheme } from "./theme/muiTheme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <MuiThemeProvider theme={muiTheme}>
        <AppWrapper>
          <App />
        </AppWrapper>
      </MuiThemeProvider>
    </ThemeProvider>
  </StrictMode>,
);
