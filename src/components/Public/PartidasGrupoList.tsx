import React from "react";
import { Partida } from "../../store/slices";
import { Paper, Box, Typography, Divider } from "@mui/material";

interface Props {
  partidas: Partida[];
}

const PartidasGrupoList: React.FC<Props> = ({ partidas }) => {
  // Ordena as partidas pela sua ordem de jogo definida no painel
  const partidasOrdenadas = [...partidas].sort(
    (a, b) => (a.ordem || 999) - (b.ordem || 999)
  );

  return (
    // --- PADDING AJUSTADO AQUI ---
    // Reduzimos o padding geral do container de p: 2 para px: 2, py: 1
    <Paper elevation={2} sx={{ px: 2, py: 1 }}>
      {partidasOrdenadas.map((partida, index) => (
        <React.Fragment key={partida.id}>
          {/* --- E AQUI --- */}
          {/* Reduzimos o padding vertical de py: 1.5 para py: 1 */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1,
            }}
          >
            <Typography
              sx={{
                flex: 1,
                textAlign: "right",
                fontWeight:
                  partida.pontos_equipe_a > partida.pontos_equipe_b
                    ? "bold"
                    : "normal",
              }}
            >
              {partida.equipe_a.nome}
            </Typography>

            <Box sx={{ mx: 2, textAlign: "center" }}>
              <Typography variant="h6" component="div">
                {partida.pontos_equipe_a} x {partida.pontos_equipe_b}
              </Typography>

              {partida.status === "Finalizado" &&
                partida.placar_sets &&
                partida.placar_sets.length > 0 && (
                  <Typography variant="caption" color="text.secondary">
                    (
                    {partida.placar_sets
                      .map((set) => `${set.a}-${set.b}`)
                      .join(", ")}
                    )
                  </Typography>
                )}
            </Box>

            <Typography
              sx={{
                flex: 1,
                textAlign: "left",
                fontWeight:
                  partida.pontos_equipe_b > partida.pontos_equipe_a
                    ? "bold"
                    : "normal",
              }}
            >
              {partida.equipe_b.nome}
            </Typography>
          </Box>
          {index < partidasOrdenadas.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Paper>
  );
};

export default PartidasGrupoList;
