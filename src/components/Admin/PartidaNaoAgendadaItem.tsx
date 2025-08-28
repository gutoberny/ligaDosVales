import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Partida, updatePartida, deletePartida } from "../../store/slices";

// Importando componentes do MUI
import { Box, Typography, TextField, Button, Stack } from "@mui/material";

interface Props {
  partida: Partida;
}

const PartidaNaoAgendadaItem: React.FC<Props> = ({ partida }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [ordem, setOrdem] = useState("");
  const [quadra, setQuadra] = useState("");
  const [horario, setHorario] = useState("");

  const handleAgendar = (e: React.FormEvent) => {
    e.preventDefault();
    if (ordem && quadra) {
      dispatch(
        updatePartida({
          partidaId: partida.id,
          ordem: Number(ordem),
          quadra: Number(quadra),
          data_hora_jogo: horario || null,
        })
      );
    }
  };

  const handleRemover = () => {
    if (
      window.confirm(
        `Tem a certeza que deseja remover o confronto ${partida.equipe_a.nome} vs ${partida.equipe_b.nome}?`
      )
    ) {
      dispatch(deletePartida(partida.id));
    }
  };

  return (
    // Usamos Box em vez de form para melhor integração com MUI
    <Box
      component="form"
      onSubmit={handleAgendar}
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2, // Espaçamento consistente do tema
        alignItems: "center",
        p: 1.5, // Padding interno
        border: "1px solid",
        borderColor: "divider", // Cor de borda do tema
        borderRadius: 1, // Bordas arredondadas
        mb: 1, // Margem inferior
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ width: "100%", fontWeight: "bold" }}
      >
        {partida.equipe_a.nome} vs {partida.equipe_b.nome}
        <Typography
          component="span"
          variant="body2"
          color="text.secondary"
          sx={{ ml: 1 }}
        >
          ({partida.fase})
        </Typography>
      </Typography>

      {/* Usamos Stack para organizar os campos e botões */}
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          label="Ordem"
          type="number"
          value={ordem}
          onChange={(e) => setOrdem(e.target.value)}
          required
          size="small"
          sx={{ width: "80px" }}
        />
        <TextField
          label="Quadra"
          type="number"
          value={quadra}
          onChange={(e) => setQuadra(e.target.value)}
          required
          size="small"
          sx={{ width: "80px" }}
        />
        <TextField
          type="datetime-local"
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
          size="small"
          InputLabelProps={{
            shrink: true, // Garante que o label não sobreponha a data
          }}
        />
        <Button type="submit" variant="contained" size="small">
          Agendar
        </Button>
        <Button
          type="button"
          onClick={handleRemover}
          variant="outlined"
          color="error"
          size="small"
        >
          Remover
        </Button>
      </Stack>
    </Box>
  );
};

export default PartidaNaoAgendadaItem;
