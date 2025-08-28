import React from "react";
import { NavLink, Link as RouterLink } from "react-router-dom"; // Adicionado Link as RouterLink
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
import { RootState } from "../../store/store";

// Tipagem para as props que o componente recebe do Layout
type User = RootState["auth"]["user"];
interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  user: User;
  handleLogout: () => void;
}

// Sub-componente com o conteúdo do menu para evitar repetição de código
const SidebarContent = ({
  user,
  handleLogout,
}: {
  user: User;
  handleLogout: () => void;
}) => {
  const navItemsPublicos = [
    { text: "Página Inicial", icon: <HomeIcon />, path: "/" },
    { text: "Torneios", icon: <EmojiEventsIcon />, path: "/torneios" },
  ];
  const navItemsAdmin = [
    { text: "Painel Admin", icon: <AdminPanelSettingsIcon />, path: "/admin" },
  ];

  return (
    <div>
      <Toolbar
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <RouterLink to="/">
          <img
            src="/img/logo_wilsons.png"
            alt="Logo da Liga dos Vales de Voleibol"
            style={{ height: 80, display: "flex", alignItems: "center" }}
          />
        </RouterLink>
      </Toolbar>
      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }} />
      <List>
        {navItemsPublicos.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={(theme) => ({
                "&.active": {
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  borderRight: `4px solid ${theme.palette.secondary.main}`,
                },
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.2)" },
              })}
            >
              <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }} />
      {user && (
        <List>
          {navItemsAdmin.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={(theme) => ({
                  "&.active": {
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    borderRight: `4px solid ${theme.palette.secondary.main}`,
                  },
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.2)" },
                })}
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
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  drawerWidth,
  mobileOpen,
  handleDrawerToggle,
  user,
  handleLogout,
}) => {
  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="menu de navegação principal"
    >
      {/* Sidebar para a versão móvel */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: "sidebar.main",
            color: "sidebar.contrastText",
          },
        }}
      >
        <SidebarContent user={user} handleLogout={handleLogout} />
      </Drawer>

      {/* Sidebar para a versão desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: "sidebar.main",
            color: "sidebar.contrastText",
          },
        }}
        open
      >
        <SidebarContent user={user} handleLogout={handleLogout} />
      </Drawer>
    </Box>
  );
};

export default Sidebar;
