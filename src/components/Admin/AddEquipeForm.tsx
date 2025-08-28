import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { createEquipe } from "../../store/slices";
import { Box, TextField, Button, Stack, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const AddEquipeForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [nome, setNome] = useState("");
  // Novo estado para guardar o ficheiro do logo
  const [logoFile, setLogoFile] = useState<File | undefined>();
  // Ref para aceder ao input de ficheiro escondido
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLogoFile(event.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Passamos o nome e o ficheiro do logo para a nossa ação do Redux
    dispatch(createEquipe({ nome, logoFile }));
    // Limpa o formulário
    setNome("");
    setLogoFile(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          label="Nome da Nova Equipe"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          fullWidth
        />

        {/* Botão de Upload Visível */}
        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          onClick={() => fileInputRef.current?.click()} // Aciona o clique no input escondido
        >
          Logo
        </Button>
        {/* Input de Ficheiro Escondido */}
        <input
          type="file"
          ref={fileInputRef}
          hidden
          onChange={handleFileChange}
          accept="image/*"
        />

        <Button type="submit" variant="contained">
          Adicionar Equipe
        </Button>
      </Stack>
      {/* Mostra o nome do ficheiro selecionado */}
      {logoFile && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Ficheiro selecionado: {logoFile.name}
        </Typography>
      )}
    </Box>
  );
};

export default AddEquipeForm;
