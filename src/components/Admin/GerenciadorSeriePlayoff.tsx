import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Partida, gerarFinais } from "../../store/slices";
import GerenciadorDeFase from "./GerenciadorDeFase";
import { Paper, Typography, Button } from "@mui/material";

interface Props {
  torneioId: string;
  nomeDaSerie: string;
  partidasDaSerie: Partida[];
}

const GerenciadorSeriePlayoff: React.FC<Props> = ({
  torneioId,
  nomeDaSerie,
  partidasDaSerie,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const partidasDaSemifinal = useMemo(
    () =>
      partidasDaSerie.filter((p) => p.fase === `${nomeDaSerie} - Semifinal`),
    [partidasDaSerie, nomeDaSerie]
  );
  const semifinaisFinalizadas = useMemo(
    () =>
      partidasDaSemifinal.length > 0 &&
      partidasDaSemifinal.every((p) => p.status === "Finalizado"),
    [partidasDaSemifinal]
  );
  const hasFinais = useMemo(
    () =>
      partidasDaSerie.some(
        (p) => p.fase.includes("Final") || p.fase.includes("Disputa")
      ),
    [partidasDaSerie]
  );

  const handleGerarFinais = () => {
    dispatch(gerarFinais({ torneioId, nomeDaSerie }));
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h5" color="secondary.main" gutterBottom>
        {nomeDaSerie}
      </Typography>

      {semifinaisFinalizadas && !hasFinais && (
        <Button
          onClick={handleGerarFinais}
          variant="contained"
          color="success"
          sx={{ my: 2 }}
        >
          Gerar Final e 3º Lugar da Série {nomeDaSerie}
        </Button>
      )}

      <GerenciadorDeFase partidas={partidasDaSerie} />
    </Paper>
  );
};

export default GerenciadorSeriePlayoff;
