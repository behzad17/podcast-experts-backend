import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert, Pagination, Spinner } from "react-bootstrap";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Experts = () => {
  const [experts, setExperts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(9); // Number of experts per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/experts/?page=${currentPage}&page_size=${pageSize}`);
        setExperts(response.data.results || response.data);
        setTotalPages(Math.ceil((response.data.count || response.data.length) / pageSize));
      } catch (error) {
        console.error("Error fetching experts:", error);
        setError("Failed to load experts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, [currentPage, pageSize]);

  const handleCreateExpert = () => {
    navigate("/experts/create");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
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
        <Button variant="primary" onClick={handleCreateExpert}>
          Create Expert Profile
        </Button>
      </div>

      <Row>
        {experts.map((expert) => (
          <Col key={expert.id} md={4} className="mb-4">
            <Card>
              {expert.profile_picture && (
                <Card.Img
                  variant="top"
                  src={expert.profile_picture}
                  alt={expert.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <Card.Body>
                <Card.Title>{expert.name}</Card.Title>
                <Card.Text>{expert.bio?.substring(0, 100)}...</Card.Text>
                <Button
                  variant="outline-primary"
                  onClick={() => navigate(`/experts/${expert.id}`)}
                >
                  View Profile
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.First
              disabled={currentPage === 1}
              onClick={() => handlePageChange(1)}
            />
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            />
            <Pagination.Last
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(totalPages)}
            />
          </Pagination>
        </div>
      )}
    </Container>
  );
};

export default Experts;
