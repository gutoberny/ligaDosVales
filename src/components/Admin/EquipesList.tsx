import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
} from "@mui/material";

const EquipesList = () => {
  const { equipes } = useSelector((state: RootState) => state.equipes);

  return (
    <TableContainer component={Paper} elevation={2}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "80px" }}>Logo</TableCell>
            <TableCell>Nome da Equipe</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {equipes.map((equipe) => (
            <TableRow key={equipe.id}>
              <TableCell>
                <Avatar src={equipe.logo_url || undefined} alt={equipe.nome}>
                  {equipe.nome.charAt(0)}
                </Avatar>
              </TableCell>
              <TableCell>
                <Typography variant="body1">{equipe.nome}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default EquipesList;
