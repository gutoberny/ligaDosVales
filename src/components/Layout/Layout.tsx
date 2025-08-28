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
        {/* A Toolbar precisa de position: 'relative' para que o posicionamento absoluto do filho funcione */}
        <Toolbar sx={{ position: "relative" }}>
          <RouterLink to="/">
            <img
              src="/img/logo_wilsons.png"
              alt="Logo da Liga dos Vales de Voleibol"
              style={{ height: 75, marginRight: 10, display: "flex" }}
            />
          </RouterLink>

          {/* --- CORREÇÃO APLICADA AQUI --- */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              // 1. Posiciona o título de forma absoluta em relação à Toolbar
              position: "absolute",
              // 2. Move o ponto de início para o centro exato (horizontal e vertical)
              left: "50%",
              top: "50%",
              // 3. Usa o 'transform' para corrigir o alinhamento, puxando o elemento
              // de volta pela metade da sua própria largura e altura.
              transform: "translate(-50%, -50%)",
            }}
          >
            Liga dos Vales de Voleibol
          </Typography>

          {/* Este espaçador continua a empurrar o botão de login para a direita */}
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
              Login Admin
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
