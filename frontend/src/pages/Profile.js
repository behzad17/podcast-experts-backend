import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Button,
  ListGroup,
  Modal,
  Form,
  Badge,
  Toast,
  ToastContainer,
  Dropdown,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaFacebook, FaTwitter, FaLinkedin, FaShare } from "react-icons/fa";

const localizer = momentLocalizer(moment);

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [podcasts, setPodcasts] = useState([]);
  const [expertProfile, setExpertProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState(null);
  const [showExpertEditModal, setShowExpertEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPodcast, setDeletingPodcast] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [stats, setStats] = useState({
    totalViews: 0,
    totalBookmarks: 0,
    averageRating: 0,
  });
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    link: "",
    image: null,
  });
  const [expertFormData, setExpertFormData] = useState({
    name: "",
    expertise: "",
    experience_years: "",
    bio: "",
    website: "",
    social_media: "",
    profile_image: null,
  });
  const [sortBy, setSortBy] = useState("date");
  const [filterText, setFilterText] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchUserData();
    fetchStats();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const fetchStats = async () => {
    try {
      if (userData?.user_type === "podcaster") {
        const response = await api.get("/podcasts/stats/");
        setStats(response.data);
      } else if (userData?.user_type === "expert") {
        const response = await api.get("/experts/stats/");
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your profile");
        setLoading(false);
        return;
      }

      // Decode token to get user info
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      setUserData(tokenData);

      // Fetch user's content based on their type
      if (tokenData.user_type === "podcaster") {
        const podcastsResponse = await api.get("/podcasts/my-podcasts/");
        setPodcasts(podcastsResponse.data);
      } else if (tokenData.user_type === "expert") {
        const expertResponse = await api.get("/experts/my-profile/");
        setExpertProfile(expertResponse.data);
        setExpertFormData({
          name: expertResponse.data.name,
          expertise: expertResponse.data.expertise,
          experience_years: expertResponse.data.experience_years,
          bio: expertResponse.data.bio,
          website: expertResponse.data.website || "",
          social_media: expertResponse.data.social_media || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPodcast = (podcast) => {
    setEditingPodcast(podcast);
    setEditFormData({
      title: podcast.title,
      description: podcast.description,
      link: podcast.link || "",
      image: null,
    });
    setShowEditModal(true);
  };

  const handleEditExpertProfile = () => {
    setShowExpertEditModal(true);
  };

  const handleDeletePodcast = (podcast) => {
    setDeletingPodcast(podcast);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/podcasts/${deletingPodcast.id}/`);
      showNotification("Podcast deleted successfully");
      fetchUserData();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting podcast:", error);
      showNotification("Failed to delete podcast", "danger");
    }
  };

  const handleViewPublicProfile = () => {
    if (userData?.user_type === "expert") {
      navigate(`/experts/${expertProfile.id}`);
    } else {
      navigate(`/podcaster/${userData.user_id}`);
    }
  };

  const handlePodcastEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(editFormData).forEach((key) => {
        if (editFormData[key] !== null) {
          formData.append(key, editFormData[key]);
        }
      });

      await api.patch(`/podcasts/${editingPodcast.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showNotification("Podcast updated successfully");
      setShowEditModal(false);
      fetchUserData();
    } catch (error) {
      console.error("Error updating podcast:", error);
      showNotification("Failed to update podcast", "danger");
    }
  };

  const handleExpertEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(expertFormData).forEach((key) => {
        if (expertFormData[key] !== null) {
          formData.append(key, expertFormData[key]);
        }
      });

      await api.patch(`/experts/${expertProfile.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showNotification("Profile updated successfully");
      setShowExpertEditModal(false);
      fetchUserData();
    } catch (error) {
      console.error("Error updating expert profile:", error);
      showNotification("Failed to update profile", "danger");
    }
  };

  const handleCreateNew = () => {
    if (userData?.user_type === "podcaster") {
      navigate("/podcasts/create");
    }
  };

  const fetchComments = async (podcastId) => {
    try {
      const response = await api.get(`/podcasts/${podcastId}/comments/`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async (podcastId) => {
    try {
      await api.post(`/podcasts/${podcastId}/comments/`, {
        content: newComment,
      });
      showNotification("Comment added successfully");
      fetchComments(podcastId);
      setNewComment("");
    } catch (error) {
      showNotification("Failed to add comment", "danger");
    }
  };

  const handleShare = (platform, podcast) => {
    const url = `${window.location.origin}/podcasts/${podcast.id}`;
    const text = `Check out this podcast: ${podcast.title}`;

    let shareUrl;
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(text)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, "_blank");
  };

  const sortPodcasts = (podcasts) => {
    switch (sortBy) {
      case "title":
        return [...podcasts].sort((a, b) => a.title.localeCompare(b.title));
      case "views":
        return [...podcasts].sort((a, b) => (b.views || 0) - (a.views || 0));
      case "rating":
        return [...podcasts].sort(
          (a, b) => (b.average_rating || 0) - (a.average_rating || 0)
        );
      default:
        return podcasts;
    }
  };

  const filterPodcasts = (podcasts) => {
    return podcasts.filter(
      (podcast) =>
        podcast.title.toLowerCase().includes(filterText.toLowerCase()) ||
        podcast.description.toLowerCase().includes(filterText.toLowerCase())
    );
  };

  const getCalendarEvents = () => {
    return podcasts.map((podcast) => ({
      title: podcast.title,
      start: new Date(podcast.release_date),
      end: new Date(podcast.release_date),
      resource: podcast,
    }));
  };

  const renderSortingAndFiltering = () => (
    <div className="mb-3">
      <Row>
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>Search</InputGroup.Text>
            <FormControl
              placeholder="Search podcasts..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary">
              Sort by: {sortBy}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSortBy("date")}>
                Date
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSortBy("title")}>
                Title
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSortBy("views")}>
                Views
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSortBy("rating")}>
                Rating
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={4} className="text-end">
          <Button
            variant="outline-primary"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            {showCalendar ? "Hide Calendar" : "Show Calendar"}
          </Button>
        </Col>
      </Row>
    </div>
  );

  const renderSocialSharing = (podcast) => (
    <div className="mt-2 mb-2">
      <Button
        variant="outline-primary"
        size="sm"
        className="me-2"
        onClick={() => handleShare("facebook", podcast)}
      >
        <FaFacebook /> Share
      </Button>
      <Button
        variant="outline-info"
        size="sm"
        className="me-2"
        onClick={() => handleShare("twitter", podcast)}
      >
        <FaTwitter /> Tweet
      </Button>
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => handleShare("linkedin", podcast)}
      >
        <FaLinkedin /> Share
      </Button>
    </div>
  );

  const renderCalendarView = () => (
    <div className="mt-4" style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={getCalendarEvents()}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        onSelectEvent={(event) => handleEditPodcast(event.resource)}
      />
    </div>
  );

  const renderCommentsModal = () => (
    <Modal show={showComments} onHide={() => setShowComments(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Comments - {selectedPodcast?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup className="mb-3">
          {comments.map((comment) => (
            <ListGroup.Item key={comment.id}>
              <div className="d-flex justify-content-between">
                <strong>{comment.user_name}</strong>
                <small>{moment(comment.created_at).fromNow()}</small>
              </div>
              <p className="mb-0">{comment.content}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
        </Form.Group>
        <Button
          variant="primary"
          className="mt-2"
          onClick={() => handleAddComment(selectedPodcast.id)}
        >
          Add Comment
        </Button>
      </Modal.Body>
    </Modal>
  );

  const renderPodcastCard = (podcast) => (
    <Col key={podcast.id} md={4} className="mb-3">
      <Card>
        {podcast.image && (
          <Card.Img variant="top" src={podcast.image} alt={podcast.title} />
        )}
        <Card.Body>
          <Card.Title>{podcast.title}</Card.Title>
          <Card.Text>{podcast.description}</Card.Text>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <Badge bg="info" className="me-2">
                Views: {podcast.views || 0}
              </Badge>
              <Badge bg="success">
                Rating: {podcast.average_rating?.toFixed(1) || 0}
              </Badge>
            </div>
          </div>
          {renderSocialSharing(podcast)}
          <div className="d-flex justify-content-between align-items-center">
            <div>
              {podcast.link && (
                <Button
                  variant="primary"
                  href={podcast.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="me-2"
                >
                  Listen
                </Button>
              )}
              <Button
                variant="outline-primary"
                onClick={() => handleEditPodcast(podcast)}
                className="me-2"
              >
                Edit
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => handleDeletePodcast(podcast)}
                className="me-2"
              >
                Delete
              </Button>
              <Button
                variant="outline-info"
                onClick={() => {
                  setSelectedPodcast(podcast);
                  fetchComments(podcast.id);
                  setShowComments(true);
                }}
              >
                Comments
              </Button>
            </div>
            {!podcast.is_approved && (
              <Alert variant="warning" className="mb-0">
                Pending approval
              </Alert>
            )}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  if (loading) {
    return (
      <Container className="mt-4">
        <h2>Loading profile...</h2>
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
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={notification.show}
          bg={notification.type}
          autohide
          delay={3000}
        >
          <Toast.Body
            className={notification.type === "success" ? "text-white" : ""}
          >
            {notification.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Profile</h2>
        <Button variant="outline-primary" onClick={handleViewPublicProfile}>
          View Public Profile
        </Button>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>User Information</Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>User Type:</strong> {userData?.user_type}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>User ID:</strong> {userData?.user_id}
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Stats Card */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Statistics</Card.Title>
          <Row>
            <Col md={4}>
              <div className="text-center">
                <h3>{stats.totalViews}</h3>
                <p>Total Views</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <h3>{stats.totalBookmarks}</h3>
                <p>Total Bookmarks</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <h3>{stats.averageRating?.toFixed(1) || 0}</h3>
                <p>Average Rating</p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {userData?.user_type === "podcaster" && (
        <div>
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mt-4">My Podcasts</h3>
            <Button variant="primary" onClick={handleCreateNew}>
              Create New Podcast
            </Button>
          </div>
          {renderSortingAndFiltering()}
          {showCalendar ? (
            renderCalendarView()
          ) : (
            <Row>
              {filterPodcasts(sortPodcasts(podcasts)).map((podcast) =>
                renderPodcastCard(podcast)
              )}
            </Row>
          )}
          {podcasts.length === 0 && (
            <Alert variant="info">
              You haven't created any podcasts yet.
              <Button
                variant="link"
                className="ms-2"
                onClick={() => navigate("/podcasts/create")}
              >
                Create your first podcast
              </Button>
            </Alert>
          )}
        </div>
      )}

      {userData?.user_type === "expert" && expertProfile && (
        <div>
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mt-4">Expert Profile</h3>
            <Button variant="primary" onClick={handleEditExpertProfile}>
              Edit Profile
            </Button>
          </div>
          <Card>
            <Card.Body>
              <Card.Title>{expertProfile.name}</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Expertise:</strong> {expertProfile.expertise}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Experience:</strong> {expertProfile.experience_years}{" "}
                  years
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Bio:</strong> {expertProfile.bio}
                </ListGroup.Item>
                {expertProfile.website && (
                  <ListGroup.Item>
                    <strong>Website:</strong>{" "}
                    <a
                      href={expertProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {expertProfile.website}
                    </a>
                  </ListGroup.Item>
                )}
                {expertProfile.social_media && (
                  <ListGroup.Item>
                    <strong>Social Media:</strong> {expertProfile.social_media}
                  </ListGroup.Item>
                )}
              </ListGroup>
              {!expertProfile.is_approved && (
                <Alert variant="warning" className="mt-3">
                  Your expert profile is pending approval
                </Alert>
              )}
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Podcast</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{deletingPodcast?.title}"? This
          action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Podcast Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Podcast</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePodcastEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editFormData.title}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, title: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Link</Form.Label>
              <Form.Control
                type="url"
                value={editFormData.link}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, link: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) =>
                  setEditFormData({ ...editFormData, image: e.target.files[0] })
                }
                accept="image/*"
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Expert Profile Edit Modal */}
      <Modal
        show={showExpertEditModal}
        onHide={() => setShowExpertEditModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Expert Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleExpertEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={expertFormData.name}
                onChange={(e) =>
                  setExpertFormData({ ...expertFormData, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Expertise</Form.Label>
              <Form.Control
                type="text"
                value={expertFormData.expertise}
                onChange={(e) =>
                  setExpertFormData({
                    ...expertFormData,
                    expertise: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Experience (years)</Form.Label>
              <Form.Control
                type="number"
                value={expertFormData.experience_years}
                onChange={(e) =>
                  setExpertFormData({
                    ...expertFormData,
                    experience_years: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={expertFormData.bio}
                onChange={(e) =>
                  setExpertFormData({ ...expertFormData, bio: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Website</Form.Label>
              <Form.Control
                type="url"
                value={expertFormData.website}
                onChange={(e) =>
                  setExpertFormData({
                    ...expertFormData,
                    website: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Social Media</Form.Label>
              <Form.Control
                type="text"
                value={expertFormData.social_media}
                onChange={(e) =>
                  setExpertFormData({
                    ...expertFormData,
                    social_media: e.target.value,
                  })
                }
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={() => setShowExpertEditModal(false)}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      {renderCommentsModal()}
    </Container>
  );
};

export default Profile;
