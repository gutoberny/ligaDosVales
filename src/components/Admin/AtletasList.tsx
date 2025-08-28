import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { Atleta, updateAtleta } from "../../store/slices";

// Importando componentes do MUI para o Modal
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
  Link,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const AtletasList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { atletas } = useSelector((state: RootState) => state.atletas);
  const { equipes } = useSelector((state: RootState) => state.equipes);

  // Estados para controlar o Modal de edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [atletaSelecionado, setAtletaSelecionado] = useState<Atleta | null>(
    null
  );
  const [novoEquipeId, setNovoEquipeId] = useState("");

  // Funções para abrir e fechar o Modal
  const handleOpenModal = (atleta: Atleta) => {
    setAtletaSelecionado(atleta);
    setNovoEquipeId(atleta.equipe_id || "");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAtletaSelecionado(null);
    setNovoEquipeId("");
  };

  // Função para salvar as alterações
  const handleSaveChanges = () => {
    if (atletaSelecionado && novoEquipeId) {
      dispatch(
        updateAtleta({
          atletaId: atletaSelecionado.id,
          updates: { equipe_id: novoEquipeId },
        })
      );
      handleCloseModal();
    }
  };

  return (
    <>
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Foto</TableCell>
              <TableCell>Nome Completo</TableCell>
              <TableCell>Equipe</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {atletas.map((atleta) => (
              <TableRow key={atleta.id}>
                <TableCell>
                  <Avatar
                    src={atleta.foto_url || undefined}
                    alt={atleta.nome_completo}
                  >
                    {atleta.nome_completo.charAt(0)}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">
                    {atleta.nome_completo}
                  </Typography>
                </TableCell>
                <TableCell>{atleta.equipes?.nome || "Sem equipe"}</TableCell>
                <TableCell>
                  {atleta.documento_url && (
                    <Link
                      href={atleta.documento_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver Doc
                    </Link>
                  )}
                </TableCell>
                {/* Nova célula com o botão de editar */}
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleOpenModal(atleta)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Edição (só é renderizado quando aberto) */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Editar Atleta: {atletaSelecionado?.nome_completo}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Equipe</InputLabel>
              <Select
                value={novoEquipeId}
                label="Equipe"
                onChange={(e) => setNovoEquipeId(e.target.value)}
              >
                {equipes.map((equipe) => (
                  <MenuItem key={equipe.id} value={equipe.id}>
                    {equipe.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
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

export default AtletasList;
