import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Switch from "@mui/material/Switch";
import Sidebar from "./Sidebar";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import winsonLogo from "../img/wilsonLogo.png"; // Import the logo

const Header = ({ toggleDarkMode, darkMode }) => {
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <AppBar position="fixed" color="primary">
        <Toolbar style={{ minHeight: 110 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          {!open && (
            <img
              src={winsonLogo}
              alt="Logo"
              style={{ height: 110, marginRight: 16 }}
            />
          )}
          <Typography
            variant="h6"
            noWrap
            style={{
              flexGrow: 1,
              textAlign: "center",
            }}
          >
            🏐 Liga dos Vales de Voleibol 🏐
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar open={open} onClose={handleDrawerToggle} logo={winsonLogo} />
    </>
  );
};

export default Header;
