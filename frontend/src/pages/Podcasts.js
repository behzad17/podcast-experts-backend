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
  InputGroup,
} from "react-bootstrap";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import PodcastEditModal from "../components/podcasts/PodcastEditModal";
import PodcastCard from "../components/podcasts/PodcastCard";
import { toast } from "react-hot-toast";
import {
  FaSearch,
  FaFilter,
  FaPlus,
  FaPodcast,
  FaMicrophone,
} from "react-icons/fa";

const Podcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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

        if (searchQuery.trim()) {
          params.append("search", searchQuery.trim());
        }

        const response = await api.get(`/podcasts/?${params}`);
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
  }, [currentPage, pageSize, selectedCategory, searchQuery]);

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

  const handleDeletePodcast = (podcastId) => {
    setPodcasts((prevPodcasts) =>
      prevPodcasts.filter((podcast) => podcast.id !== podcastId)
    );
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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

      const response = await api.put(
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
      toast.success("Podcast updated successfully");
    } catch (error) {
      console.error("Error updating podcast:", error);
      toast.error(error.response?.data?.detail || "Failed to update podcast");
    }
  };

  if (loading) {
    return (
      <div className="podcasts-page-modern">
        <Container className="mt-4">
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
            </div>
            <p className="loading-text">Discovering amazing podcasts...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="podcasts-page-modern">
      {/* Hero Section */}
      <div className="podcasts-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={8} md={12}>
              <div className="hero-content">
                <div className="hero-icon">
                  <FaPodcast />
                </div>
                <h1 className="hero-title">Discover Amazing Podcasts</h1>
                <p className="hero-subtitle">
                  Explore a world of knowledge, stories, and insights from
                  creators around the globe
                </p>
                {currentUser && (
                  <Button
                    variant="primary"
                    size="lg"
                    className="hero-cta"
                    onClick={handleCreatePodcast}
                  >
                    <FaPlus className="me-2" />
                    Create Your Podcast
                  </Button>
                )}
              </div>
            </Col>
            <Col lg={4} md={12} className="text-center">
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">{podcasts.length}</div>
                  <div className="stat-label">Podcasts Available</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{categories.length}</div>
                  <div className="stat-label">Categories</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="mt-5">
        {/* Search and Filter Section */}
        <Row className="mb-4">
          <Col lg={8} md={12} className="mb-3">
            <InputGroup className="search-input-group">
              <InputGroup.Text className="search-icon">
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search podcasts by title, description, or creator..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
            </InputGroup>
          </Col>
          <Col lg={4} md={12}>
            <div className="filter-section">
              <Form.Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="category-filter"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Col>
        </Row>

        {/* User Info Section */}
        {currentUser && (
          <div className="user-info-section mb-4">
            <div className="user-info-card">
              <div className="user-avatar">
                <FaMicrophone />
              </div>
              <div className="user-details">
                <h6 className="user-welcome">Welcome back!</h6>
                <p className="user-role">
                  You are logged in as{" "}
                  <span className="user-type">
                    {currentUser.user_type === "expert"
                      ? "an Expert"
                      : "a Podcaster"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="danger" className="error-alert">
            {error}
          </Alert>
        )}

        {/* Podcasts Grid */}
        {podcasts.length > 0 ? (
          <Row className="g-4 mb-5">
            {podcasts.map((podcast) => (
              <Col key={podcast.id} lg={3} md={4} sm={6}>
                <PodcastCard
                  podcast={podcast}
                  currentUser={currentUser}
                  onEdit={handleEditClick}
                  onDelete={handleDeletePodcast}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <FaPodcast />
            </div>
            <h3 className="empty-title">No podcasts found</h3>
            <p className="empty-message">
              {searchQuery || selectedCategory
                ? "Try adjusting your search or filter criteria"
                : "Be the first to create an amazing podcast!"}
            </p>
            {currentUser && (
              <Button variant="primary" onClick={handleCreatePodcast}>
                <FaPlus className="me-2" />
                Create First Podcast
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-section">
            <Pagination className="custom-pagination">
              <Pagination.First
                disabled={currentPage === 1}
                onClick={() => handlePageChange(1)}
                className="page-item-custom"
              />
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="page-item-custom"
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                  className="page-item-custom"
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="page-item-custom"
              />
              <Pagination.Last
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(totalPages)}
                className="page-item-custom"
              />
            </Pagination>
          </div>
        )}

        {/* Edit Modal */}
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

      {/* Custom CSS */}
      <style jsx>{`
        .podcasts-page-modern {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .podcasts-hero {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 100%
          );
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 2rem 0;
          color: white;
        }

        .hero-content {
          text-align: left;
        }

        .hero-icon {
          font-size: 2.5rem;
          color: #ffd700;
          margin-bottom: 0.75rem;
        }

        .hero-title {
          font-size: 2.8rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          background: linear-gradient(45deg, #ffffff, #ffd700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
          opacity: 0.9;
          line-height: 1.5;
        }

        .hero-cta {
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          border: none;
          color: #333;
          font-weight: 600;
          padding: 1rem 2rem;
          border-radius: 50px;
          box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
          transition: all 0.3s ease;
        }

        .hero-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(255, 215, 0, 0.4);
        }

        .hero-stats {
          display: flex;
          justify-content: space-around;
          margin-top: 1.5rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #ffd700;
          margin-bottom: 0.4rem;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .search-input-group {
          border-radius: 25px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .search-icon {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border: none;
          color: white;
          padding: 0.75rem 1rem;
        }

        .search-input {
          border: none;
          padding: 0.75rem 1rem;
          font-size: 1rem;
        }

        .search-input:focus {
          box-shadow: none;
          border-color: #667eea;
        }

        .filter-section {
          display: flex;
          gap: 1rem;
        }

        .category-filter {
          border-radius: 25px;
          border: 2px solid #e9ecef;
          padding: 0.75rem 1rem;
          background: white;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .user-info-section {
          margin: 2rem 0;
        }

        .user-info-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .user-avatar {
          width: 50px;
          height: 50px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
        }

        .user-welcome {
          margin: 0;
          color: #333;
          font-weight: 600;
        }

        .user-role {
          margin: 0;
          color: #666;
        }

        .user-type {
          color: #667eea;
          font-weight: 600;
        }

        .error-alert {
          border-radius: 15px;
          border: none;
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
          backdrop-filter: blur(10px);
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          margin: 2rem 0;
        }

        .empty-icon {
          font-size: 4rem;
          color: #667eea;
          margin-bottom: 1rem;
        }

        .empty-title {
          color: #333;
          margin-bottom: 1rem;
        }

        .empty-message {
          color: #666;
          margin-bottom: 2rem;
        }

        .pagination-section {
          display: flex;
          justify-content: center;
          margin: 3rem 0;
        }

        .custom-pagination .page-item-custom {
          margin: 0 0.25rem;
        }

        .custom-pagination .page-link {
          border-radius: 10px;
          border: none;
          color: #667eea;
          background: rgba(255, 255, 255, 0.9);
          padding: 0.75rem 1rem;
          margin: 0 0.25rem;
          transition: all 0.3s ease;
        }

        .custom-pagination .page-link:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
        }

        .custom-pagination .active .page-link {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          color: white;
        }

        .loading-spinner {
          margin-bottom: 2rem;
        }

        .spinner-ring {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid #ffd700;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .loading-text {
          font-size: 1.2rem;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-stats {
            flex-direction: column;
            gap: 1rem;
          }

          .search-input-group {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Podcasts;
