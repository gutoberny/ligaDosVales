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
        {/* Linha 1: Nome e Equipe */}
        <Stack direction="row" spacing={2}>
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
              {equipes.map((equipe) => (
                <MenuItem key={equipe.id} value={equipe.id}>
                  {equipe.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {/* Linha 2: Uploads e Botão de Submeter */}
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Upload de Foto */}
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={() => fotoInputRef.current?.click()}
          >
            Foto
          </Button>
          <input
            type="file"
            ref={fotoInputRef}
            hidden
            onChange={(e) => setFotoFile(e.target.files?.[0])}
            accept="image/*"
          />
          <Typography variant="body2" sx={{ flexGrow: 1 }} noWrap>
            {fotoFile?.name || "Nenhuma foto"}
          </Typography>

          {/* Upload de Documento */}
          <Button
            variant="outlined"
            startIcon={<FolderIcon />}
            onClick={() => documentoInputRef.current?.click()}
          >
            Documento
          </Button>
          <input
            type="file"
            ref={documentoInputRef}
            hidden
            onChange={(e) => setDocumentoFile(e.target.files?.[0])}
          />
          <Typography variant="body2" sx={{ flexGrow: 1 }} noWrap>
            {documentoFile?.name || "Nenhum documento"}
          </Typography>

          <Button type="submit" variant="contained">
            Adicionar Atleta
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddAtletaForm;
