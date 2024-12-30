import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { alpha } from "@mui/material/styles";
import { theme } from "../App";

const teams = [
  { name: "Wilsons A", points: 0 },
  { name: "Wilsons B", points: 0 },
  { name: "Só dois toques", points: 0 },
  { name: "Vôlei Santa Cruz", points: 0 },
  { name: "Evoleition", points: 0 },
  { name: "Galáticos", points: 0 },
  { name: "Vôlei AMF", points: 0 },
  { name: "BBB", points: 0 },
  // Add more teams as needed
];

const matches = [
  { id: 1, home: "WILSONS A", away: "WISONS B" },
  { id: 2, home: "CAM", away: "CAP" },
  { id: 3, home: "FLA", away: "VAS" },
  // Add more matches as needed
];

const Home = () => (
  <Container style={{ marginTop: 80 }}>
    <Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>
      Classificação Geral 2025
    </Typography>
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Paper elevation={3}>
          <TableContainer
            style={{
              borderRadius: 10,
              border: "2px solid ",
              borderColor: theme.palette.secondary.main,
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  style={{ backgroundColor: theme.palette.primary.main }}
                >
                  <TableCell
                    sx={{
                      width: "10%",
                      width: "10%",
                      textAlign: "center",
                      alignContent: "center",
                    }}
                  >
                    Posição
                  </TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell
                    sx={{
                      width: "10%",
                      textAlign: "center",
                      alignContent: "center",
                    }}
                  >
                    Pontos
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teams.map((team, index) => (
                  <TableRow
                    key={index}
                    style={{
                      backgroundColor:
                        index % 2 === 0
                          ? alpha(theme.palette.primary.main, 0.1) // Linha com transparência
                          : "transparent",
                    }}
                  >
                    <TableCell sx={{ textAlign: "center" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell>{team.name}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {team.points}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  </Container>
);

export default Home;
