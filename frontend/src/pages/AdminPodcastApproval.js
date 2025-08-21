import React, { useState, useEffect } from "react";
import { Container, Table, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../api/axios";

const AdminPodcastApproval = () => {
  const [pendingPodcasts, setPendingPodcasts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchPendingPodcasts = async () => {
    try {
      const response = await api.get("/podcasts/pending/");
      setPendingPodcasts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching pending podcasts:", error);
      if (error.response && error.response.status === 403) {
        setError("You don't have permission to view pending podcasts");
      } else {
        setError("Error loading pending podcasts");
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPodcasts();
  }, []);

  const handleApproval = async (podcastId, isApproved) => {
    try {
      if (isApproved) {
        await api.post(`/podcasts/${podcastId}/approve/`);
        setSuccess("Podcast approved successfully");
      } else {
        // For rejection, we could implement a reject endpoint or just delete
        // For now, we'll just show a message
        setSuccess("Podcast rejected (you may want to delete it manually)");
      }
      // Refresh the list
      fetchPendingPodcasts();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error updating approval status:", error);
      setError(
        error.response?.data?.detail ||
          "Error updating podcast approval status"
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
      <h2>Pending Podcasts</h2>
      {success && <Alert variant="success">{success}</Alert>}
      {pendingPodcasts.length === 0 ? (
        <Alert variant="info">No pending podcasts to review</Alert>
      ) : (
        <Table responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Owner</th>
              <th>Category</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingPodcasts.map((podcast) => (
              <tr key={podcast.id}>
                <td>
                  <Link to={`/podcasts/${podcast.id}`}>{podcast.title}</Link>
                </td>
                <td>{podcast.owner?.username || "Unknown"}</td>
                <td>{podcast.category?.name || "No Category"}</td>
                <td>{new Date(podcast.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleApproval(podcast.id, true)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleApproval(podcast.id, false)}
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

export default AdminPodcastApproval;
