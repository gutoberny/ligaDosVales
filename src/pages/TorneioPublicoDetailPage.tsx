import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  fetchTorneioComEquipes,
  fetchPartidasPorTorneio,
  Partida,
  Equipe,
  EquipeNoTorneio, // Certifique-se que este tipo é exportado do seu torneiosSlice
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
import ClassificacaoGrupo from "../components/Public/ClassificacaoGrupo";
import PartidasGrupoList from "../components/Public/PartidasGrupoList";

type DadosDoGrupo = {
  equipes: Equipe[];
  partidas: Partida[];
};

const TorneioPublicoDetailPage = () => {
  const { torneioId } = useParams<{ torneioId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [abaSelecionada, setAbaSelecionada] = useState(0);

  const { selectedTorneioComEquipes: torneio, status: torneioStatus } =
    useSelector((state: RootState) => state.torneios);
  const { partidas, status: partidasStatus } = useSelector(
    (state: RootState) => state.partidas
  );

  useEffect(() => {
    if (torneioId) {
      dispatch(fetchTorneioComEquipes(torneioId));
      dispatch(fetchPartidasPorTorneio(torneioId));
    }
  }, [torneioId, dispatch]);

  // --- LÓGICA DE AGRUPAMENTO TOTALMENTE REFEITA ---
  const dadosPorFase = useMemo(() => {
    if (!torneio || !partidas) return {};

    const resultadoFinal: Record<string, Record<string, DadosDoGrupo>> = {};

    // 1. Agrupar equipes por fase e por chave (para a fase Classificatória)
    const equipesPorFaseEChave: Record<string, Record<string, Equipe[]>> = {};
    torneio.equipes.forEach((equipe: EquipeNoTorneio) => {
      const fase = "Classificatória"; // Por enquanto, equipes só pertencem à fase classificatória
      const chave = equipe.chave || "Sem Chave";
      if (!equipesPorFaseEChave[fase]) equipesPorFaseEChave[fase] = {};
      if (!equipesPorFaseEChave[fase][chave])
        equipesPorFaseEChave[fase][chave] = [];
      equipesPorFaseEChave[fase][chave].push(equipe);
    });

    // 2. Agrupar partidas por fase
    const partidasPorFase = partidas.reduce((acc, partida) => {
      const fase = partida.fase || "Classificatória";
      if (!acc[fase]) acc[fase] = [];
      acc[fase].push(partida);
      return acc;
    }, {} as Record<string, Partida[]>);

    // 3. Montar a estrutura final
    const fases = new Set([
      ...Object.keys(equipesPorFaseEChave),
      ...Object.keys(partidasPorFase),
    ]);

    fases.forEach((fase) => {
      resultadoFinal[fase] = {};
      if (fase === "Classificatória") {
        const chavesDaFase = equipesPorFaseEChave[fase] || {};
        for (const chave in chavesDaFase) {
          const partidasDaChave = partidas.filter(
            (p) => p.fase === fase && String(p.chave) === chave
          );
          resultadoFinal[fase][chave] = {
            equipes: chavesDaFase[chave],
            partidas: partidasDaChave,
          };
        }
      } else {
        // Lógica para Playoffs
        const partidasDaFase = partidasPorFase[fase] || [];
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
    });

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

      {Object.entries(gruposDaFase).map(([nomeDoGrupo, dados]) => (
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
      ))}
    </Container>
  );
};

export default TorneioPublicoDetailPage;
