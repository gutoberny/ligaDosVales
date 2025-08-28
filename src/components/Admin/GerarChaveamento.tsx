import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { gerarChaves, TorneioComEquipes } from "../../store/slices";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Box,
} from "@mui/material";

interface Props {
  torneio: TorneioComEquipes;
}

const GerarChaveamento: React.FC<Props> = ({ torneio }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [numChaves, setNumChaves] = useState(2);

  const handleGerarChaves = () => {
    if (torneio.id && numChaves > 0 && torneio.equipes.length > 0) {
      if (
        window.confirm(
          `Sortear ${torneio.equipes.length} equipes em ${numChaves} chaves?`
        )
      ) {
        dispatch(gerarChaves({ torneioId: torneio.id, numChaves }));
      }
    } else {
      alert("Adicione equipes ao torneio antes de gerar as chaves.");
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Gerar Chaveamento
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          label="Número de Chaves/Grupos"
          type="number"
          value={numChaves}
          onChange={(e) => setNumChaves(Number(e.target.value))}
          size="small"
          inputProps={{ min: 1 }}
          sx={{ width: "250px" }}
        />
        <Button onClick={handleGerarChaves} variant="contained">
          Sortear Chaves
        </Button>
      </Stack>
    </Paper>
  );
};

export default GerarChaveamento;
