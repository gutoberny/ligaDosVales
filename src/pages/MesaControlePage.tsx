import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchPartidasPorTorneio, Partida } from "../store/slices";
import PlacarAoVivo from "../components/Live/PlacarAoVivo";

// Importando componentes e ÍCONES do MUI
import {
  Container,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Breadcrumbs,
  Link,
  Chip,
  Stack,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

// Função auxiliar para obter um ícone com base no status da partida
const getStatusIcon = (status: string) => {
  switch (status) {
    case "Em Andamento":
      return <PlayCircleIcon color="success" />;
    case "Finalizado":
      return <CheckCircleIcon color="error" />;
    case "Agendado":
    default:
      return <ScheduleIcon color="action" />;
  }
};

const MesaControlePage = () => {
  const { torneioId } = useParams<{ torneioId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  // Estados para controlar o nível de navegação
  const [faseSelecionada, setFaseSelecionada] = useState<string | null>(null);
  const [partidaSelecionada, setPartidaSelecionada] = useState<Partida | null>(
    null
  );

  const { partidas } = useSelector((state: RootState) => state.partidas);
  const torneio = useSelector(
    (state: RootState) => state.torneios.selectedTorneioComEquipes
  );

  useEffect(() => {
    if (torneioId) {
      dispatch(fetchPartidasPorTorneio(torneioId));
    }
  }, [torneioId, dispatch]);

  // Sincroniza a partida selecionada se a lista geral for atualizada
  useEffect(() => {
    if (partidaSelecionada) {
      const partidaAtualizada = partidas.find(
        (p) => p.id === partidaSelecionada.id
      );
      if (partidaAtualizada) {
        setPartidaSelecionada(partidaAtualizada);
      }
    }
  }, [partidas, partidaSelecionada]);

  // Agrupa as partidas por fase
  const partidasPorFase = useMemo(() => {
    return partidas.reduce((acc, partida) => {
      const fase = partida.fase || "Classificatória";
      if (!acc[fase]) {
        acc[fase] = [];
      }
      acc[fase].push(partida);
      return acc;
    }, {} as Record<string, Partida[]>);
  }, [partidas]);

  // Ordena as fases com base na prioridade definida
  const fasesOrdenadas = useMemo(() => {
    const orderMap: Record<string, number> = {
      Classificatória: 1,
      "Bronze - Semifinal": 2,
      "Prata - Semifinal": 3,
      "Ouro - Semifinal": 4,
      "Bronze - Disputa 3º Lugar": 5,
      "Bronze - Final": 6,
      "Prata - Disputa 3º Lugar": 7,
      "Prata - Final": 8,
      "Ouro - Disputa 3º Lugar": 9,
      "Ouro - Final": 10,
    };

    return Object.keys(partidasPorFase).sort((a, b) => {
      const rankA = orderMap[a] || 99;
      const rankB = orderMap[b] || 99;
      return rankA - rankB;
    });
  }, [partidasPorFase]);

  const renderContent = () => {
    // --- NÍVEL 3: VISUALIZAÇÃO DO PLACAR AO VIVO ---
    if (partidaSelecionada) {
      return <PlacarAoVivo partida={partidaSelecionada} />;
    }

    // --- NÍVEL 2: VISUALIZAÇÃO DAS PARTIDAS DE UMA FASE ---
    if (faseSelecionada) {
      const partidasDaFase = partidasPorFase[faseSelecionada];
      return (
        <Stack spacing={1}>
          {partidasDaFase.map((partida) => (
            <Paper
              key={partida.id}
              variant="outlined"
              sx={{ "&:hover": { boxShadow: 3, borderColor: "primary.main" } }}
            >
              <ListItemButton
                onClick={() => setPartidaSelecionada(partida)}
                sx={{ p: 2 }}
              >
                <ListItemIcon>{getStatusIcon(partida.status)}</ListItemIcon>
                <ListItemText
                  primary={`${partida.equipe_a.nome} vs ${partida.equipe_b.nome}`}
                  secondary={`Ordem: ${partida.ordem || "-"} | Quadra: ${
                    partida.quadra || "-"
                  }`}
                />
                <Chip
                  label={partida.status}
                  size="small"
                  color={
                    partida.status === "Finalizado"
                      ? "error"
                      : partida.status === "Em Andamento"
                      ? "success"
                      : "default"
                  }
                />
              </ListItemButton>
            </Paper>
          ))}
        </Stack>
      );
    }

    // --- NÍVEL 1: VISUALIZAÇÃO DAS FASES DO TORNEIO ---
    return (
      <Paper elevation={2}>
        <List sx={{ padding: 0 }}>
          {fasesOrdenadas.map((fase, index) => (
            <React.Fragment key={fase}>
              <ListItemButton
                onClick={() => setFaseSelecionada(fase)}
                sx={{ p: 2 }}
              >
                <ListItemIcon>
                  <EmojiEventsIcon color="secondary" />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="h6">{fase}</Typography>}
                  secondary={`${partidasPorFase[fase].length} partidas`}
                />
              </ListItemButton>
              {index < fasesOrdenadas.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mesa de Controle: {torneio?.nome}
        </Typography>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link
            component={RouterLink}
            underline="hover"
            color="inherit"
            to="/admin"
          >
            Painel Admin
          </Link>
          <Link
            underline="hover"
            color="inherit"
            sx={{ cursor: "pointer" }}
            onClick={() => {
              setFaseSelecionada(null);
              setPartidaSelecionada(null);
            }}
          >
            Fases do Torneio
          </Link>
          {faseSelecionada && (
            <Link
              underline="hover"
              color="inherit"
              sx={{ cursor: "pointer" }}
              onClick={() => setPartidaSelecionada(null)}
            >
              {faseSelecionada}
            </Link>
          )}
          {partidaSelecionada && (
            <Typography color="text.primary">
              {partidaSelecionada.equipe_a.nome} vs{" "}
              {partidaSelecionada.equipe_b.nome}
            </Typography>
          )}
        </Breadcrumbs>
      </Box>

      {renderContent()}
    </Container>
  );
};

export default MesaControlePage;
