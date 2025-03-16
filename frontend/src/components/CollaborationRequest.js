import React, { useState } from "react";
import api from "../api/axios";
import { Modal, Form, Button, Alert } from "react-bootstrap";

const CollaborationRequest = ({ expertId, podcastId, onClose }) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/collaborations/", {
        receiver: expertId,
        podcast: podcastId,
        message: message,
      });
      setSuccess("Collaboration request sent successfully!");
      setMessage("");
      setTimeout(onClose, 2000);
    } catch (error) {
      console.error("Error sending collaboration request:", error);
      setError(error.response?.data?.detail || "Failed to send request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Send Collaboration Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              required
            />
          </Form.Group>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Request"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CollaborationRequest;
