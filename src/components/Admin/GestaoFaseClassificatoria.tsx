import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { gerarPartidasDoTorneio, Partida } from "../../store/slices";
import GerenciadorPartidas from "./GerenciadorPartidas";

interface Props {
  torneioId: string;
  partidasClassificatorias: Partida[];
}

const GestaoFaseClassificatoria: React.FC<Props> = ({
  torneioId,
  partidasClassificatorias,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleGerarConfrontos = () => {
    if (
      window.confirm(
        "Tem a certeza? Isto irá apagar e gerar novamente os confrontos classificatórios."
      )
    ) {
      dispatch(gerarPartidasDoTorneio(torneioId));
    }
  };

  return (
    <section>
      <h2>Gestão de Partidas - Fase Classificatória</h2>
      {partidasClassificatorias.length === 0 ? (
        <button
          onClick={handleGerarConfrontos}
          style={{ marginBottom: "1rem" }}
        >
          Gerar Confrontos Classificatórios
        </button>
      ) : (
        <GerenciadorPartidas partidas={partidasClassificatorias} />
      )}
    </section>
  );
};

export default GestaoFaseClassificatoria;
