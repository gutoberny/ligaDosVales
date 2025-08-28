import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTournamentData } from "../hooks/useTournamentData";
import { Box, Typography, Link, Paper, Divider } from "@mui/material";

// Importando os nossos componentes de admin já refatorados
import AddEquipeToTournamentForm from "../components/Admin/AddEquipeToTournamentForm";
import ChavesDisplay from "../components/Admin/ChavesDisplay";
import GerarChaveamento from "../components/Admin/GerarChaveamento";
import GerarPlayoffs from "../components/Admin/GerarPlayoffs";
import GerenciadorDeFase from "../components/Admin/GerenciadorDeFase"; // Importamos o gerenciador de fase diretamente

const TournamentDetailPage = () => {
  const {
    torneioId,
    torneio,
    partidasClassificatorias,
    todasClassificatoriasFinalizadas,
    hasPlayoffs,
  } = useTournamentData();

  if (!torneio) return <p>Carregando...</p>;

  return (
    <Box>
      <Link component={RouterLink} to="/admin">
        ← Voltar ao Painel
      </Link>
      <Typography variant="h3" component="h1" sx={{ my: 2 }}>
        {torneio.nome}
      </Typography>

      {hasPlayoffs && (
        <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: "secondary.light" }}>
          <Typography>
            A fase de Playoffs já foi gerada.
            <Link
              component={RouterLink}
              to={`/admin/torneio/${torneioId}/playoffs`}
              sx={{ ml: 1, fontWeight: "bold" }}
            >
              Ir para a Gestão de Playoffs →
            </Link>
          </Typography>
        </Paper>
      )}

      {/* ETAPA 1: Setup do Torneio */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          1. Configuração de Equipes e Chaves
        </Typography>
        <AddEquipeToTournamentForm torneioId={torneio.id} />
        <Divider sx={{ my: 2 }} />
        <GerarChaveamento torneio={torneio} />
        <Box sx={{ mt: 2 }}>
          <ChavesDisplay />
        </Box>
      </Paper>

      {/* ETAPA 2: Fase Classificatória */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          2. Fase Classificatória
        </Typography>
        <GerenciadorDeFase partidas={partidasClassificatorias} />
      </Paper>

      {/* ETAPA 3: Geração dos Playoffs */}
      {todasClassificatoriasFinalizadas && !hasPlayoffs && (
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <GerarPlayoffs
            torneioId={torneio.id}
            isEnabled={todasClassificatoriasFinalizadas}
          />
        </Paper>
      )}
    </Box>
  );
};

export default TournamentDetailPage;
