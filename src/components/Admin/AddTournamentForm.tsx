import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { createTorneio } from "../../store/slices";
import { Box, TextField, Button, Stack } from "@mui/material";

const AddTournamentForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [nome, setNome] = useState("");
  const [temporada, setTemporada] = useState(new Date().getFullYear());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // A data é gerada automaticamente no formato YYYY-MM-DD
    const data_inicio = new Date().toISOString().split("T")[0];
    dispatch(createTorneio({ nome, temporada, data_inicio }));
    setNome("");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          label="Nome do Novo Torneio"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Temporada"
          type="number"
          value={temporada}
          onChange={(e) => setTemporada(Number(e.target.value))}
          required
          sx={{ width: 150 }}
        />
        <Button type="submit" variant="contained">
          Adicionar
        </Button>
      </Stack>
    </Box>
  );
};
export default AddTournamentForm;
