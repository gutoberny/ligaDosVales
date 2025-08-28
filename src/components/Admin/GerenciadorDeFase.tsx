import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Partida, updatePartida } from "../../store/slices";
import PartidaNaoAgendadaItem from "./PartidaNaoAgendadaItem";
import {
  Grid,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

interface Props {
  partidas: Partida[];
}

const GerenciadorDeFase: React.FC<Props> = ({ partidas }) => {
  const dispatch = useDispatch<AppDispatch>();

  // 1. Guardamos o resultado do useMemo numa única constante.
  const memorizedData = useMemo(() => {
    const agendadas = partidas
      .filter((p) => p.ordem !== null)
      .sort((a, b) => {
        if (a.quadra !== b.quadra) return a.quadra! - b.quadra!;
        return a.ordem! - b.ordem!;
      });
    const naoAgendadas = partidas.filter((p) => p.ordem === null);
    return { partidasAgendadas: agendadas, partidasNaoAgendadas: naoAgendadas };
  }, [partidas]);

  // 2. Agora, desestruturamos a partir da constante já calculada.
  const { partidasAgendadas, partidasNaoAgendadas } = memorizedData;

  const handleDesagendar = (partida: Partida) => {
    if (window.confirm("Tem a certeza que deseja desagendar esta partida?")) {
      dispatch(
        updatePartida({
          partidaId: partida.id,
          ordem: null,
          quadra: null,
          data_hora_jogo: null,
        })
      );
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} lg={6}>
        <Typography variant="h6" gutterBottom>
          Partidas a Agendar ({partidasNaoAgendadas.length})
        </Typography>
        <Stack spacing={1}>
          {partidasNaoAgendadas.map((partida) => (
            <PartidaNaoAgendadaItem key={partida.id} partida={partida} />
          ))}
          {partidasNaoAgendadas.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Todas as partidas desta fase já foram agendadas.
            </Typography>
          )}
        </Stack>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Typography variant="h6" gutterBottom>
          Partidas Agendadas ({partidasAgendadas.length})
        </Typography>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Ordem</TableCell>
                <TableCell>Quadra</TableCell>
                <TableCell>Confronto</TableCell>
                <TableCell>Horário</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {partidasAgendadas.map(
                (
                  p: Partida // Adicionar o tipo aqui também é uma boa prática
                ) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.ordem}</TableCell>
                    <TableCell>{p.quadra}</TableCell>
                    <TableCell>
                      {p.equipe_a.nome} vs {p.equipe_b.nome}
                    </TableCell>
                    <TableCell>
                      {p.data_hora_jogo
                        ? new Date(p.data_hora_jogo).toLocaleString("pt-BR", {
                            timeZone: "America/Sao_Paulo",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => handleDesagendar(p)}>
                        Desagendar
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default GerenciadorDeFase;
