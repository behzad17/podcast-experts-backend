import React, { useState } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";

const CollaborationRequest = ({ expertId }) => {
  const [requestData, setRequestData] = useState({ title: "", message: "", date: "" });

  const handleChange = (e) => {
    setRequestData({ ...requestData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8000/api/collaborations/", { ...requestData, receiver: expertId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Request sent successfully!");
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-3">
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" name="title" onChange={handleChange} required />
      </Form.Group>
      <Form.Group>
        <Form.Label>Message</Form.Label>
        <Form.Control as="textarea" name="message" rows={3} onChange={handleChange} required />
      </Form.Group>
      <Form.Group>
        <Form.Label>Preferred Date</Form.Label>
        <Form.Control type="date" name="date" onChange={handleChange} required />
      </Form.Group>
      <Button type="submit" className="mt-3">Send Request</Button>
    </Form>
  );
};

export default CollaborationRequest;
