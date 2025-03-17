import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ExpertCard from "../components/experts/ExpertCard";
import ExpertEditModal from "../components/experts/ExpertEditModal";
import api from "../api/axios";

const Experts = () => {
  const [experts, setExperts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [editingExpert, setEditingExpert] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    expertise: "",
    experience_years: 0,
    bio: "",
    website: "",
    social_media: "",
    profile_image: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    if (token) {
      checkProfile();
    }
  }, []);

  const checkProfile = async () => {
    try {
      await api.get("/experts/my-profile/");
      setHasProfile(true);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setHasProfile(false);
      } else {
        console.error("Error checking profile:", error);
        setHasProfile(false);
      }
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const response = await api.get("/experts/");
      setExperts(response.data);
    } catch (error) {
      setError("Failed to load experts. Please try again later.");
      console.error("Error fetching experts:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEdit = (expert) => {
    setEditingExpert(expert);
    setFormData({
      name: expert.name,
      expertise: expert.expertise,
      experience_years: expert.experience_years,
      bio: expert.bio,
      website: expert.website || "",
      social_media: expert.social_media || "",
      profile_image: null,
    });
    setShowEditModal(true);
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await api.put(
        `/experts/${editingExpert.id}/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedExpert = response.data;
      setExperts((prev) =>
        prev.map((expert) =>
          expert.id === updatedExpert.id ? updatedExpert : expert
        )
      );
      setShowEditModal(false);
      setEditingExpert(null);
    } catch (error) {
      console.error("Error updating expert profile:", error);
      setError("Failed to update expert profile. Please try again.");
    }
  };

  const filteredExperts = experts.filter((expert) =>
    expert.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Experts</h1>
        {isAuthenticated && (
          <div>
            {hasProfile ? (
              <Button
                variant="primary"
                onClick={() => navigate("/expert-profile")}
              >
                My Expert Profile
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => navigate("/experts/create")}
              >
                Create Expert Profile
              </Button>
            )}
          </div>
        )}
      </div>

      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search experts..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {filteredExperts.map((expert) => (
          <Col key={expert.id} md={4} className="mb-4">
            <ExpertCard
              expert={expert}
              currentUser={JSON.parse(localStorage.getItem("user"))}
              onEdit={handleEdit}
            />
          </Col>
        ))}
      </Row>

      {filteredExperts.length === 0 && (
        <Alert variant="info">No experts found matching your search.</Alert>
      )}

      <ExpertEditModal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setEditingExpert(null);
        }}
        expert={editingExpert}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </Container>
  );
};

export default Experts;
