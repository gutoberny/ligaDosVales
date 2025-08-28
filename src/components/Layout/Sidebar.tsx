import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { logout } from "../../store/slices";
import { supabase } from "../../lib/supabaseClient";

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // 1. Lemos o estado do utilizador a partir do Redux
  const { user } = useSelector((state: RootState) => state.auth);

  const navItemsPublicos = [
    { text: "Página Inicial", icon: <HomeIcon />, path: "/" },
    { text: "Etapas", icon: <EmojiEventsIcon />, path: "/torneios" },
  ];

  const navItemsAdmin = [
    { text: "Painel Admin", icon: <AdminPanelSettingsIcon />, path: "/admin" },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erro ao fazer logout:", error);
      return;
    }
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "sidebar.main",
          color: "sidebar.contrastText",
        },
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ color: "secondary.main", fontWeight: "bold" }}
        >
          LIGA DOS VALES
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }} />
      <List>
        {/* Renderiza sempre os itens públicos */}
        {navItemsPublicos.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path} /* ... (sx props) */
            >
              <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }} />

      {/* 2. Renderiza os itens de admin e logout APENAS se o 'user' existir */}
      {user && (
        <List>
          {navItemsAdmin.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path} /* ... (sx props) */
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon sx={{ color: "inherit" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </Drawer>
  );
};

export default Sidebar;
