import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Nav,
  Tab,
  TabContent,
  TabPane,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaShare,
  FaStar,
  FaBookmark,
  FaEye,
  FaSearch,
  FaTrash,
  FaCopy,
  FaTimes,
  FaFlag,
  FaSort,
} from "react-icons/fa";
import ExpertDetails from "../components/experts/ExpertDetails";
import ReviewCard from "../components/experts/ReviewCard";
import ExpertEditModal from "../components/experts/ExpertEditModal";

const localizer = momentLocalizer(moment);

const ExpertProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [stats, setStats] = useState({
    totalViews: 0,
    totalBookmarks: 0,
    averageRating: 0,
  });
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isRating, setIsRating] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [imageLoading, setImageLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [showCommentDeleteConfirm, setShowCommentDeleteConfirm] =
    useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [bioCharCount, setBioCharCount] = useState(0);
  const [selectedEventColor, setSelectedEventColor] = useState("#3174ad");
  const [commentSearch, setCommentSearch] = useState("");
  const [filteredComments, setFilteredComments] = useState([]);
  const [commentCharCount, setCommentCharCount] = useState(0);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [showClearEventsConfirm, setShowClearEventsConfirm] = useState(false);
  const [commentSort, setCommentSort] = useState("newest");
  const [showReportModal, setShowReportModal] = useState(false);
  const [commentToReport, setCommentToReport] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    fetchExpertData();
  }, [id]);

  useEffect(() => {
    if (expert?.id) {
      fetchStats();
      checkBookmarkStatus();
      fetchUserRating();
    }
  }, [expert?.id]);

  useEffect(() => {
    if (reviews.length > 0) {
      setFilteredComments(
        reviews.filter((review) =>
          review.content.toLowerCase().includes(commentSearch.toLowerCase())
        )
      );
    }
  }, [reviews, commentSearch]);

  const showNotificationHandler = (message, type = "success") => {
    setShowNotification({ show: true, message, type });
    setTimeout(
      () => setShowNotification({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const fetchStats = async () => {
    if (!expert?.id) return;
    try {
      const response = await api.get("/experts/stats/");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchExpertData = async () => {
    try {
      const [expertResponse, reviewsResponse] = await Promise.all([
        api.get(`/experts/${id}/`),
        api.get(`/experts/${id}/reviews/`),
      ]);

      if (!expertResponse.ok || !reviewsResponse.ok) {
        throw new Error("Failed to fetch expert data");
      }

      const expertData = await expertResponse.json();
      const reviewsData = await reviewsResponse.json();

      setExpert(expertData);
      setReviews(reviewsData);
      setFormData({
        name: expertData.name,
        expertise: expertData.expertise,
        experience_years: expertData.experience_years,
        bio: expertData.bio,
        website: expertData.website || "",
        social_media: expertData.social_media || "",
        profile_image: null,
      });
    } catch (error) {
      console.error("Error fetching expert data:", error);
      setError("Failed to load expert profile. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (expert) => {
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

      const response = await api.put(`/experts/${id}/`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update expert profile");
      }

      const updatedExpert = await response.json();
      setExpert(updatedExpert);
      setShowEditModal(false);
      showNotificationHandler("Profile updated successfully");
    } catch (error) {
      console.error("Error updating expert profile:", error);
      showNotificationHandler(
        "Failed to update expert profile. Please try again.",
        "danger"
      );
    }
  };

  const handleViewPublicProfile = () => {
    navigate(`/experts/${expert.id}`);
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setNewComment(value);
    setCommentCharCount(value.length);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (commentCharCount === 0) {
      showNotificationHandler("Please enter a comment", "warning");
      return;
    }
    try {
      setIsSubmittingComment(true);
      await api.post(`/experts/${expert.id}/add_comment/`, {
        content: newComment,
      });
      showNotificationHandler("Comment added successfully");
      setNewComment("");
      setCommentCharCount(0);
      fetchExpertData();
    } catch (error) {
      console.error("Error adding comment:", error);
      showNotificationHandler("Failed to add comment", "danger");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageLoaded(true);
  };

  const handleDeleteComment = (commentId) => {
    setCommentToDelete(commentId);
    setShowCommentDeleteConfirm(true);
  };

  const confirmCommentDelete = async () => {
    try {
      await api.delete(`/experts/${expert.id}/comments/${commentToDelete}/`);
      showNotificationHandler("Comment deleted successfully");
      fetchExpertData();
    } catch (error) {
      console.error("Error deleting comment:", error);
      showNotificationHandler("Failed to delete comment", "danger");
    } finally {
      setShowCommentDeleteConfirm(false);
      setCommentToDelete(null);
    }
  };

  const handleShare = async (platform) => {
    try {
      setIsSharing(true);
      const url = window.location.href;
      const text = `Check out ${expert.name}'s expert profile!`;
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
          shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
            url
          )}&title=${encodeURIComponent(text)}`;
          break;
        default:
          return;
      }

      window.open(shareUrl, "_blank", "width=600,height=400");
    } finally {
      setIsSharing(false);
    }
  };

  const checkBookmarkStatus = async () => {
    if (!expert?.id) return;
    try {
      const response = await api.get(`/experts/${expert.id}/`);
      setIsBookmarked(response.data.is_bookmarked);
    } catch (error) {
      console.error("Error checking bookmark status:", error);
    }
  };

  const fetchUserRating = async () => {
    if (!expert?.id) return;
    try {
      const response = await api.get(`/experts/${expert.id}/`);
      setUserRating(response.data.user_rating || 0);
    } catch (error) {
      console.error("Error fetching user rating:", error);
    }
  };

  const handleBookmark = async () => {
    try {
      setIsBookmarking(true);
      await api.post(`/experts/${expert.id}/bookmark/`);
      setIsBookmarked(!isBookmarked);
      showNotificationHandler(
        isBookmarked ? "Profile unbookmarked" : "Profile bookmarked"
      );
      fetchStats();
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      showNotificationHandler("Failed to update bookmark", "danger");
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleRate = async (rating) => {
    try {
      setIsRating(true);
      await api.post(`/experts/${expert.id}/rate/`, { rating });
      setUserRating(rating);
      showNotificationHandler("Rating updated successfully");
      fetchStats();
    } catch (error) {
      console.error("Error updating rating:", error);
      showNotificationHandler("Failed to update rating", "danger");
    } finally {
      setIsRating(false);
    }
  };

  const handleView = async () => {
    try {
      await api.post(`/experts/${expert.id}/view/`);
      fetchStats();
    } catch (error) {
      console.error("Error recording view:", error);
    }
  };

  const handleCalendarSelect = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleAddEvent = (event) => {
    const newEvent = {
      ...event,
      color: selectedEventColor,
      id: Date.now().toString(),
    };
    setCalendarEvents([...calendarEvents, newEvent]);
    showNotificationHandler("Event added successfully");
  };

  const handleDeleteEvent = (event) => {
    setCalendarEvents(calendarEvents.filter((e) => e.id !== event.id));
    showNotificationHandler("Event deleted successfully");
  };

  const handleEventDelete = (event) => {
    setSelectedEvent(event);
    setShowDeleteConfirm(true);
  };

  const confirmEventDelete = () => {
    handleDeleteEvent(selectedEvent);
    setShowDeleteConfirm(false);
  };

  const handleCopyProfileLink = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      showNotificationHandler("Profile link copied to clipboard");
    } catch (error) {
      console.error("Error copying link:", error);
      showNotificationHandler("Failed to copy link", "danger");
    }
  };

  const handleEditFormChange = () => {
    setHasUnsavedChanges(true);
  };

  const handleCloseEditModal = () => {
    if (hasUnsavedChanges) {
      setShowCloseConfirm(true);
    } else {
      setShowEditModal(false);
    }
  };

  const confirmCloseEditModal = () => {
    setShowEditModal(false);
    setShowCloseConfirm(false);
    setHasUnsavedChanges(false);
  };

  const handleClearAllEvents = () => {
    setShowClearEventsConfirm(true);
  };

  const confirmClearEvents = () => {
    setCalendarEvents([]);
    showNotificationHandler("All events cleared successfully");
    setShowClearEventsConfirm(false);
  };

  const handleReportComment = (commentId) => {
    setCommentToReport(commentId);
    setShowReportModal(true);
  };

  const submitReport = async () => {
    try {
      await api.post(
        `/experts/${expert.id}/comments/${commentToReport}/report/`,
        {
          reason: reportReason,
        }
      );
      showNotificationHandler("Comment reported successfully");
      setShowReportModal(false);
      setReportReason("");
    } catch (error) {
      console.error("Error reporting comment:", error);
      showNotificationHandler("Failed to report comment", "danger");
    }
  };

  const sortComments = (comments) => {
    switch (commentSort) {
      case "newest":
        return [...comments].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      case "oldest":
        return [...comments].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
      case "most_liked":
        return [...comments].sort((a, b) => (b.likes || 0) - (a.likes || 0));
      default:
        return comments;
    }
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <ToastContainer position="top-end">
        <Toast
          show={showNotification.show}
          onClose={() =>
            setShowNotification({ ...showNotification, show: false })
          }
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{showNotification.message}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Row>
        <Col md={4}>
          <Card className="mb-4">
        <Card.Body>
              <div className="text-center mb-4">
                {imageLoading && !imageLoaded && (
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
                <img
                  src={expert?.profile_image || "/default-avatar.png"}
                  alt="Profile"
                  className="rounded-circle"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    display: imageLoaded ? "block" : "none",
                  }}
                  onLoad={handleImageLoad}
                />
              </div>
              <h3 className="text-center">{expert?.name}</h3>
              <p className="text-center text-muted">{expert?.expertise}</p>
              <div className="d-flex justify-content-center mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <OverlayTrigger
                    key={star}
                    placement="top"
                    overlay={
                      <Tooltip>
                        Rate {star} star{star !== 1 ? "s" : ""}
                      </Tooltip>
                    }
                  >
                    <span>
                      <FaStar
                        className={`me-1 ${
                          star <= userRating ? "text-warning" : "text-muted"
                        }`}
                        style={{ cursor: isRating ? "not-allowed" : "pointer" }}
                        onClick={() => !isRating && handleRate(star)}
                      />
                    </span>
                  </OverlayTrigger>
                ))}
              </div>
              <div className="d-grid gap-2">
                <Button variant="primary" onClick={handleEdit}>
                  Edit Profile
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={handleViewPublicProfile}
                >
                  View Public Profile
                </Button>
                <Button
                  variant={isBookmarked ? "warning" : "outline-warning"}
                  onClick={handleBookmark}
                  disabled={isBookmarking}
                >
                  <FaBookmark className="me-2" />
                  {isBookmarking
                    ? "Updating..."
                    : isBookmarked
                    ? "Bookmarked"
                    : "Bookmark"}
                </Button>
              </div>
        </Card.Body>
      </Card>

          <Card className="mb-4">
            <Card.Header>Statistics</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <FaEye className="me-2" />
                Total Views: <Badge bg="primary">{stats.totalViews}</Badge>
              </ListGroup.Item>
              <ListGroup.Item>
                <FaBookmark className="me-2" />
                Total Bookmarks:{" "}
                <Badge bg="success">{stats.totalBookmarks}</Badge>
              </ListGroup.Item>
              <ListGroup.Item>
                <FaStar className="me-2" />
                Average Rating:{" "}
                <Badge bg="warning">
                  {stats.averageRating ? stats.averageRating.toFixed(1) : "0.0"}
                </Badge>
              </ListGroup.Item>
            </ListGroup>
          </Card>

          <Card>
            <Card.Header>Share Profile</Card.Header>
            <Card.Body>
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-around">
                  <Button
                    variant="outline-primary"
                    onClick={() => handleShare("facebook")}
                    disabled={isSharing}
                  >
                    <FaFacebook /> Facebook
                  </Button>
                  <Button
                    variant="outline-info"
                    onClick={() => handleShare("twitter")}
                    disabled={isSharing}
                  >
                    <FaTwitter /> Twitter
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={() => handleShare("linkedin")}
                    disabled={isSharing}
                  >
                    <FaLinkedin /> LinkedIn
                  </Button>
                </div>
                <Button
                  variant="outline-secondary"
                  onClick={handleCopyProfileLink}
                  className="mt-2"
                >
                  <FaCopy className="me-2" /> Copy Profile Link
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Header>
              <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
                <Nav.Item>
                  <Nav.Link eventKey="profile">Profile</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="calendar">Calendar</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="comments">Comments</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              <TabContent>
                <TabPane eventKey="profile" active={activeTab === "profile"}>
                  <h5>About</h5>
                  <p>{expert?.bio}</p>
                  <p>
                    <strong>Experience:</strong> {expert?.experience_years}{" "}
                    years
                  </p>
                  {expert?.website && (
                    <p>
                      <strong>Website:</strong>{" "}
                      <a
                        href={expert.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {expert.website}
                      </a>
                    </p>
                  )}
                  {expert?.social_media && (
                    <p>
                      <strong>Social Media:</strong> {expert.social_media}
                    </p>
                  )}
                </TabPane>

                <TabPane eventKey="calendar" active={activeTab === "calendar"}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Calendar</h5>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={handleClearAllEvents}
                    >
                      Clear All Events
                    </Button>
                  </div>
                  {calendarLoading ? (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <Calendar
                      localizer={localizer}
                      events={calendarEvents}
                      startAccessor="start"
                      endAccessor="end"
                      style={{ height: 400 }}
                      onSelectEvent={handleCalendarSelect}
                      selectable
                      onSelectSlot={handleCalendarSelect}
                      eventPropGetter={(event) => ({
                        style: {
                          backgroundColor: event.color || "#3174ad",
                          borderRadius: "5px",
                          opacity: 0.8,
                          color: "white",
                          border: "0px",
                          display: "block",
                          padding: "2px 5px",
                        },
                      })}
                      defaultView="month"
                      views={["month", "week", "day"]}
                      messages={{
                        next: "Next",
                        previous: "Previous",
                        today: "Today",
                        month: "Month",
                        week: "Week",
                        day: "Day",
                        agenda: "Agenda",
                        date: "Date",
                        time: "Time",
                        event: "Event",
                        noEventsInRange: "No events in this range",
                        allDay: "All Day",
                        more: "More",
                        showMore: (total) => `+${total} more`,
                        work_week: "Work Week",
                      }}
                    />
                  )}
                </TabPane>

                <TabPane eventKey="comments" active={activeTab === "comments"}>
                  <Form onSubmit={handleAddComment} className="mb-4">
        <Form.Group>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={handleCommentChange}
                        maxLength={500}
                      />
                      <div className="d-flex justify-content-end mt-1">
                        <small className="text-muted">
                          {commentCharCount}/500 characters
                        </small>
                      </div>
                    </Form.Group>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmittingComment || commentCharCount === 0}
                    >
                      {isSubmittingComment
                        ? "Adding Comment..."
                        : "Add Comment"}
                    </Button>
                  </Form>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Group className="mb-0">
                      <InputGroup>
                        <InputGroup.Text>
                          <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Search comments..."
                          value={commentSearch}
                          onChange={(e) => setCommentSearch(e.target.value)}
                        />
                        {commentSearch && (
                          <Button
                            variant="outline-secondary"
                            onClick={() => setCommentSearch("")}
                          >
                            <FaTimes />
                          </Button>
                        )}
                      </InputGroup>
                    </Form.Group>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary">
                        <FaSort className="me-2" /> Sort By
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setCommentSort("newest")}>
                          Newest First
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setCommentSort("oldest")}>
                          Oldest First
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => setCommentSort("most_liked")}
                        >
                          Most Liked
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>

                  {commentsLoading ? (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : filteredComments.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      {commentSearch
                        ? "No comments match your search."
                        : "No comments yet. Be the first to comment!"}
                    </div>
                  ) : (
                    <ListGroup>
                      {sortComments(filteredComments).map((comment) => (
                        <ListGroup.Item key={comment.id} className="mb-3">
                          <div className="d-flex">
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <strong>{comment.user.username}</strong>
                                <div>
                                  <small className="text-muted me-2">
                                    {new Date(
                                      comment.created_at
                                    ).toLocaleDateString()}
                                  </small>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    className="me-2"
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                  >
                                    <FaTrash />
                                  </Button>
                                  <Button
                                    variant="outline-warning"
                                    size="sm"
                                    onClick={() =>
                                      handleReportComment(comment.id)
                                    }
                                  >
                                    <FaFlag />
                                  </Button>
                                </div>
                              </div>
                              <p className="mb-0">{comment.content}</p>
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </TabPane>
              </TabContent>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  handleEditFormChange();
                }}
                isInvalid={!!formErrors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Expertise</Form.Label>
              <Form.Control
                type="text"
                value={formData.expertise}
                onChange={(e) => {
                  setFormData({ ...formData, expertise: e.target.value });
                  handleEditFormChange();
                }}
                isInvalid={!!formErrors.expertise}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.expertise}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Experience (years)</Form.Label>
              <Form.Control
                type="number"
                value={formData.experience_years}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    experience_years: e.target.value,
                  });
                  handleEditFormChange();
                }}
                isInvalid={!!formErrors.experience_years}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.experience_years}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.bio}
                onChange={(e) => {
                  setFormData({ ...formData, bio: e.target.value });
                  handleEditFormChange();
                }}
                isInvalid={!!formErrors.bio}
                maxLength={500}
              />
              <div className="d-flex justify-content-between">
                <Form.Control.Feedback type="invalid">
                  {formErrors.bio}
                </Form.Control.Feedback>
                <small className="text-muted">
                  {bioCharCount}/500 characters
                </small>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Website</Form.Label>
              <Form.Control
                type="url"
                value={formData.website}
                onChange={(e) => {
                  setFormData({ ...formData, website: e.target.value });
                  handleEditFormChange();
                }}
                isInvalid={!!formErrors.website}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.website}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Social Media</Form.Label>
              <Form.Control
                type="text"
                value={formData.social_media}
                onChange={(e) => {
                  setFormData({ ...formData, social_media: e.target.value });
                  handleEditFormChange();
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setFormData({ ...formData, profile_image: file });
                  handleEditFormChange();
                }}
                accept="image/*"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </Form.Group>
            <Button type="submit" variant="primary" disabled={isEditingProfile}>
              {isEditingProfile ? "Saving..." : "Save Changes"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showCloseConfirm} onHide={() => setShowCloseConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Unsaved Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have unsaved changes. Are you sure you want to close?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowCloseConfirm(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmCloseEditModal}>
            Close Without Saving
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedEvent?.id ? "Edit Event" : "Add Event"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              if (selectedEvent?.id) {
                handleDeleteEvent(selectedEvent);
              } else {
                handleAddEvent(selectedEvent);
              }
              setShowEventModal(false);
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
                value={selectedEvent?.title || ""}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, title: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={selectedEvent?.description || ""}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={
                  selectedEvent?.start
                    ? moment(selectedEvent.start).format("YYYY-MM-DDTHH:mm")
                    : ""
                }
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    start: new Date(e.target.value),
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={
                  selectedEvent?.end
                    ? moment(selectedEvent.end).format("YYYY-MM-DDTHH:mm")
                    : ""
                }
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    end: new Date(e.target.value),
                  })
                }
            required
          />
        </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Event Color</Form.Label>
              <Form.Control
                type="color"
                value={selectedEventColor}
                onChange={(e) => setSelectedEventColor(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button type="submit" variant="primary">
                {selectedEvent?.id ? "Delete Event" : "Add Event"}
              </Button>
              {selectedEvent?.id && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowEventModal(false)}
                >
                  Cancel
        </Button>
              )}
            </div>
      </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this event?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmEventDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showCommentDeleteConfirm}
        onHide={() => setShowCommentDeleteConfirm(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this comment?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowCommentDeleteConfirm(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmCommentDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showClearEventsConfirm}
        onHide={() => setShowClearEventsConfirm(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Clear All Events</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to clear all events? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowClearEventsConfirm(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmClearEvents}>
            Clear All Events
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Report Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Reason for Report</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Please provide details about why you're reporting this comment..."
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={submitReport}>
            Submit Report
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ExpertProfile;
