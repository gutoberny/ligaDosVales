import React from "react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

// Importando componentes do MUI
import { Box, Toolbar, AppBar, Typography, Button } from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Sidebar from "./Sidebar";

const Layout = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Liga dos Vales de Voleibol
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {!user && (
            <Button
              component={RouterLink}
              to="/login"
              color="inherit"
              variant="outlined"
              startIcon={<AdminPanelSettingsIcon />}
              sx={{
                borderColor: "rgba(255, 255, 255, 0.5)",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              dmin
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Sidebar />

      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
