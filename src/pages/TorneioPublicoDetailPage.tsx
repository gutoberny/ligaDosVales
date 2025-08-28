import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  fetchTorneioComEquipes,
  fetchPartidasPorTorneio,
  Partida,
  Equipe,
} from "../store/slices";

// Importando componentes do MUI
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  CircularProgress,
} from "@mui/material";

// Importando os componentes PÚBLICOS que esta página utiliza
import ClassificacaoGrupo from "../components/Public/ClassificacaoGrupo";
import PartidasGrupoList from "../components/Public/PartidasGrupoList";

// Definindo o tipo da estrutura que vamos usar para organizar os dados
type DadosDoGrupo = {
  equipes: Equipe[];
  partidas: Partida[];
};

const TorneioPublicoDetailPage = () => {
  const { torneioId } = useParams<{ torneioId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [abaSelecionada, setAbaSelecionada] = useState(0);

  // Seleciona os dados necessários do Redux
  const { selectedTorneioComEquipes: torneio, status: torneioStatus } =
    useSelector((state: RootState) => state.torneios);
  const { partidas, status: partidasStatus } = useSelector(
    (state: RootState) => state.partidas
  );

  // Efeito para buscar os dados quando a página carrega
  useEffect(() => {
    if (torneioId) {
      // Disparamos ambas as buscas para ter todos os dados necessários
      dispatch(fetchTorneioComEquipes(torneioId));
      dispatch(fetchPartidasPorTorneio(torneioId));
    }
  }, [torneioId, dispatch]);

  // Lógica para agrupar todas as partidas e equipes por fase e por grupo
  const dadosPorFase = useMemo(() => {
    if (!torneio || !partidas) return {};

    // 1. Agrupa todas as partidas pela sua fase (Classificatória, Ouro - Semifinal, etc.)
    const partidasAgrupadasPorFase = partidas.reduce((acc, partida) => {
      const fase = partida.fase || "Classificatória";
      if (!acc[fase]) acc[fase] = [];
      acc[fase].push(partida);
      return acc;
    }, {} as Record<string, Partida[]>);

    const resultadoFinal: Record<string, Record<string, DadosDoGrupo>> = {};

    // 2. Itera sobre cada fase para organizar os grupos internos
    for (const fase in partidasAgrupadasPorFase) {
      resultadoFinal[fase] = {};
      const partidasDaFase = partidasAgrupadasPorFase[fase];

      if (fase === "Classificatória") {
        // Para a fase classificatória, os grupos são as chaves
        partidasDaFase.forEach((partida) => {
          const chaveNum = String(partida.chave || 0);
          if (!resultadoFinal[fase][chaveNum]) {
            const equipesDaChave = torneio.equipes.filter(
              (e) => e.chave === Number(chaveNum)
            );
            resultadoFinal[fase][chaveNum] = {
              equipes: equipesDaChave,
              partidas: [],
            };
          }
          resultadoFinal[fase][chaveNum].partidas.push(partida);
        });
      } else {
        // Para os playoffs, a própria fase é o grupo
        const equipesDaFase = new Map<string, Equipe>();
        partidasDaFase.forEach((p) => {
          if (p.equipe_a) equipesDaFase.set(p.equipe_a.id, p.equipe_a);
          if (p.equipe_b) equipesDaFase.set(p.equipe_b.id, p.equipe_b);
        });
        resultadoFinal[fase][fase] = {
          equipes: Array.from(equipesDaFase.values()),
          partidas: partidasDaFase,
        };
      }
    }
    return resultadoFinal;
  }, [torneio, partidas]);

  // Lógica para ordenar as abas na ordem correta
  const fasesOrdenadas = useMemo(() => {
    const orderMap: Record<string, number> = {
      Classificatória: 1,
      "Bronze - Semifinal": 2,
      "Prata - Semifinal": 3,
      "Ouro - Semifinal": 4,
      "Bronze - Disputa 3º Lugar": 5,
      "Bronze - Final": 6,
      "Prata - Disputa 3º Lugar": 7,
      "Prata - Final": 8,
      "Ouro - Disputa 3º Lugar": 9,
      "Ouro - Final": 10,
    };
    return Object.keys(dadosPorFase).sort(
      (a, b) => (orderMap[a] || 99) - (orderMap[b] || 99)
    );
  }, [dadosPorFase]);

  if (torneioStatus === "loading" || partidasStatus === "loading" || !torneio) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setAbaSelecionada(newValue);
  };

  const faseAtual = fasesOrdenadas[abaSelecionada];
  const gruposDaFase = dadosPorFase[faseAtual] || {};

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1">
        {torneio.nome}
      </Typography>
      <Typography
        variant="h5"
        component="h2"
        color="text.secondary"
        gutterBottom
      >
        Temporada: {torneio.temporada}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", my: 3 }}>
        <Tabs
          value={abaSelecionada}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {fasesOrdenadas.map((fase) => (
            <Tab label={fase} key={fase} />
          ))}
        </Tabs>
      </Box>

      {Object.keys(gruposDaFase).length > 0 ? (
        Object.entries(gruposDaFase).map(([nomeDoGrupo, dados]) => (
          <Box key={nomeDoGrupo} sx={{ mb: 5 }}>
            <Typography variant="h4" component="h3" gutterBottom>
              {faseAtual === "Classificatória"
                ? `Chave ${nomeDoGrupo}`
                : nomeDoGrupo}
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} lg={7}>
                <Typography variant="h6" gutterBottom>
                  Classificação
                </Typography>
                <ClassificacaoGrupo
                  equipesDoGrupo={dados.equipes}
                  partidasDoGrupo={dados.partidas}
                />
              </Grid>
              <Grid item xs={12} lg={5}>
                <Typography variant="h6" gutterBottom>
                  Partidas
                </Typography>
                <PartidasGrupoList partidas={dados.partidas} />
              </Grid>
            </Grid>
          </Box>
        ))
      ) : (
        <Typography>Nenhuma partida encontrada para esta fase.</Typography>
      )}
    </Container>
  );
};

export default TorneioPublicoDetailPage;
