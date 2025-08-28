import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import {
  fetchTorneioComEquipes,
  fetchPartidasPorTorneio,
} from "../store/slices";

export const useTournamentData = () => {
  const { torneioId } = useParams<{ torneioId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const torneio = useSelector(
    (state: RootState) => state.torneios.selectedTorneioComEquipes
  );
  const { partidas } = useSelector((state: RootState) => state.partidas);

  useEffect(() => {
    if (torneioId) {
      dispatch(fetchTorneioComEquipes(torneioId));
      dispatch(fetchPartidasPorTorneio(torneioId));
    }
  }, [torneioId, dispatch]);

  const partidasClassificatorias = useMemo(
    () => partidas.filter((p) => p.fase === "Classificatória"),
    [partidas]
  );

  const todasClassificatoriasFinalizadas = useMemo(
    () =>
      partidasClassificatorias.length > 0 &&
      partidasClassificatorias.every((p) => p.status === "Finalizado"),
    [partidasClassificatorias]
  );

  const hasPlayoffs = useMemo(
    () => partidas.some((p) => p.fase !== "Classificatória"),
    [partidas]
  );

  return {
    torneioId,
    torneio,
    partidas,
    partidasClassificatorias,
    todasClassificatoriasFinalizadas,
    hasPlayoffs,
    dispatch, // Exportamos o dispatch para que os componentes possam disparar ações
  };
};
