import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Home, Event, Group, Login } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const Sidebar = ({ open, onClose, logo }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      PaperProps={{
        style: {
          width: 300,
          backgroundColor:
            theme.palette.mode === "dark" ? "#424242" : "#f5f5f5",
        },
      }}
    >
      <div style={{ padding: 16, textAlign: "center" }}>
        <img src={logo} alt="Logo" style={{ height: 110 }} />
      </div>
      <List>
        <ListItem
          button
          onClick={() => handleNavigation("/")}
          sx={{
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark" ? "#616161" : "#e0e0e0",
            },
          }}
        >
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Classificação Geral" />
        </ListItem>
        <ListItem
          button
          onClick={() => handleNavigation("/events")}
          sx={{
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark" ? "#616161" : "#e0e0e0",
            },
          }}
        >
          <ListItemIcon>
            <Event />
          </ListItemIcon>
          <ListItemText primary="Etapas" />
        </ListItem>
        <ListItem
          button
          onClick={() => handleNavigation("/teams")}
          sx={{
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark" ? "#616161" : "#e0e0e0",
            },
          }}
        >
          <ListItemIcon>
            <Group />
          </ListItemIcon>
          <ListItemText primary="Times" />
        </ListItem>
        <ListItem
          button
          onClick={() => handleNavigation("/login")}
          sx={{
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark" ? "#616161" : "#e0e0e0",
            },
          }}
        >
          <ListItemIcon>
            <Login />
          </ListItemIcon>
          <ListItemText primary="Login" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
