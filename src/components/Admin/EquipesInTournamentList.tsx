import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { removeEquipeFromTorneio } from "../../store/slices";

// Importando componentes e ícones do MUI
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Paper,
} from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import DeleteIcon from "@mui/icons-material/Delete";

const EquipesInTournamentList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedTorneioComEquipes: torneio } = useSelector(
    (state: RootState) => state.torneios
  );

  if (!torneio) {
    return null; // Não renderiza nada se o torneio não estiver carregado
  }

  // Filtra equipes que ainda não foram designadas para uma chave
  const equipesSemChave = torneio.equipes.filter(
    (e) => e.chave === null || e.chave === 0
  );

  if (equipesSemChave.length === 0 && torneio.equipes.length > 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Todas as equipes foram alocadas em chaves.
      </Typography>
    );
  }

  const handleRemove = (equipeId: string, equipeNome: string) => {
    if (
      window.confirm(
        `Tem a certeza que deseja remover a equipe "${equipeNome}" deste torneio?`
      )
    ) {
      dispatch(removeEquipeFromTorneio({ torneioId: torneio.id, equipeId }));
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Equipes Adicionadas ({torneio.equipes.length})
      </Typography>
      <Paper variant="outlined">
        <List dense>
          {torneio.equipes.map((equipe) => (
            <ListItem
              key={equipe.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleRemove(equipe.id, equipe.nome)}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              }
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <ShieldIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={equipe.nome} />
            </ListItem>
          ))}
          {torneio.equipes.length === 0 && (
            <ListItem>
              <ListItemText primary="Nenhuma equipe neste torneio ainda." />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default EquipesInTournamentList;
