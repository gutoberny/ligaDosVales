import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { Equipe, updateEquipe, deleteEquipe } from "../../store/slices";

// Importando componentes e ícones do MUI
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const EquipesList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { equipes } = useSelector((state: RootState) => state.equipes);

  // Estados para controlar o Modal de edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [equipeSelecionada, setEquipeSelecionada] = useState<Equipe | null>(
    null
  );
  const [editNome, setEditNome] = useState("");
  const [editLogoFile, setEditLogoFile] = useState<File | undefined>();

  const handleOpenModal = (equipe: Equipe) => {
    setEquipeSelecionada(equipe);
    setEditNome(equipe.nome);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEquipeSelecionada(null);
    setEditNome("");
    setEditLogoFile(undefined);
  };

  const handleSaveChanges = () => {
    if (equipeSelecionada) {
      dispatch(
        updateEquipe({
          equipeId: equipeSelecionada.id,
          updates: { nome: editNome },
          logoFile: editLogoFile,
        })
      );
      handleCloseModal();
    }
  };

  const handleDelete = (equipe: Equipe) => {
    if (
      window.confirm(
        `Tem a certeza que deseja excluir a equipe "${equipe.nome}"? Esta ação não pode ser desfeita.`
      )
    ) {
      dispatch(deleteEquipe(equipe.id));
    }
  };

  return (
    <>
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "80px" }}>Logo</TableCell>
              <TableCell>Nome da Equipe</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {equipes.map((equipe) => (
              <TableRow key={equipe.id}>
                <TableCell>
                  <Avatar src={equipe.logo_url || undefined} alt={equipe.nome}>
                    {equipe.nome.charAt(0)}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">{equipe.nome}</Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleOpenModal(equipe)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(equipe)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Edição */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Editar Equipe: {equipeSelecionada?.nome}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Nome da Equipe"
              value={editNome}
              onChange={(e) => setEditNome(e.target.value)}
              fullWidth
            />
            <Box>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
              >
                Alterar Logo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setEditLogoFile(e.target.files?.[0])}
                />
              </Button>
              {editLogoFile && (
                <Typography variant="body2" sx={{ display: "inline", ml: 2 }}>
                  {editLogoFile.name}
                </Typography>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleSaveChanges} variant="contained">
            Salvar Alterações
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EquipesList;
