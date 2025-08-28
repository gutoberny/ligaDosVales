import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "./lib/supabaseClient";
import { setUser, setSessionChecked } from "./store/slices";
import { AppDispatch, RootState } from "./store/store";

import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import TournamentDetailPage from "./pages/TournamentDetailPage";
import MesaControlePage from "./pages/MesaControlePage";
import TorneiosPublicosPage from "./pages/TorneiosPublicosPage";
import TorneioPublicoDetailPage from "./pages/TorneioPublicoDetailPage";
import PlayoffsPage from "./pages/PlayoffsPage";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout/Layout";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { sessionChecked } = useSelector((state: RootState) => state.auth);

  // Este useEffect corre apenas uma vez, quando a App é montada
  useEffect(() => {
    // Pedimos ao Supabase a sessão atual
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session) {
          // Se houver uma sessão, atualizamos o nosso estado do Redux
          dispatch(setUser({ user: session.user, session: session }));
        }
      })
      .finally(() => {
        // Marcamos que a verificação terminou, havendo ou não uma sessão
        dispatch(setSessionChecked(true));
      });
  }, [dispatch]);

  // Enquanto a sessão está a ser verificada, mostramos uma mensagem de carregamento
  // para evitar o "piscar" da tela de login.
  if (!sessionChecked) {
    return <div>Carregando sessão...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* A rota 'pai' agora é o nosso Layout */}
        <Route path="/" element={<Layout />}>
          {/* Todas as outras rotas são 'filhas' e serão renderizadas dentro do <Outlet /> */}

          {/* Rotas Públicas */}
          <Route index element={<HomePage />} />
          <Route path="torneios" element={<TorneiosPublicosPage />} />
          <Route
            path="torneio/:torneioId"
            element={<TorneioPublicoDetailPage />}
          />

          {/* Rotas de Admin (ainda protegidas individualmente) */}
          <Route
            path="admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/torneio/:torneioId"
            element={
              <ProtectedRoute>
                <TournamentDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/torneio/:torneioId/playoffs"
            element={
              <ProtectedRoute>
                <PlayoffsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="live/:torneioId"
            element={
              <ProtectedRoute>
                <MesaControlePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* A página de Login fica de fora do Layout principal pois não deve ter o sidebar */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
