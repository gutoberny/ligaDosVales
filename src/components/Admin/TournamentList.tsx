import React from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { RootState } from "../../store/store";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Button,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const TournamentList = () => {
  const { torneios, status } = useSelector(
    (state: RootState) => state.torneios
  );

  if (status === "loading") return <p>Carregando torneios...</p>;

  return (
    <TableContainer component={Paper} elevation={2}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome do Torneio</TableCell>
            <TableCell>Temporada</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {torneios.map((torneio) => (
            <TableRow key={torneio.id}>
              <TableCell>
                <Link
                  component={RouterLink}
                  to={`/admin/torneio/${torneio.id}`}
                  fontWeight="bold"
                >
                  {torneio.nome}
                </Link>
              </TableCell>
              <TableCell>{torneio.temporada}</TableCell>
              <TableCell align="right">
                <Box
                  sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                >
                  <Button
                    component={RouterLink}
                    to={`/admin/torneio/${torneio.id}`}
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                  >
                    Gerir
                  </Button>
                  <Button
                    component={RouterLink}
                    to={`/live/${torneio.id}`}
                    size="small"
                    variant="contained"
                    color="secondary"
                  >
                    Operar Ao Vivo
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TournamentList;
