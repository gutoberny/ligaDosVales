import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { fetchTorneios, fetchEquipes, fetchAtletas } from "../store/slices";

// Importando componentes do MUI para o layout
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Importando os nossos componentes de admin já refatorados
import AddAtletaForm from "../components/Admin/AddAtletaForm";
import AtletasList from "../components/Admin/AtletasList";
import AddEquipeForm from "../components/Admin/AddEquipeForm";
import EquipesList from "../components/Admin/EquipesList";
import AddTournamentForm from "../components/Admin/AddTournamentForm";
import TournamentList from "../components/Admin/TournamentList";

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTorneios());
    dispatch(fetchEquipes());
    dispatch(fetchAtletas());
  }, [dispatch]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" component="h1" sx={{ my: 4 }}>
        Painel do Administrador
      </Typography>

      {/* Accordion para Torneios */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Gestão de Torneios</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AddTournamentForm />
          <TournamentList />
        </AccordionDetails>
      </Accordion>

      {/* Accordion para Equipes */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Gestão de Equipes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AddEquipeForm />
          <EquipesList />
        </AccordionDetails>
      </Accordion>

      {/* Accordion para Atletas */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Gestão de Atletas</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AddAtletaForm />
          <AtletasList />
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default AdminDashboard;
