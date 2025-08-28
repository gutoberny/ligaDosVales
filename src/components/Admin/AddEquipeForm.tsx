import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { createEquipe } from "../../store/slices";
import { Box, TextField, Button, Stack, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const AddEquipeForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [nome, setNome] = useState("");
  const [logoFile, setLogoFile] = useState<File | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    /* ... */
  };
  const handleSubmit = (e: React.FormEvent) => {
    /* ... */
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
      >
        <TextField
          label="Nome da Nova Equipe"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          fullWidth
        />
        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          onClick={() => fileInputRef.current?.click()}
        >
          Logo
        </Button>
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
      {logoFile && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Ficheiro: {logoFile.name}
        </Typography>
      )}
    </Box>
  );
};
export default AddEquipeForm;
