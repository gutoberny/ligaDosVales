import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Partida, updatePartida } from "../../store/slices";
import PartidaNaoAgendadaItem from "./PartidaNaoAgendadaItem";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid, // <-- 1. IMPORT FALTANTE ADICIONADO
  Stack, // <-- 1. IMPORT FALTANTE ADICIONADO
} from "@mui/material";

interface Props {
  partidas: Partida[];
}

const GerenciadorDeFase: React.FC<Props> = ({ partidas }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { partidasAgendadas, partidasNaoAgendadas } = useMemo(() => {
    const agendadas = partidas
      .filter((p) => p.ordem !== null)
      .sort((a, b) => {
        if (a.quadra !== b.quadra) return a.quadra! - b.quadra!;
        return a.ordem! - b.ordem!;
      });
    const naoAgendadas = partidas.filter((p) => p.ordem === null);
    return { partidasAgendadas: agendadas, partidasNaoAgendadas: naoAgendadas };
  }, [partidas]);

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
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Partidas a Agendar ({partidasNaoAgendadas.length})
        </Typography>
        <Stack spacing={1}>
          {partidasNaoAgendadas.map((partida) => (
            <PartidaNaoAgendadaItem key={partida.id} partida={partida} />
          ))}
        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
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
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* --- 2. TIPO EXPLÍCITO ADICIONADO A 'p' --- */}
              {partidasAgendadas.map((p: Partida) => (
                <TableRow key={p.id}>
                  <TableCell>{p.ordem}</TableCell>
                  <TableCell>{p.quadra}</TableCell>
                  <TableCell>
                    {p.equipe_a.nome} vs {p.equipe_b.nome}
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleDesagendar(p)}>
                      Desagendar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default GerenciadorDeFase;
