import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card } from "react-bootstrap";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    podcasts: 0,
    reports: 0,
    collaborations: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/admin_dashboard/stats/"
      ); // مسیر درست
      setStats(response.data || {}); // جلوگیری از مقدار null
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Admin Dashboard</h2>

      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Users</Card.Title>
          <Card.Text>{stats.users ?? "Loading..."}</Card.Text>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Podcasts</Card.Title>
          <Card.Text>{stats.podcasts ?? "Loading..."}</Card.Text>
        </Card.Body>
      </Card>

      {stats.reports !== undefined && ( // بررسی مقدار reports قبل از نمایش
        <Card className="mb-3">
          <Card.Body>
            <Card.Title>Reports</Card.Title>
            <Card.Text>{stats.reports}</Card.Text>
          </Card.Body>
        </Card>
      )}

      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Collaboration Requests</Card.Title>
          <Card.Text>{stats.collaborations ?? "Loading..."}</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
