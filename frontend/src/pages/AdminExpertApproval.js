import React, { useState, useEffect } from "react";
import { Container, Table, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../api/axios";

const AdminExpertApproval = () => {
  const [pendingExperts, setPendingExperts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchPendingExperts = async () => {
    try {
      const response = await api.get("/experts/pending/");
      setPendingExperts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching pending experts:", error);
      if (error.response && error.response.status === 403) {
        setError("You don't have permission to view pending experts");
      } else {
        setError("Error loading pending experts");
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingExperts();
  }, []);

  const handleApproval = async (expertId, isApproved) => {
    try {
      await api.post(`/experts/profile/approve/${expertId}/`, {
        is_approved: isApproved,
      });
      setSuccess(
        `Expert profile ${isApproved ? "approved" : "rejected"} successfully`
      );
      // Refresh the list
      fetchPendingExperts();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error updating approval status:", error);
      setError(
        error.response?.data?.detail ||
          "Error updating expert profile approval status"
      );
    }
  };

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
      <h2>Pending Expert Profiles</h2>
      {success && <Alert variant="success">{success}</Alert>}
      {pendingExperts.length === 0 ? (
        <Alert variant="info">No pending expert profiles to review</Alert>
      ) : (
        <Table responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Expertise</th>
              <th>Experience</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingExperts.map((expert) => (
              <tr key={expert.id}>
                <td>
                  <Link to={`/experts/${expert.id}`}>{expert.name}</Link>
                </td>
                <td>{expert.expertise}</td>
                <td>{expert.experience_years} years</td>
                <td>{new Date(expert.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleApproval(expert.id, true)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleApproval(expert.id, false)}
                    >
                      Reject
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminExpertApproval;
