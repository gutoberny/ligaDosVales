import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Teams from "./pages/Teams";
import "./App.css";
import Login from "./pages/Login";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#DF1926", // Red
    },
    secondary: {
      main: "#FFD700", // Gold
      contrastText: "#000000", // Black
      background: "#303030",
    },
    background: {
      default: "#303030",
    },
  },
});

const App = () => {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app-container">
          <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
