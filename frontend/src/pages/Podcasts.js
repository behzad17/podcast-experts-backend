import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Pagination,
  Spinner,
  Form,
} from "react-bootstrap";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import PodcastEditModal from "../components/podcasts/PodcastEditModal";
import PodcastCard from "../components/podcasts/PodcastCard";
import { toast } from "react-hot-toast";

const Podcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(9);
  const [selectedCategory, setSelectedCategory] = useState("");
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
    const fetchCategories = async () => {
      try {
        const response = await api.get("/podcasts/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage,
          page_size: pageSize,
        });

        if (selectedCategory) {
          params.append("category", selectedCategory);
        }

        const response = await api.get(`/podcasts/podcasts/?${params}`);
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

    fetchPodcasts();
  }, [currentPage, pageSize, selectedCategory]);

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

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when changing category
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

      const response = await api.put(
        `/podcasts/podcasts/${editingPodcast.id}/`,
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
      toast.success("Podcast updated successfully");
    } catch (error) {
      console.error("Error updating podcast:", error);
      toast.error(error.response?.data?.detail || "Failed to update podcast");
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

      <Row className="mb-4">
        <Col md={12}>
          <Form.Group>
            <Form.Select
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-4">
        {podcasts.map((podcast) => (
          <Col key={podcast.id} md={3}>
            <PodcastCard
              podcast={podcast}
              currentUser={currentUser}
              onEdit={handleEditClick}
            />
          </Col>
        ))}
      </Row>

      {podcasts.length === 0 && !loading && (
        <Alert variant="info">No podcasts found in this category.</Alert>
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

      {showEditModal && (
        <PodcastEditModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          podcast={editingPodcast}
          formData={editFormData}
          onChange={handleEditChange}
          onSubmit={handleEditSubmit}
        />
      )}
    </Container>
  );
};

export default Podcasts;
