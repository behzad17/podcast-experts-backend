import React, { useState } from "react";
import { Card, Button, Alert, Badge, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { podcastApi } from "../../api/podcastApi";
import { toast } from "react-toastify";
import LikeButton from "../common/LikeButton";

const PodcastCard = ({ podcast, currentUser, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper function to limit text to 5 words
  const limitToFiveWords = (text) => {
    if (!text) return "";
    const words = text.split(' ');
    return words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');
  };

  const getImageUrl = (podcast) => {
    // Check if we have an image URL (Cloudinary URL)
    if (podcast.image_url && podcast.image_url.startsWith('http')) {
      return podcast.image_url;
    }
    
    // Check if we have an image field (Cloudinary URL)
    if (podcast.image && podcast.image.startsWith('http')) {
      return podcast.image;
    }
    
    // Fallback to local placeholder image
    return "/logo192.png";
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await podcastApi.deletePodcast(podcast.id);
      toast.success("Podcast deleted successfully");
      if (onDelete) {
        onDelete(podcast.id);
      }
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting podcast:", error);
      toast.error("Failed to delete podcast");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="h-100">
      <Card.Img
        variant="top"
        src={getImageUrl(podcast)}
        alt={podcast.title}
        loading="lazy"
        style={{ height: "200px", objectFit: "cover" }}
      />
      <Card.Body
        style={{
          backgroundColor: "#DCE2E8",
          height: "250px",
          overflow: "auto",
        }}
      >
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <Card.Title className="text-truncate">{podcast.title}</Card.Title>
            {podcast.category && (
              <Badge bg="info" pill className="mb-2">
                {podcast.category.name}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Like Button and Count */}
        <div className="mb-2">
          <LikeButton
            itemId={podcast.id}
            type="podcasts"
            initialCount={podcast.likes_count || 0}
            className="btn-sm"
          />
        </div>
        
        <Card.Text 
          className="text-truncate-3" 
          style={{ minHeight: "60px" }}
          title={podcast.description} // Show full description on hover
        >
          {limitToFiveWords(podcast.description)}
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <small className="text-muted">
            By {podcast.owner?.username || "Unknown"}
          </small>
          <div>
            {podcast.link && (
              <a
                href={podcast.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm me-2"
              >
                Listen
              </a>
            )}
            <Button
              variant="outline-primary"
              size="sm"
              className="me-2"
              onClick={() => navigate(`/podcasts/${podcast.id}`)}
            >
              View
            </Button>
            {currentUser && podcast.owner?.user === currentUser.id && (
              <>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(podcast)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
        {!podcast.is_approved && (
          <Alert variant="warning" className="mt-2 mb-0">
            Pending approval
          </Alert>
        )}
      </Card.Body>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Podcast</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the podcast <strong>"{podcast.title}"</strong>? 
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Podcast"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default PodcastCard;
