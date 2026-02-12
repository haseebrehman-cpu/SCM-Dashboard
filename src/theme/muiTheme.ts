import { createTheme, type Theme } from "@mui/material/styles";

// Professional color palette matching the Tailwind configuration
const palette = {
  light: {
    primary: "#465fff",
    background: "#f9fafb",
    paper: "#ffffff",
    text: "#101828",
    secondaryText: "#667085",
    border: "#e4e7ec", // gray-200
  },
  dark: {
    primary: "#465fff",
    background: "#0c111d", // gray-950
    paper: "#1a2231", // gray-dark
    text: "#fcfcfd", // gray-25
    secondaryText: "#98a2b3", // gray-400
    border: "#344054", // gray-700
  },
};

export const getMuiTheme = (mode: "light" | "dark"): Theme => {
  const colors = palette[mode];

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary,
        contrastText: "#ffffff",
      },
      background: {
        default: colors.background,
        paper: colors.paper,
      },
      text: {
        primary: colors.text,
        secondary: colors.secondaryText,
      },
      divider: colors.border,
    },
    typography: {
      fontFamily: '"Outfit", sans-serif',
      h1: { fontWeight: 600 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { textTransform: "none", fontWeight: 500 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            boxShadow: mode === "light" 
              ? "0px 1px 3px 0px rgba(16, 24, 40, 0.1), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)"
              : "0px 1px 3px 0px rgba(0, 0, 0, 0.3), 0px 1px 2px 0px rgba(0, 0, 0, 0.2)",
            border: `1px solid ${colors.border}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            padding: "8px 16px",
          },
          containedPrimary: {
            "&:hover": {
              backgroundColor: "#3641f5", // brand-600
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: "12px 16px",
            borderColor: colors.border,
          },
          head: {
            backgroundColor: mode === "light" ? "#f9fafb" : "#121926",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: colors.secondaryText,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          },
          body: {
            fontSize: "0.875rem",
          },
        },
      },
      // @ts-expect-error - MuiDataGrid is not in base Theme types
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: "none",
            "& .MuiDataGrid-cell": {
              borderColor: colors.border,
            },
            "& .MuiDataGrid-columnHeaders": {
              borderColor: colors.border,
              backgroundColor: mode === "light" ? "#f9fafb" : "#121926",
            },
            "& .MuiDataGrid-footerContainer": {
              borderColor: colors.border,
            },
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
            boxShadow: mode === "light"
              ? "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
              : "0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3)",
            border: `1px solid ${colors.border}`,
            marginTop: "8px",
          },
        },
      },
    },

  });
};

