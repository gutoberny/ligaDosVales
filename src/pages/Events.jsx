import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

const events = [
  { id: 1, name: "Opening", date: "2023-11-01" },
  { id: 2, name: "Semifinals", date: "2023-11-15" },
];

const Events = () => (
  <Container style={{ marginTop: 80 }}>
    <Typography variant="h4" gutterBottom>
      Etapas
    </Typography>
    {events.map((event) => (
      <div key={event.id}>
        <Typography variant="h6">{event.name}</Typography>
        <Typography variant="body1">Date: {event.date}</Typography>
      </div>
    ))}
  </Container>
);

export default Events;
