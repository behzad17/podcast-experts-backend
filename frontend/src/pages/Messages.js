import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import MessageList from "../components/messages/MessageList";
import ChatWindow from "../components/messages/ChatWindow";

const Messages = () => {
  const { userId } = useParams();

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={4}>
          <MessageList />
        </Col>
        <Col md={8}>
          {userId ? (
            <ChatWindow userId={parseInt(userId)} />
          ) : (
            <div className="text-center mt-5">
              <h4>Select a conversation to start chatting</h4>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Messages;
