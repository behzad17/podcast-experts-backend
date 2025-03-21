import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

function Podcast2() {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await api.get("/podcast2/podcasts2/");
        setPodcasts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching podcasts:", err);
        setError("Failed to fetch podcasts");
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Podcasts 2.0</h1>
          {user && <div className="text-muted">Welcome, {user.username}!</div>}
          {!user && <div className="text-muted">You are not logged in</div>}
        </div>
        {user && (
          <Link to="/podcast2/create">
            <Button variant="primary">Add a Podcast</Button>
          </Link>
        )}
      </div>
      <Row>
        {podcasts.map((podcast) => (
          <Col key={podcast.id} md={4} className="mb-4">
            <Card>
              {podcast.image && (
                <Card.Img
                  variant="top"
                  src={podcast.image}
                  alt={podcast.title}
                />
              )}
              <Card.Body>
                <Card.Title>{podcast.title}</Card.Title>
                <Card.Text>
                  {podcast.description.substring(0, 100)}...
                </Card.Text>
                <Link to={`/podcast2/${podcast.id}`}>
                  <Button variant="primary">View Details</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Podcast2;
