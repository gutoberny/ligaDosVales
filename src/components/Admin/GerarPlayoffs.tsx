import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { gerarPlayoffs } from "../../store/slices";
import { Paper, Typography, TextField, Button, Box } from "@mui/material";

interface Props {
  torneioId: string;
  isEnabled: boolean;
}

const GerarPlayoffs: React.FC<Props> = ({ torneioId, isEnabled }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [seriesNomes, setSeriesNomes] = useState("Ouro, Prata, Bronze");

  const handleGerarPlayoffs = () => {
    const nomesDasSeries = seriesNomes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (nomesDasSeries.length === 0) {
      alert("Defina pelo menos um nome para a Série (ex: Ouro).");
      return;
    }
    if (window.confirm(`Gerar playoffs para as séries: ${seriesNomes}?`)) {
      dispatch(gerarPlayoffs({ torneioId, nomesDasSeries }));
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        backgroundColor: isEnabled ? "rgba(255, 215, 0, 0.1)" : "inherit",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Finalizar Fase Classificatória
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Isto irá calcular a classificação e gerar os jogos dos Playoffs.
      </Typography>
      <TextField
        label="Nomes das Séries (separados por vírgula)"
        value={seriesNomes}
        onChange={(e) => setSeriesNomes(e.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />
      <Button
        onClick={handleGerarPlayoffs}
        disabled={!isEnabled}
        variant="contained"
        color="secondary"
      >
        {isEnabled ? "Gerar Playoffs" : "Aguardando final de todos os jogos"}
      </Button>
    </Paper>
  );
};

export default GerarPlayoffs;
