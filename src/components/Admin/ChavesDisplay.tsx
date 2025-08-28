import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { EquipeNoTorneio } from "../../store/slices";

// Importando componentes do MUI
import {
  Box,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";

const ChavesDisplay = () => {
  const { selectedTorneioComEquipes: torneio } = useSelector(
    (state: RootState) => state.torneios
  );

  const chaves = React.useMemo(() => {
    if (!torneio || torneio.equipes.length === 0) return {};
    return torneio.equipes.reduce((acc, equipe) => {
      // Usamos 'string' como tipo da chave do Record para maior segurança
      const chaveStr = String(equipe.chave || "0");
      if (!acc[chaveStr]) acc[chaveStr] = [];
      acc[chaveStr].push(equipe);
      return acc;
    }, {} as Record<string, EquipeNoTorneio[]>);
  }, [torneio]);

  // --- CORREÇÃO APLICADA AQUI ---
  // Trocamos a ordenação numérica por uma ordenação alfabética (localeCompare)
  const chavesOrdenadas = Object.entries(chaves).sort(([chaveA], [chaveB]) =>
    chaveA.localeCompare(chaveB)
  );

  if (chavesOrdenadas.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Chaveamento do Torneio
      </Typography>

      <Grid container spacing={2}>
        {chavesOrdenadas.map(([chaveNum, equipesNaChave]) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={chaveNum}>
            <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
              <Typography
                variant="h6"
                component="h4"
                color="primary.main"
                gutterBottom
              >
                {chaveNum === "0" ? "Equipes Sem Chave" : `Chave ${chaveNum}`}
              </Typography>
              <List dense>
                {equipesNaChave.map((equipe) => (
                  <ListItem key={equipe.id}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <ShieldIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={equipe.nome} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ChavesDisplay;
