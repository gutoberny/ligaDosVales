import { createTheme, Palette, PaletteOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface CustomPalette {
    sidebar: Palette["primary"];
  }
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}

const brandColors = {
  black: "#1a1a1a",
  gold: "#ffd700",
  red: "#c00000",
};

const theme = createTheme({
  palette: {
    primary: {
      light: "#424242",
      main: brandColors.black,
      dark: "#000000",
      contrastText: "#ffffff",
    },
    secondary: {
      main: brandColors.gold,
      contrastText: "#000000",
    },
    sidebar: {
      light: "#fa5757",
      main: brandColors.red,
      dark: "#870000",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f4f4f9",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
    },
  },
  typography: {
    fontFamily: "Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    h1: { fontSize: "2.5rem", fontWeight: 700 },
    h2: { fontSize: "2rem", fontWeight: 600 },
    h3: { fontSize: "1.5rem", fontWeight: 600 },
  },
});

export default theme;
