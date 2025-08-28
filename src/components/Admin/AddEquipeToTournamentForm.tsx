import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { addEquipeToTorneio, fetchTorneioComEquipes } from "../../store/slices";

// Importando componentes do MUI para formulários
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Stack,
} from "@mui/material";

interface Props {
  torneioId: string;
}

const AddEquipeToTournamentForm: React.FC<Props> = ({ torneioId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedEquipeId, setSelectedEquipeId] = useState("");

  // Busca todas as equipes disponíveis
  const { equipes: todasAsEquipes } = useSelector(
    (state: RootState) => state.equipes
  );

  // Busca as equipes que JÁ ESTÃO no torneio atual
  const equipesNoTorneio = useSelector(
    (state: RootState) =>
      state.torneios.selectedTorneioComEquipes?.equipes || []
  );

  // Filtra para mostrar no dropdown apenas as equipes que AINDA NÃO ESTÃO no torneio
  const equipesDisponiveis = useMemo(() => {
    const idsDasEquipesNoTorneio = new Set(equipesNoTorneio.map((e) => e.id));
    return todasAsEquipes.filter((e) => !idsDasEquipesNoTorneio.has(e.id));
  }, [todasAsEquipes, equipesNoTorneio]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEquipeId && torneioId) {
      await dispatch(
        addEquipeToTorneio({ torneioId, equipeId: selectedEquipeId })
      );
      dispatch(fetchTorneioComEquipes(torneioId));
      setSelectedEquipeId("");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Adicionar Equipe ao Torneio
      </Typography>

      {/* Se não houver mais equipes disponíveis, mostra uma mensagem */}
      {equipesDisponiveis.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Todas as equipes já foram adicionadas a este torneio.
        </Typography>
      ) : (
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Componentes MUI para o Select */}
          <FormControl fullWidth size="small">
            <InputLabel id="select-equipe-label">
              Selecione uma equipe disponível
            </InputLabel>
            <Select
              labelId="select-equipe-label"
              value={selectedEquipeId}
              label="Selecione uma equipe disponível"
              onChange={(e) => setSelectedEquipeId(e.target.value)}
            >
              {equipesDisponiveis.map((equipe) => (
                <MenuItem key={equipe.id} value={equipe.id}>
                  {equipe.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            disabled={!selectedEquipeId}
          >
            Adicionar
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default AddEquipeToTournamentForm;
