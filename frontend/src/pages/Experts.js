import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const Experts = () => {
  const [experts, setExperts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (token && userData) {
        try {
          const response = await api.get(`/users/${userData.id}/`);
          setIsAuthenticated(true);
          // Check if user has an expert profile
          try {
            await api.get("/experts/profile/me/");
            setHasProfile(true);
          } catch (error) {
            if (error.response && error.response.status === 404) {
              setHasProfile(false);
            }
          }
        } catch (error) {
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await api.get("/experts/");
        setExperts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching experts:", error);
        setError("Error loading experts");
        setIsLoading(false);
      }
    };

    fetchExperts();
  }, []);

  const filteredExperts = experts.filter((expert) =>
    expert.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <Container className="mt-4">Loading...</Container>;
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Experts</h2>
        {isAuthenticated && !hasProfile && (
          <Link to="/experts/create">
            <Button variant="primary">Create Expert Profile</Button>
          </Link>
        )}
      </div>

      <Form.Group className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search experts by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {filteredExperts.length === 0 ? (
        <Alert variant="info">No experts found</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredExperts.map((expert) => (
            <Col key={expert.id}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    <Link
                      to={`/experts/${expert.id}`}
                      className="text-decoration-none text-dark"
                    >
                      {expert.name}
                    </Link>
                  </Card.Title>
                  <Card.Text className="text-muted mb-2">
                    Experience: {expert.experience_years} years
                  </Card.Text>
                  <Card.Text className="mb-2">
                    <strong>Expertise:</strong> {expert.expertise}
                  </Card.Text>
                  <Card.Text className="text-truncate">{expert.bio}</Card.Text>
                  <Link
                    to={`/experts/${expert.id}`}
                    className="btn btn-outline-primary"
                  >
                    View Profile
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Experts;
