import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/admin_dashboard/stats/");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Failed to load dashboard statistics");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container className="mt-4">
        <h2>Loading dashboard...</h2>
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
      <h2>Admin Dashboard</h2>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <Card.Text>{stats?.total_users || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Total Podcasts</Card.Title>
              <Card.Text>{stats?.total_podcasts || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Total Experts</Card.Title>
              <Card.Text>{stats?.total_experts || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Pending Experts</Card.Title>
              <Card.Text>{stats.pending_experts || 0}</Card.Text>
              <Link to="/admin/experts" className="btn btn-primary">
                Review Expert Profiles
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Pending Podcasts</Card.Title>
              <Card.Text>{stats.pending_podcasts || 0}</Card.Text>
              <Link to="/admin/podcast-approval" className="btn btn-primary">
                Review Podcasts
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
