import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Partida } from "../../store/slices";
import GerenciadorDeFase from "./GerenciadorDeFase";

interface Props {
  partidas: Partida[];
}

const GerenciadorPartidas: React.FC<Props> = ({ partidas }) => {
  const { status } = useSelector((state: RootState) => state.partidas);

  const partidasPorFase = useMemo(() => {
    return partidas.reduce((acc, partida) => {
      const fase = partida.fase || "Classificatória";
      if (!acc[fase]) acc[fase] = [];
      acc[fase].push(partida);
      return acc;
    }, {} as Record<string, Partida[]>);
  }, [partidas]);

  const fasesOrdenadas = Object.keys(partidasPorFase).sort((a, b) => {
    if (a === "Classificatória") return -1;
    if (b === "Classificatória") return 1;
    return a.localeCompare(b);
  });

  if (status === "loading") return <p>Carregando partidas...</p>;
  if (partidas.length === 0)
    return <p>Nenhum jogo gerado para este torneio.</p>;

  return (
    <div>
      {fasesOrdenadas.map((fase) => (
        <div key={fase} style={{ marginBottom: "2.5rem" }}>
          <h3
            style={{
              backgroundColor: "#e9ecef",
              padding: "10px",
              borderRadius: "5px",
              marginTop: 0,
            }}
          >
            Fase: {fase}
          </h3>
          <GerenciadorDeFase partidas={partidasPorFase[fase]} />
        </div>
      ))}
    </div>
  );
};

export default GerenciadorPartidas;
