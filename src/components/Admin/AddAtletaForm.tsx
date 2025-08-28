import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { createAtleta } from "../../store/slices";
import {
  Box,
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FolderIcon from "@mui/icons-material/Folder";

const AddAtletaForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { equipes } = useSelector((state: RootState) => state.equipes);

  const [nome, setNome] = useState("");
  const [equipeId, setEquipeId] = useState("");
  const [fotoFile, setFotoFile] = useState<File | undefined>();
  const [documentoFile, setDocumentoFile] = useState<File | undefined>();

  const fotoInputRef = useRef<HTMLInputElement>(null);
  const documentoInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      createAtleta({
        nome_completo: nome,
        equipe_id: equipeId,
        fotoFile,
        documentoFile,
      })
    );
    // Limpa o formulário
    setNome("");
    setEquipeId("");
    setFotoFile(undefined);
    setDocumentoFile(undefined);
    if (fotoInputRef.current) fotoInputRef.current.value = "";
    if (documentoInputRef.current) documentoInputRef.current.value = "";
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Nome do Novo Atleta"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Equipe</InputLabel>
            <Select
              value={equipeId}
              label="Equipe"
              onChange={(e) => setEquipeId(e.target.value)}
              required
            >
              {/* ... MenuItems ... */}
            </Select>
          </FormControl>
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
        >
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={() => fotoInputRef.current?.click()}
          >
            Foto
          </Button>
          {/* ... (inputs de ficheiro e Typography) ... */}
          <Button type="submit" variant="contained">
            Adicionar Atleta
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
export default AddAtletaForm;
