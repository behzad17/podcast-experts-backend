import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const PodcasterList = () => {
  const { getAuthHeaders } = useAuth();
  const [podcasters, setPodcasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPodcasters = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/podcasters/",
          getAuthHeaders()
        );
        setPodcasters(response.data);
      } catch (err) {
        setError("Failed to load podcasters");
        console.error("Error fetching podcasters:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasters();
  }, [getAuthHeaders]);

  const filteredPodcasters = podcasters.filter(
    (podcaster) =>
      podcaster.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      podcaster.expertise.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="container py-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container py-4">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Podcasters</h2>
      <Form.Group className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search podcasters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {filteredPodcasters.length === 0 ? (
        <Alert variant="info">No podcasters found.</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredPodcasters.map((podcaster) => (
            <Col key={podcaster.id}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{podcaster.user_name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {podcaster.expertise}
                  </Card.Subtitle>
                  <Card.Text>
                    {podcaster.bio.length > 150
                      ? `${podcaster.bio.substring(0, 150)}...`
                      : podcaster.bio}
                  </Card.Text>
                  <Link
                    to={`/podcasters/${podcaster.id}`}
                    className="btn btn-primary"
                  >
                    View Profile
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default PodcasterList;
