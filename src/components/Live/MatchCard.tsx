import React from "react";
import { Partida } from "../../store/slices";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
} from "@mui/material";

interface Props {
  partida: Partida;
  onClick: () => void;
  isSelected: boolean;
}

const MatchCard: React.FC<Props> = ({ partida, onClick, isSelected }) => {
  const getStatusChipColor = (
    status: string
  ): "success" | "warning" | "default" => {
    if (status === "Em Andamento") return "success";
    if (status === "Finalizado") return "warning";
    return "default";
  };

  return (
    <Card
      sx={{
        mb: 2,
        border: isSelected ? "2px solid" : "1px solid",
        borderColor: isSelected ? "secondary.main" : "divider",
      }}
      elevation={isSelected ? 5 : 1}
    >
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Jogo {partida.ordem} - {partida.fase}
            </Typography>
            <Chip
              label={partida.status}
              color={getStatusChipColor(partida.status)}
              size="small"
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
            <Avatar
              src={partida.equipe_a.logo_url || undefined}
              sx={{ width: 24, height: 24, mr: 1 }}
            >
              {partida.equipe_a.nome.charAt(0)}
            </Avatar>
            <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
              {partida.equipe_a.nome}
            </Typography>
            <Typography
              variant="h5"
              component="span"
              sx={{ mx: 2, fontWeight: "bold" }}
            >
              {partida.pontos_equipe_a}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={partida.equipe_b.logo_url || undefined}
              sx={{ width: 24, height: 24, mr: 1 }}
            >
              {partida.equipe_b.nome.charAt(0)}
            </Avatar>
            <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
              {partida.equipe_b.nome}
            </Typography>
            <Typography
              variant="h5"
              component="span"
              sx={{ mx: 2, fontWeight: "bold" }}
            >
              {partida.pontos_equipe_b}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MatchCard;
