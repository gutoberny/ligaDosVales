import React from "react";
import { NavLink } from "react-router-dom";
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
import { RootState } from "../../store/store"; // Apenas para tipagem

// Definimos o tipo do utilizador para maior segurança
type User = RootState["auth"]["user"];

// Definimos as "props" que o nosso componente Sidebar espera receber do Layout
interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  user: User;
  handleLogout: () => void;
}

// Criamos um sub-componente com o conteúdo do menu para não repetir código
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
