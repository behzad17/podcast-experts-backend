import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Card, Button, Form } from "react-bootstrap";
import CollaborationRequest from "../components/CollaborationRequest";
import LikeButton from "../components/LikeButton";

const ExpertProfile = () => {
  const { id } = useParams();
  const [expert, setExpert] = useState(null);
  const [comment, setComment] = useState("");

  // ✅ استفاده از useCallback برای جلوگیری از تغییر مداوم تابع در حافظه
  const fetchExpert = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/experts/${id}/`
      );
      setExpert(response.data);
    } catch (error) {
      console.error("Error fetching expert:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchExpert();
  }, [fetchExpert]); // ✅ اضافه کردن `fetchExpert` به وابستگی‌ها

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
          <CollaborationRequest expertId={expert.id} />
          <LikeButton expertId={expert.id} />
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
