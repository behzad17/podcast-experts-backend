import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Pagination,
  Spinner,
  Form,
} from "react-bootstrap";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import PodcastEditModal from "../components/podcasts/PodcastEditModal";

const Podcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    link: "",
    image: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/podcasts/podcasts/?page=${currentPage}&page_size=${pageSize}&search=${searchTerm}`
        );
        setPodcasts(response.data.results || response.data);
        setTotalPages(
          Math.ceil((response.data.count || response.data.length) / pageSize)
        );
      } catch (error) {
        console.error("Error fetching podcasts:", error);
        if (error.response?.status === 401) {
          setError("Please log in to view podcasts.");
        } else if (error.response?.status === 404) {
          setError("No podcasts found.");
        } else {
          setError("Failed to load podcasts. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchPodcasts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, pageSize, searchTerm]);

  useEffect(() => {
    // Get current user if token exists
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setCurrentUser(userData);
    }
  }, []);

  const handleCreatePodcast = () => {
    navigate("/podcasts/create");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleEditClick = (podcast) => {
    setEditingPodcast(podcast);
    setEditFormData({
      title: podcast.title,
      description: podcast.description,
      link: podcast.link || "",
      image: null,
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.length > 0) {
      setEditFormData({ ...editFormData, [name]: files[0] });
    } else {
      setEditFormData({ ...editFormData, [name]: value });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(editFormData).forEach((key) => {
        if (editFormData[key] !== null) {
          formData.append(key, editFormData[key]);
        }
      });

      const response = await api.patch(
        `/podcasts/${editingPodcast.id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setShowEditModal(false);
      // Update only the edited podcast in the current page
      setPodcasts(
        podcasts.map((p) =>
          p.id === editingPodcast.id ? { ...p, ...response.data } : p
        )
      );
    } catch (error) {
      console.error("Error updating podcast:", error);
      setError("Failed to update podcast. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Podcasts</h2>
          {currentUser && (
            <div className="text-muted">
              You are logged in as{" "}
              {currentUser.user_type === "expert" ? "an Expert" : "a Podcaster"}
            </div>
          )}
        </div>
        {currentUser && (
          <Button variant="primary" onClick={handleCreatePodcast}>
            Create Podcast
          </Button>
        )}
      </div>

      <Form.Group className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search podcasts..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {podcasts.map((podcast) => (
          <Col key={podcast.id} md={4} className="mb-4">
            <Card>
              {podcast.image && (
                <Card.Img
                  variant="top"
                  src={podcast.image}
                  alt={podcast.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <Card.Body>
                <Card.Title>{podcast.title}</Card.Title>
                <Card.Text>
                  {podcast.description?.substring(0, 100)}...
                </Card.Text>
                <div className="d-flex justify-content-between">
                  <Button
                    variant="outline-primary"
                    onClick={() => navigate(`/podcasts/${podcast.id}`)}
                  >
                    View Details
                  </Button>
                  {currentUser && podcast.user === currentUser.id && (
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleEditClick(podcast)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {podcasts.length === 0 && !loading && (
        <Alert variant="info">
          No podcasts found. Try adjusting your search term.
        </Alert>
      )}

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

      <PodcastEditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        podcast={editingPodcast}
        formData={editFormData}
        onChange={handleEditChange}
        onSubmit={handleEditSubmit}
      />
    </Container>
  );
};

export default Podcasts;
