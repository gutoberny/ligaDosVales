import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { RootState, AppDispatch } from "../store/store";
import { fetchTorneios } from "../store/slices";

import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
} from "@mui/material";

// Componente reutilizável para a tabela de classificação
const TabelaClassificacao = ({
  titulo,
  dados,
  corHeader,
}: {
  titulo: string;
  dados: any[];
  corHeader: string;
}) => (
  <Paper elevation={3} sx={{ p: 2 }}>
    <Typography variant="h4" component="h2" gutterBottom align="center">
      {titulo}
    </Typography>
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: corHeader }}>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Posição
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Equipes / Cidade
            </TableCell>
            <TableCell
              align="right"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Pontuação
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dados.map((item) => (
            <TableRow
              key={item.pos}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <strong>{item.pos}º</strong>
              </TableCell>
              <TableCell>{item.nome}</TableCell>
              <TableCell align="right">
                <strong>{item.pontos}</strong>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.torneios);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTorneios());
    }
  }, [status, dispatch]);

  // --- DADOS DE EXEMPLO ATUALIZADOS COM A LISTA COMPLETA ---
  const classificacaoFeminino = [
    { pos: 1, nome: "GALÁTICAS - SANTA CRUZ DO SUL", pontos: 104 },
    {
      pos: 2,
      nome: "MAUÁ / NOSSO VÔLEI SUB 19 - SANTA CRUZ DO SUL",
      pontos: 92,
    },
    { pos: 3, nome: "PRÓ-VÔLEI - SANTA CRUZ DO SUL", pontos: 76 },
    { pos: 4, nome: "INVASORAS - SANTA CRUZ DO SUL", pontos: 68 },
    { pos: 5, nome: "LEGACIE - CAXIAS DO SUL", pontos: 63 },
    { pos: 6, nome: "REALITY SPORTS - ARROIO DO TIGRE", pontos: 52 },
    { pos: 7, nome: "EGV - SANTA CRUZ DO SUL", pontos: 50 },
    { pos: 8, nome: "AS PATROAS - TAQUARI", pontos: 24 },
    { pos: 9, nome: "DOIS TOQUE - SANTA CRUZ DO SUL", pontos: 22 },
    { pos: 10, nome: "VÔLEI CERRO BRANCO - CERRO BRANCO", pontos: 15 },
    { pos: 11, nome: "SRB - CACHOEIRA DO SUL", pontos: 12 },
  ];

  const classificacaoMasculino = [
    { pos: 1, nome: "AVV - SANTA CRUZ DO SUL", pontos: 90 },
    { pos: 2, nome: "GALÁTICOS - SANTA CRUZ DO SUL", pontos: 77 },
    { pos: 3, nome: "VOLEIROS - SANTA CRUZ DO SUL", pontos: 62 },
    { pos: 4, nome: "NOSSO VÔLEI MAUÁ - SANTA CRUZ DO SUL", pontos: 50 },
    { pos: 5, nome: "ARV - LAJEADO", pontos: 36 },
    { pos: 6, nome: "GREEN VOLLEY - PORTO ALEGRE", pontos: 30 },
    { pos: 7, nome: "SELEÇÃO GAÚCHA SUB 18 - RS", pontos: 30 },
    { pos: 8, nome: "INVASORAS - SANTA CRUZ DO SUL", pontos: 30 },
    { pos: 9, nome: "OS NÁUFRAGOS - SANTA CRUZ DO SUL", pontos: 27 },
    {
      pos: 10,
      nome: "MAUÁ / NOSSO VÔLEI SUB 19 - SANTA CRUZ DO SUL",
      pontos: 22,
    },
    { pos: 11, nome: "CEAT SUB 16 - LAJEADO", pontos: 20 },
    { pos: 12, nome: "VÔLEI C.B. - CERRO BRANCO", pontos: 20 },
    { pos: 13, nome: "CEAT SUB 19 - LAJEADO", pontos: 18 },
    { pos: 14, nome: "VÔLEI SANTA CRUZ - SANTA CRUZ DO SUL", pontos: 17 },
    { pos: 15, nome: "EVOLEITION - SANTA MARIA", pontos: 17 },
    { pos: 16, nome: "BBB - SANTA MARIA", pontos: 15 },
    { pos: 17, nome: "LIRVOBOL - RESTINGA SECA", pontos: 10 },
    { pos: 18, nome: "MAMBA NEGRA - CACHOEIRA DO SUL", pontos: 10 },
    { pos: 19, nome: "100 LIMITES - TAQUARI", pontos: 5 },
  ];

  if (status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: "center" }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          CLASSIFICAÇÃO GERAL 2025
        </Typography>
        <Typography variant="h4" component="h2" color="primary.main">
          LIGA DOS VALES DE VOLEIBOL 2025
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <TabelaClassificacao
            titulo="FEMININO"
            dados={classificacaoFeminino}
            corHeader="#333"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TabelaClassificacao
            titulo="MASCULINO"
            dados={classificacaoMasculino}
            corHeader="#333"
          />
        </Grid>
      </Grid>

      <Box sx={{ my: 4, textAlign: "center" }}>
        <Button
          component={RouterLink}
          to="/torneios"
          variant="contained"
          color="secondary"
          size="large"
        >
          Ver Detalhes de Todos os Torneios
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
