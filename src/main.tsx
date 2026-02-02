import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";

// Create MUI theme to match your design
const muiTheme = createTheme({
  palette: {
    mode: "light",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "12px",
          borderColor: "rgb(243 244 246)",
        },
        head: {
          fontSize: "0.75rem",
          fontWeight: 500,
          color: "rgb(107 114 128)",
        },
        body: {
          fontSize: "0.875rem",
          color: "rgb(107 114 128)",
        },
      },
    },
    MuiPopper: {
      styleOverrides: {
        root: {
          zIndex: 2000,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        root: {
          zIndex: 2000,
        },
        paper: {
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        },
      },
    },
  },
});

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
