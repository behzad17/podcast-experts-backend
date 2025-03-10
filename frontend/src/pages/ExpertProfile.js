import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Card, Button, Form } from "react-bootstrap";

const ExpertProfile = () => {
  const { id } = useParams();
  const [expert, setExpert] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchExpert();
  }, []);

  const fetchExpert = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/experts/${id}/`
      );
      setExpert(response.data);
    } catch (error) {
      console.error("Error fetching expert:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8000/api/comments/`, {
        expert: id,
        text: comment,
      });
      setComment("");
      alert("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (!expert) return <p>Loading...</p>;

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>{expert.name}</Card.Title>
          <Card.Text>{expert.specialty}</Card.Text>
          <Card.Text>{expert.bio}</Card.Text>
        </Card.Body>
      </Card>

      <h4>Leave a Comment</h4>
      <Form onSubmit={handleCommentSubmit}>
        <Form.Group>
          <Form.Control
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment..."
            required
          />
        </Form.Group>
        <Button type="submit" className="mt-2">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default ExpertProfile;
