import React from "react";
import { Partida } from "../../store/slices";
import { Paper, Box, Typography, Divider } from "@mui/material";

interface Props {
  partidas: Partida[];
}

const PartidasGrupoList: React.FC<Props> = ({ partidas }) => {
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      {partidas.map((partida, index) => (
        <React.Fragment key={partida.id}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1,
            }}
          >
            <Typography sx={{ flex: 1, textAlign: "right" }}>
              {partida.equipe_a.nome}
            </Typography>
            <Box sx={{ mx: 2, textAlign: "center" }}>
              <Typography variant="h6" component="div">
                {partida.pontos_equipe_a} x {partida.pontos_equipe_b}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {partida.status}
              </Typography>
            </Box>
            <Typography sx={{ flex: 1, textAlign: "left" }}>
              {partida.equipe_b.nome}
            </Typography>
          </Box>
          {index < partidas.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Paper>
  );
};

export default PartidasGrupoList;
