import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../api/axios";

function AdminDashboard() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_podcasts: 0,
    total_podcast2: 0,
    pending_podcasts: 0,
    pending_podcast2: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats/");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      <Row>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <Card.Text>{stats?.total_users || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Total Podcasts</Card.Title>
              <Card.Text>{stats?.total_podcasts || 0}</Card.Text>
              <Link to="/podcasts" className="btn btn-primary">
                View All
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Total Podcast2</Card.Title>
              <Card.Text>{stats?.total_podcast2 || 0}</Card.Text>
              <Link to="/podcast2" className="btn btn-primary">
                View All
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Pending Podcasts</Card.Title>
              <Card.Text>{stats.pending_podcasts || 0}</Card.Text>
              <Link to="/podcasts" className="btn btn-primary">
                Review
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Pending Podcast2</Card.Title>
              <Card.Text>{stats.pending_podcast2 || 0}</Card.Text>
              <Link to="/podcast2" className="btn btn-primary">
                Review
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard;
