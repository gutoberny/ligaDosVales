import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

const teams = [
  { id: 1, name: "Team A", city: "City A" },
  { id: 2, name: "Team B", city: "City B" },
];

const Teams = () => (
  <Container style={{ marginTop: 80 }}>
    <Typography variant="h4" gutterBottom>
      Teams
    </Typography>
    {teams.map((team) => (
      <div key={team.id}>
        <Typography variant="h6">{team.name}</Typography>
        <Typography variant="body1">City: {team.city}</Typography>
      </div>
    ))}
  </Container>
);

export default Teams;
