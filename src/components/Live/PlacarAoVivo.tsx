import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Partida, updatePartida } from "../../store/slices";

// Importando componentes e ícones do Material-UI
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  IconButton,
  Chip,
  Stack,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ReplayIcon from "@mui/icons-material/Replay";
import EditIcon from "@mui/icons-material/Edit";

interface Props {
  partida: Partida;
}

const PlacarAoVivo: React.FC<Props> = ({ partida }) => {
  const dispatch = useDispatch<AppDispatch>();

  // O código dos hooks e das funções handle continua exatamente igual
  const [sets, setSets] = useState(partida.placar_sets || []);
  const [pontosA, setPontosA] = useState(0);
  const [pontosB, setPontosB] = useState(0);
  const [setsVencidosA, setSetsVencidosA] = useState(
    partida.pontos_equipe_a || 0
  );
  const [setsVencidosB, setSetsVencidosB] = useState(
    partida.pontos_equipe_b || 0
  );
  const [isLocallyFinalizada, setIsLocallyFinalizada] = useState(
    partida.status === "Finalizado"
  );

  useEffect(() => {
    setSets(partida.placar_sets || []);
    setSetsVencidosA(partida.pontos_equipe_a || 0);
    setSetsVencidosB(partida.pontos_equipe_b || 0);
    setIsLocallyFinalizada(partida.status === "Finalizado");
  }, [partida]);

  const handleSalvarPlacar = (finalizarPartida = false) => {
    /* ... (código existente) ... */
  };
  const handleReabrirPartida = () => {
    /* ... (código existente) ... */
  };
  const handleCorrigirUltimoSet = () => {
    /* ... (código existente) ... */
  };

  return (
    <Card
      elevation={4}
      sx={{
        borderColor: isLocallyFinalizada ? "grey.400" : "green",
        borderWidth: 2,
        borderStyle: "solid",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h5" component="h3">
            {partida.equipe_a.nome} vs {partida.equipe_b.nome}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {!isLocallyFinalizada ? (
          <>
            {/* --- BLOCO DO PLACAR DE EDIÇÃO (MOVIDO PARA CIMA) --- */}
            <Grid container spacing={2} textAlign="center">
              {/* Placar Equipe A */}
              <Grid item xs={6}>
                <Typography variant="h6">
                  {partida.equipe_a.nome} ({setsVencidosA} sets)
                </Typography>
                <Typography
                  variant="h2"
                  sx={{ my: 1, color: "primary.main", fontWeight: "bold" }}
                >
                  {pontosA}
                </Typography>
                <IconButton
                  onClick={() => setPontosA((p) => p + 1)}
                  color="primary"
                >
                  <AddCircleOutlineIcon fontSize="large" />
                </IconButton>
                <IconButton
                  onClick={() => setPontosA((p) => Math.max(0, p - 1))}
                >
                  <RemoveCircleOutlineIcon fontSize="large" />
                </IconButton>
              </Grid>
              {/* Placar Equipe B */}
              <Grid item xs={6}>
                <Typography variant="h6">
                  {partida.equipe_b.nome} ({setsVencidosB} sets)
                </Typography>
                <Typography
                  variant="h2"
                  sx={{ my: 1, color: "primary.main", fontWeight: "bold" }}
                >
                  {pontosB}
                </Typography>
                <IconButton
                  onClick={() => setPontosB((p) => p + 1)}
                  color="primary"
                >
                  <AddCircleOutlineIcon fontSize="large" />
                </IconButton>
                <IconButton
                  onClick={() => setPontosB((p) => Math.max(0, p - 1))}
                >
                  <RemoveCircleOutlineIcon fontSize="large" />
                </IconButton>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Placar de Sets (agora fica em baixo) */}
            <Box sx={{ textAlign: "center", my: 2 }}>
              <Typography variant="h5" component="div">
                Sets: {setsVencidosA} - {setsVencidosB}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {sets
                  .map((set, index) => `Set ${index + 1}: ${set.a}-${set.b}`)
                  .join(" | ")}
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                onClick={() => handleSalvarPlacar(false)}
                variant="contained"
                fullWidth
              >
                Finalizar e Salvar Set
              </Button>
              <Button
                onClick={handleCorrigirUltimoSet}
                variant="outlined"
                color="secondary"
                startIcon={<EditIcon />}
                fullWidth
              >
                Corrigir Último Set
              </Button>
              <Button
                onClick={() => handleSalvarPlacar(true)}
                variant="contained"
                color="error"
                fullWidth
              >
                Finalizar Partida
              </Button>
            </Stack>
          </>
        ) : (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            {/* Visualização da partida finalizada (com o placar de sets em destaque) */}
            <Typography variant="h4">Placar Final</Typography>
            <Typography variant="h2" sx={{ my: 2 }}>
              {setsVencidosA} - {setsVencidosB}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {sets
                .map((set, index) => `Set ${index + 1}: ${set.a}-${set.b}`)
                .join(" | ")}
            </Typography>
            <Chip label="Partida Finalizada" color="error" sx={{ mb: 2 }} />
            <Button
              onClick={handleReabrirPartida}
              variant="contained"
              startIcon={<ReplayIcon />}
              fullWidth
            >
              Reabrir Partida para Edição
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PlacarAoVivo;
