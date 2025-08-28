import React, { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  fetchPartidasPorTorneio,
  fetchTorneioComEquipes,
  Partida,
} from "../store/slices";
import GerenciadorSeriePlayoff from "../components/Admin/GerenciadorSeriePlayoff";

const PlayoffsPage = () => {
  const { torneioId } = useParams<{ torneioId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { partidas } = useSelector((state: RootState) => state.partidas);
  const torneio = useSelector(
    (state: RootState) => state.torneios.selectedTorneioComEquipes
  );

  useEffect(() => {
    if (torneioId) {
      dispatch(fetchTorneioComEquipes(torneioId));
      dispatch(fetchPartidasPorTorneio(torneioId));
    }
  }, [torneioId, dispatch]);

  // Agrupa todas as partidas de playoff pela sua série (Ouro, Prata, etc.)
  const partidasPorSerie = useMemo(() => {
    const playoffs = partidas.filter((p) => p.fase !== "Classificatória");
    return playoffs.reduce((acc, partida) => {
      const nomeDaSerie = partida.fase.split(" - ")[0]; // Extrai 'Ouro' de 'Ouro - Semifinal'
      if (!acc[nomeDaSerie]) acc[nomeDaSerie] = [];
      acc[nomeDaSerie].push(partida);
      return acc;
    }, {} as Record<string, Partida[]>);
  }, [partidas]);

  return (
    <div style={{ padding: "2rem" }}>
      <Link to={`/admin/torneio/${torneioId}`}>
        ← Voltar aos Detalhes do Torneio
      </Link>
      <h1>Playoffs - {torneio?.nome}</h1>
      <p>Organize e agende as partidas das séries finais.</p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          marginTop: "2rem",
        }}
      >
        {Object.entries(partidasPorSerie).map(
          ([nomeDaSerie, partidasDaSerie]) => (
            <GerenciadorSeriePlayoff
              key={nomeDaSerie}
              torneioId={torneioId!}
              nomeDaSerie={nomeDaSerie}
              partidasDaSerie={partidasDaSerie}
            />
          )
        )}
      </div>
    </div>
  );
};

export default PlayoffsPage;
