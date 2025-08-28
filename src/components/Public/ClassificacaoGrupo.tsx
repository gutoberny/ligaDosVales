import React, { useMemo } from "react";
import { Equipe, Partida } from "../../store/slices";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
} from "@mui/material";

// Função para definir a cor de fundo da linha com base na posição
const getRowStyle = (position: number) => {
  if (position === 1)
    return {
      backgroundColor: "rgba(255, 215, 0, 0.15)",
      "&:hover": { backgroundColor: "rgba(255, 215, 0, 0.25)" },
    }; // Ouro
  if (position === 2)
    return {
      backgroundColor: "rgba(192, 192, 192, 0.15)",
      "&:hover": { backgroundColor: "rgba(192, 192, 192, 0.25)" },
    }; // Prata
  if (position === 3)
    return {
      backgroundColor: "rgba(205, 127, 50, 0.15)",
      "&:hover": { backgroundColor: "rgba(205, 127, 50, 0.25)" },
    }; // Bronze
  return {};
};

interface Props {
  equipesDoGrupo: Equipe[];
  partidasDoGrupo: Partida[];
}

const ClassificacaoGrupo: React.FC<Props> = ({
  equipesDoGrupo,
  partidasDoGrupo,
}) => {
  const classificacao = useMemo(() => {
    const stats: Record<string, any> = {};

    equipesDoGrupo.forEach((equipe) => {
      stats[equipe.id] = {
        equipe,
        J: 0,
        V: 0,
        D: 0,
        SP: 0,
        SC: 0,
        PP: 0,
        PC: 0,
        Pts: 0,
      };
    });

    partidasDoGrupo
      .filter((p) => p.status === "Finalizado")
      .forEach((partida) => {
        const equipeA = stats[partida.equipe_a.id];
        const equipeB = stats[partida.equipe_b.id];

        if (!equipeA || !equipeB) return;

        const setsA = partida.pontos_equipe_a;
        const setsB = partida.pontos_equipe_b;

        equipeA.J++;
        equipeB.J++;
        equipeA.SP += setsA;
        equipeA.SC += setsB;
        equipeB.SP += setsB;
        equipeB.SC += setsA;

        // Lógica de pontuação de voleibol (considerando melhor de 5 sets)
        if (setsA > setsB) {
          // Equipe A venceu
          equipeA.V++;
          equipeB.D++;
          if (setsA === 3 && (setsB === 0 || setsB === 1)) {
            equipeA.Pts += 3; // Vitória por 3x0 ou 3x1
          } else {
            // Vitória por 3x2
            equipeA.Pts += 2;
            equipeB.Pts += 1;
          }
        } else {
          // Equipe B venceu
          equipeB.V++;
          equipeA.D++;
          if (setsB === 3 && (setsA === 0 || setsA === 1)) {
            equipeB.Pts += 3; // Vitória por 3x0 ou 3x1
          } else {
            // Vitória por 3x2
            equipeB.Pts += 2;
            equipeA.Pts += 1;
          }
        }

        partida.placar_sets.forEach((set) => {
          equipeA.PP += set.a;
          equipeA.PC += set.b;
          equipeB.PP += set.b;
          equipeB.PC += set.a;
        });
      });

    return Object.values(stats).sort((a, b) => {
      if (b.Pts !== a.Pts) return b.Pts - a.Pts;
      if (b.V !== a.V) return b.V - a.V;
      const setAverageA = a.SP / (a.SC || 1);
      const setAverageB = b.SP / (b.SC || 1);
      if (setAverageB !== setAverageA) return setAverageB - setAverageA;
      const pointAverageA = a.PP / (a.PC || 1);
      const pointAverageB = b.PP / (b.PC || 1);
      return pointAverageB - pointAverageA;
    });
  }, [equipesDoGrupo, partidasDoGrupo]);

  return (
    <TableContainer component={Paper} elevation={2}>
      <Table size="small" aria-label="tabela de classificação">
        <TableHead>
          <TableRow>
            <TableCell>Pos</TableCell>
            <TableCell>Equipe</TableCell>
            <Tooltip title="Pontos">
              <TableCell align="center">Pts</TableCell>
            </Tooltip>
            <Tooltip title="Jogos">
              <TableCell align="center">J</TableCell>
            </Tooltip>
            <Tooltip title="Vitórias">
              <TableCell align="center">V</TableCell>
            </Tooltip>
            <Tooltip title="Derrotas">
              <TableCell align="center">D</TableCell>
            </Tooltip>
            <Tooltip title="Sets Pró">
              <TableCell align="center">SP</TableCell>
            </Tooltip>
            <Tooltip title="Sets Contra">
              <TableCell align="center">SC</TableCell>
            </Tooltip>
            <Tooltip title="Pontos Pró">
              <TableCell align="center">PP</TableCell>
            </Tooltip>
            <Tooltip title="Pontos Contra">
              <TableCell align="center">PC</TableCell>
            </Tooltip>
          </TableRow>
        </TableHead>
        <TableBody>
          {classificacao.map((item, index) => (
            <TableRow key={item.equipe.id} sx={getRowStyle(index + 1)}>
              <TableCell>
                <strong>{index + 1}º</strong>
              </TableCell>
              <TableCell>{item.equipe.nome}</TableCell>
              <TableCell align="center">
                <strong>{item.Pts}</strong>
              </TableCell>
              <TableCell align="center">{item.J}</TableCell>
              <TableCell align="center">{item.V}</TableCell>
              <TableCell align="center">{item.D}</TableCell>
              <TableCell align="center">{item.SP}</TableCell>
              <TableCell align="center">{item.SC}</TableCell>
              <TableCell align="center">{item.PP}</TableCell>
              <TableCell align="center">{item.PC}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClassificacaoGrupo;
