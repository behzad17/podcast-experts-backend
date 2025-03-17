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
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Comments from "../components/Comments";

const Experts = () => {
  const [experts, setExperts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);

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
            await api.get("/experts/my-profile/");
            setHasProfile(true);
          } catch (error) {
            console.log(
              "Expert profile check error:",
              error.response?.data || error.message
            );
            if (error.response && error.response.status === 404) {
              setHasProfile(false);
            }
          }
        } catch (error) {
          console.log(
            "Auth check error:",
            error.response?.data || error.message
          );
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        console.log("Fetching experts...");
        const response = await api.get("/experts/");
        console.log("Experts response:", response.data);
        setExperts(response.data);
      } catch (error) {
        console.error("Error fetching experts:", error);
        console.error("Error response:", error.response?.data);
        setError(error.response?.data?.detail || "Error loading experts");
      }
    };

    fetchExperts();
  }, []);

  const filteredExperts = experts.filter((expert) =>
    expert.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div>
          {isAuthenticated && hasProfile && (
            <Link to="/expert-profile" className="me-2">
              <Button variant="primary">My Expert Profile</Button>
            </Link>
          )}
          {isAuthenticated && !hasProfile && (
            <Link to="/experts/create">
              <Button variant="primary">Create Expert Profile</Button>
            </Link>
          )}
        </div>
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
                  <div className="d-flex justify-content-between align-items-center">
                    <Link
                      to={`/experts/${expert.id}`}
                      className="btn btn-outline-primary"
                    >
                      View Profile
                    </Link>
                    <Button
                      variant="outline-info"
                      onClick={() => {
                        setSelectedExpert(expert);
                        setShowCommentsModal(true);
                      }}
                    >
                      Comments
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Comments Modal */}
      <Modal
        show={showCommentsModal}
        onHide={() => setShowCommentsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Comments for {selectedExpert?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedExpert && (
            <Comments entityType="experts" entityId={selectedExpert.id} />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Experts;
