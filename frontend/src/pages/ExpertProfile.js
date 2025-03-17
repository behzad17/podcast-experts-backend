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

const localizer = momentLocalizer(moment);

const ExpertProfile = () => {
  const navigate = useNavigate();
  const [expertProfile, setExpertProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
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
    name: "",
    expertise: "",
    experience_years: "",
    bio: "",
    website: "",
    social_media: "",
    profile_image: null,
  });
  const [activeTab, setActiveTab] = useState("profile");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isRating, setIsRating] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUserData = JSON.parse(localStorage.getItem("userData"));

        if (!token || !storedUserData) {
          setError("Please log in to view your profile");
          setLoading(false);
          return;
        }

        const expertResponse = await api.get("/experts/my-profile/");
        if (expertResponse.data) {
          setExpertProfile(expertResponse.data);
          setEditFormData({
            name: expertResponse.data.name,
            expertise: expertResponse.data.expertise,
            experience_years: expertResponse.data.experience_years,
            bio: expertResponse.data.bio,
            website: expertResponse.data.website || "",
            social_media: expertResponse.data.social_media || "",
          });
          // Only fetch these after we have the expert profile
          await Promise.all([
            fetchStats(),
            checkBookmarkStatus(),
            fetchUserRating(),
          ]);
        }
      } catch (error) {
        console.error("Error fetching expert data:", error);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === "comments" && expertProfile?.id) {
      fetchComments();
    }
  }, [activeTab, expertProfile?.id]);

  useEffect(() => {
    if (comments.length > 0) {
      setFilteredComments(
        comments.filter((comment) =>
          comment.content.toLowerCase().includes(commentSearch.toLowerCase())
        )
      );
    }
  }, [comments, commentSearch]);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const fetchStats = async () => {
    if (!expertProfile?.id) return;
    try {
      const response = await api.get("/experts/stats/");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchExpertData = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUserData = JSON.parse(localStorage.getItem("userData"));

      if (!token || !storedUserData) {
        setError("Please log in to view your profile");
        setLoading(false);
        return;
      }

      const expertResponse = await api.get("/experts/my-profile/");
      setExpertProfile(expertResponse.data);
      setEditFormData({
        name: expertResponse.data.name,
        expertise: expertResponse.data.expertise,
        experience_years: expertResponse.data.experience_years,
        bio: expertResponse.data.bio,
        website: expertResponse.data.website || "",
        social_media: expertResponse.data.social_media || "",
      });
    } catch (error) {
      console.error("Error fetching expert data:", error);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!editFormData.name.trim()) errors.name = "Name is required";
    if (!editFormData.expertise.trim())
      errors.expertise = "Expertise is required";
    if (!editFormData.experience_years)
      errors.experience_years = "Experience is required";
    if (!editFormData.bio.trim()) errors.bio = "Bio is required";
    if (editFormData.website && !editFormData.website.match(/^https?:\/\/.+/)) {
      errors.website = "Please enter a valid URL";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFormData({ ...editFormData, profile_image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBioChange = (e) => {
    const value = e.target.value;
    setEditFormData({ ...editFormData, bio: value });
    setBioCharCount(value.length);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsEditingProfile(true);
      const formData = new FormData();
      Object.keys(editFormData).forEach((key) => {
        if (editFormData[key] !== null) {
          formData.append(key, editFormData[key]);
        }
      });

      await api.patch(`/experts/${expertProfile.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showNotification("Profile updated successfully");
      setShowEditModal(false);
      fetchExpertData();
    } catch (error) {
      console.error("Error updating profile:", error);
      showNotification("Failed to update profile", "danger");
    } finally {
      setIsEditingProfile(false);
    }
  };

  const handleViewPublicProfile = () => {
    navigate(`/experts/${expertProfile.id}`);
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setNewComment(value);
    setCommentCharCount(value.length);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (commentCharCount === 0) {
      showNotification("Please enter a comment", "warning");
      return;
    }
    try {
      setIsSubmittingComment(true);
      await api.post(`/experts/${expertProfile.id}/add_comment/`, {
        content: newComment,
      });
      showNotification("Comment added successfully");
      setNewComment("");
      setCommentCharCount(0);
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
      showNotification("Failed to add comment", "danger");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await api.get(`/experts/${expertProfile.id}/`);
      setComments(response.data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      showNotification("Failed to load comments", "danger");
    } finally {
      setCommentsLoading(false);
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
      await api.delete(
        `/experts/${expertProfile.id}/comments/${commentToDelete}/`
      );
      showNotification("Comment deleted successfully");
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      showNotification("Failed to delete comment", "danger");
    } finally {
      setShowCommentDeleteConfirm(false);
      setCommentToDelete(null);
    }
  };

  const handleShare = async (platform) => {
    try {
      setIsSharing(true);
      const url = window.location.href;
      const text = `Check out ${expertProfile.name}'s expert profile!`;
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
    if (!expertProfile?.id) return;
    try {
      const response = await api.get(`/experts/${expertProfile.id}/`);
      setIsBookmarked(response.data.is_bookmarked);
    } catch (error) {
      console.error("Error checking bookmark status:", error);
    }
  };

  const fetchUserRating = async () => {
    if (!expertProfile?.id) return;
    try {
      const response = await api.get(`/experts/${expertProfile.id}/`);
      setUserRating(response.data.user_rating || 0);
    } catch (error) {
      console.error("Error fetching user rating:", error);
    }
  };

  const handleBookmark = async () => {
    try {
      setIsBookmarking(true);
      await api.post(`/experts/${expertProfile.id}/bookmark/`);
      setIsBookmarked(!isBookmarked);
      showNotification(
        isBookmarked ? "Profile unbookmarked" : "Profile bookmarked"
      );
      fetchStats();
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      showNotification("Failed to update bookmark", "danger");
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleRate = async (rating) => {
    try {
      setIsRating(true);
      await api.post(`/experts/${expertProfile.id}/rate/`, { rating });
      setUserRating(rating);
      showNotification("Rating updated successfully");
      fetchStats();
    } catch (error) {
      console.error("Error updating rating:", error);
      showNotification("Failed to update rating", "danger");
    } finally {
      setIsRating(false);
    }
  };

  const handleView = async () => {
    try {
      await api.post(`/experts/${expertProfile.id}/view/`);
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
    showNotification("Event added successfully");
  };

  const handleDeleteEvent = (event) => {
    setCalendarEvents(calendarEvents.filter((e) => e.id !== event.id));
    showNotification("Event deleted successfully");
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
      showNotification("Profile link copied to clipboard");
    } catch (error) {
      console.error("Error copying link:", error);
      showNotification("Failed to copy link", "danger");
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
    showNotification("All events cleared successfully");
    setShowClearEventsConfirm(false);
  };

  const handleReportComment = (commentId) => {
    setCommentToReport(commentId);
    setShowReportModal(true);
  };

  const submitReport = async () => {
    try {
      await api.post(
        `/experts/${expertProfile.id}/comments/${commentToReport}/report/`,
        {
          reason: reportReason,
        }
      );
      showNotification("Comment reported successfully");
      setShowReportModal(false);
      setReportReason("");
    } catch (error) {
      console.error("Error reporting comment:", error);
      showNotification("Failed to report comment", "danger");
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
          show={notification.show}
          onClose={() => setNotification({ ...notification, show: false })}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{notification.message}</Toast.Body>
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
                  src={expertProfile?.profile_image || "/default-avatar.png"}
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
              <h3 className="text-center">{expertProfile?.name}</h3>
              <p className="text-center text-muted">
                {expertProfile?.expertise}
              </p>
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
                <Button variant="primary" onClick={handleEditProfile}>
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
                  <p>{expertProfile?.bio}</p>
                  <p>
                    <strong>Experience:</strong>{" "}
                    {expertProfile?.experience_years} years
                  </p>
                  {expertProfile?.website && (
                    <p>
                      <strong>Website:</strong>{" "}
                      <a
                        href={expertProfile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {expertProfile.website}
                      </a>
                    </p>
                  )}
                  {expertProfile?.social_media && (
                    <p>
                      <strong>Social Media:</strong>{" "}
                      {expertProfile.social_media}
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
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editFormData.name}
                onChange={(e) => {
                  setEditFormData({ ...editFormData, name: e.target.value });
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
                value={editFormData.expertise}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    expertise: e.target.value,
                  })
                }
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
                value={editFormData.experience_years}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    experience_years: e.target.value,
                  })
                }
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
                value={editFormData.bio}
                onChange={handleBioChange}
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
                value={editFormData.website}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, website: e.target.value })
                }
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
                value={editFormData.social_media}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    social_media: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageChange}
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
