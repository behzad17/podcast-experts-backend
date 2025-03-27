import React from "react";
import { Container } from "react-bootstrap";
import MessagingLayout from "../components/messaging/MessagingLayout";

const Messages = () => {
  return (
    <Container fluid className="p-0">
      <MessagingLayout />
    </Container>
  );
};

export default Messages;
