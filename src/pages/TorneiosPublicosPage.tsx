import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { RootState, AppDispatch } from "../store/store";
import { fetchTorneios, Torneio } from "../store/slices";

// Importando os componentes do Material-UI que vamos usar
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box,
  Chip, // O Chip é ótimo para exibir status
  CircularProgress,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";

// Função auxiliar para determinar o status do torneio
const getTournamentStatus = (
  torneio: Torneio
): { text: string; color: "success" | "error" | "info" } => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataInicio = new Date(torneio.data_inicio);
  // Assumimos que a data_fim pode não existir, então consideramos o torneio de 1 dia.
  const dataFim = torneio.data_fim ? new Date(torneio.data_fim) : dataInicio;

  if (hoje > dataFim) {
    return { text: "Finalizado", color: "error" };
  }
  if (hoje >= dataInicio && hoje <= dataFim) {
    return { text: "Em Andamento", color: "success" };
  }
  return { text: "Próximo", color: "info" };
};

const TorneiosPublicosPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { torneios, status } = useSelector(
    (state: RootState) => state.torneios
  );

  useEffect(() => {
    // Usamos o status para evitar buscas repetidas desnecessárias
    if (status === "idle") {
      dispatch(fetchTorneios());
    }
  }, [status, dispatch]);

  // Ordena os torneios por data, dos mais recentes para os mais antigos
  const torneiosOrdenados = useMemo(() => {
    return [...torneios].sort(
      (a, b) =>
        new Date(b.data_inicio).getTime() - new Date(a.data_inicio).getTime()
    );
  }, [torneios]);

  if (status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Torneios da Temporada
      </Typography>

      {/* Grid responsivo para os cards dos torneios */}
      <Grid container spacing={4}>
        {torneiosOrdenados.map((torneio) => {
          const statusInfo = getTournamentStatus(torneio);
          return (
            // Cada item do grid ocupa a tela inteira em telas pequenas (xs),
            // metade em telas médias (sm), e um terço em telas grandes (md).
            <Grid item key={torneio.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* CardActionArea faz todo o card ser clicável e ter efeitos visuais */}
                <CardActionArea
                  component={RouterLink}
                  to={`/torneio/${torneio.id}`}
                  sx={{ flexGrow: 1 }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="h5" component="h2">
                        {torneio.nome}
                      </Typography>
                      <Chip
                        label={statusInfo.text}
                        color={statusInfo.color}
                        size="small"
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "text.secondary",
                      }}
                    >
                      <EventIcon sx={{ mr: 1, fontSize: "1rem" }} />
                      <Typography variant="body2">
                        {new Date(torneio.data_inicio).toLocaleDateString(
                          "pt-BR",
                          { dateStyle: "long", timeZone: "UTC" }
                        )}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default TorneiosPublicosPage;
