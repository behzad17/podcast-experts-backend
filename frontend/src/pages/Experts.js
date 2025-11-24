import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Pagination,
  Form,
  InputGroup,
} from "react-bootstrap";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import ExpertCard from "../components/experts/ExpertCard";
import { FaSearch, FaFilter, FaPlus, FaUserTie, FaUsers } from "react-icons/fa";

const Experts = () => {
  const [experts, setExperts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/experts/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage,
          page_size: pageSize,
        });

        if (searchTerm && searchTerm.trim()) {
          params.append("search", searchTerm.trim());
        }
        if (selectedCategory) {
          params.append("category", selectedCategory);
        }

        const response = await api.get(`/experts/?${params}`);
        setExperts(response.data.results || response.data);
        setTotalPages(
          Math.ceil((response.data.count || response.data.length) / pageSize)
        );
      } catch (error) {
        console.error("Error fetching experts:", error);
        setError("Failed to load experts. Please try again later.");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchExperts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, pageSize, searchTerm, selectedCategory]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setCurrentUser(userData);
    }
  }, []);

  const handleCreateExpert = () => {
    navigate("/experts/create");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchKeyDown = (e) => {
    // Prevent form submission on Enter key
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteExpert = (expertId) => {
    setExperts((prevExperts) =>
      prevExperts.filter((expert) => expert.id !== expertId)
    );
  };

  // Only show full-page loading on initial load, not during search/filter
  if (initialLoading) {
    return (
      <div className="experts-page-modern">
        <Container className="mt-4">
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
            </div>
            <p className="loading-text">Discovering amazing experts...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="experts-page-modern">
      <div className="experts-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={8} md={12}>
              <div className="hero-content">
                <div className="hero-icon">
                  <FaUserTie />
                </div>
                <h1 className="hero-title">Discover Expert Professionals</h1>
                <p className="hero-subtitle">
                  Connect with industry leaders, thought leaders, and domain
                  experts who can elevate your podcast to the next level
                </p>
                {currentUser && (
                  <Button
                    variant="primary"
                    size="lg"
                    className="hero-cta"
                    onClick={handleCreateExpert}
                  >
                    <FaPlus className="me-2" />
                    Create Expert Profile
                  </Button>
                )}
              </div>
            </Col>
            <Col lg={4} md={12} className="text-center">
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">{experts.length}</div>
                  <div className="stat-label">Experts Available</div>
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
        <Row className="mb-4">
          <Col lg={8} md={12} className="mb-3">
            <InputGroup className="search-input-group">
              <InputGroup.Text className="search-icon">
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search experts by name, expertise, or description..."
                value={searchTerm}
                onChange={handleSearch}
                onKeyDown={handleSearchKeyDown}
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

        {currentUser && (
          <div className="user-info-section mb-4">
            <div className="user-info-card">
              <div className="user-avatar">
                <FaUsers />
              </div>
              <div className="user-details">
                <h6 className="user-welcome">
                  Welcome back, {currentUser.username}!
                </h6>
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

        {/* Loading indicator for search/filter operations */}
        {loading && !initialLoading && (
          <div className="text-center mb-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Searching experts...</p>
          </div>
        )}

        {!loading && (
          experts.length > 0 ? (
            <Row className="g-4 mb-5">
              {experts.map((expert) => (
                <Col key={expert.id} lg={4} md={6} sm={12}>
                  <ExpertCard
                    expert={expert}
                    currentUser={currentUser}
                    onEdit={(expert) => navigate(`/experts/${expert.id}/edit`)}
                    onDelete={handleDeleteExpert}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <FaUserTie />
              </div>
              <h3 className="empty-title">No experts found</h3>
              <p className="empty-message">
                {searchTerm || selectedCategory
                  ? "Try adjusting your search or filter criteria"
                  : "Be the first to create an expert profile!"}
              </p>
              {currentUser && (
                <Button variant="primary" onClick={handleCreateExpert}>
                  <FaPlus className="me-2" />
                  Create First Expert
                </Button>
              )}
            </div>
          )
        )}

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
      </Container>

      <style jsx>{`
        .experts-page-modern {
          min-height: 100vh;
          background: #819dde;
        }
        .experts-hero {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 2rem 0;
          color: white;
          border-radius: 10px;
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

        @media (max-width: 480px) {
          .hero-title {
            font-size: 1.8rem;
          }

          .hero-subtitle {
            font-size: 0.9rem;
          }

          .hero-stats {
            gap: 0.5rem;
          }

          .stat-number {
            font-size: 1.3rem;
          }

          .stat-label {
            font-size: 0.75rem;
          }

          .user-avatar {
            width: clamp(45px, 11vw, 50px);
            height: clamp(45px, 11vw, 50px);
            font-size: clamp(1.3rem, 3vw, 1.5rem);
          }

          .spinner-ring {
            width: clamp(50px, 12vw, 60px);
            height: clamp(50px, 12vw, 60px);
          }
        }
      `}</style>
    </div>
  );
};

export default Experts;
