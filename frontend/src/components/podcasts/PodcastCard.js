import React, { useState } from "react";
import { Card, Button, Alert, Badge, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { podcastApi } from "../../api/podcastApi";
import { toast } from "react-toastify";
import LikeButton from "../common/LikeButton";
import {
  FaPlay,
  FaEdit,
  FaTrash,
  FaEye,
  FaMicrophone,
  FaClock,
  FaUser,
} from "react-icons/fa";

const PodcastCard = ({ podcast, currentUser, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper function to limit text to 5 words
  const limitToFiveWords = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.slice(0, 5).join(" ") + (words.length > 5 ? "..." : "");
  };

  const getImageUrl = (podcast) => {
    // Check if we have an image display URL (Cloudinary URL)
    if (podcast.image_display_url && podcast.image_display_url.startsWith("http")) {
      return podcast.image_display_url;
    }

    // Check if we have an image URL (Cloudinary URL)
    if (podcast.image_url && podcast.image_url.startsWith("http")) {
      return podcast.image_url;
    }

    // Check if we have an image field (Cloudinary URL)
    if (podcast.image && podcast.image.startsWith("http")) {
      return podcast.image;
    }

    // Fallback to local placeholder image
    return "/logo192.png";
  };

  const handleImageError = (e) => {
    // Set fallback image on error
    e.target.src = "/logo192.png";
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="podcast-card-modern">
      <Card className="h-100 podcast-card">
        {/* Image Container with Overlay */}
        <div className="podcast-image-container">
          <Card.Img
            variant="top"
            src={getImageUrl(podcast)}
            alt={podcast.title}
            loading="lazy"
            className="podcast-image"
            onError={handleImageError}
          />

          {/* Play Button Overlay */}
          <div className="play-overlay">
            <div className="play-button">
              <FaPlay />
            </div>
          </div>

          {/* Category Badge */}
          {podcast.category && (
            <div className="category-badge">
              <Badge bg="primary" className="category-tag">
                {podcast.category.name}
              </Badge>
            </div>
          )}

          {/* Approval Status */}
          {!podcast.is_approved && (
            <div className="approval-badge">
              <Badge bg="warning" className="approval-tag">
                Pending
              </Badge>
            </div>
          )}
        </div>

        {/* Card Body */}
        <Card.Body className="podcast-card-body">
          {/* Title and Creator */}
          <div className="podcast-header">
            <Card.Title className="podcast-title" title={podcast.title}>
              {podcast.title}
            </Card.Title>
            <div className="creator-info">
              <FaUser className="creator-icon" />
              <span className="creator-name">
                {podcast.owner?.username || "Unknown"}
              </span>
            </div>
          </div>

          {/* Description */}
          <Card.Text
            className="podcast-description"
            title={podcast.description}
          >
            {limitToFiveWords(podcast.description)}
          </Card.Text>

          {/* Metadata */}
          <div className="podcast-metadata">
            <div className="metadata-item">
              <FaClock className="metadata-icon" />
              <span className="metadata-text">
                {formatDate(podcast.created_at)}
              </span>
            </div>
            <div className="metadata-item">
              <FaMicrophone className="metadata-icon" />
              <span className="metadata-text">
                {podcast.category?.name || "Uncategorized"}
              </span>
            </div>
          </div>

          {/* Like Button */}
          <div className="like-section">
            <LikeButton
              itemId={podcast.id}
              type="podcasts"
              initialCount={podcast.likes_count || 0}
              className="like-button-modern"
            />
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            {podcast.link && (
              <Button
                variant="primary"
                size="sm"
                className="action-btn listen-btn"
                href={podcast.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaPlay className="me-1" />
                Listen
              </Button>
            )}

            <Button
              variant="outline-primary"
              size="sm"
              className="action-btn view-btn"
              onClick={() => navigate(`/podcasts/${podcast.id}`)}
            >
              <FaEye className="me-1" />
              View
            </Button>

            {/* Owner Actions */}
            {currentUser && podcast.owner?.user === currentUser.id && (
              <>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="action-btn edit-btn"
                  onClick={() => onEdit(podcast)}
                >
                  <FaEdit className="me-1" />
                  Edit
                </Button>

                <Button
                  variant="outline-danger"
                  size="sm"
                  className="action-btn delete-btn"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <FaTrash className="me-1" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Podcast</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the podcast{" "}
          <strong>"{podcast.title}"</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Podcast"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom CSS */}
      <style jsx>{`
        .podcast-card-modern {
          transition: all 0.3s ease;
        }

        .podcast-card-modern:hover {
          transform: translateY(-8px);
        }

        .podcast-card {
          border: none;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          background: white;
        }

        .podcast-card:hover {
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .podcast-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .podcast-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .podcast-card:hover .podcast-image {
          transform: scale(1.05);
        }

        .play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .podcast-card:hover .play-overlay {
          opacity: 1;
        }

        .play-button {
          width: 60px;
          height: 60px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .play-button:hover {
          transform: scale(1.1);
          background: linear-gradient(45deg, #764ba2, #667eea);
        }

        .category-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          z-index: 2;
        }

        .category-tag {
          border-radius: 20px;
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          font-weight: 600;
          background: linear-gradient(45deg, #667eea, #764ba2) !important;
          border: none;
        }

        .approval-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          z-index: 2;
        }

        .approval-tag {
          border-radius: 20px;
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          font-weight: 600;
          background: linear-gradient(45deg, #ffc107, #ff9800) !important;
          border: none;
          color: #333 !important;
        }

        .podcast-card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .podcast-header {
          margin-bottom: 1rem;
        }

        .podcast-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 0.5rem;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .creator-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .creator-icon {
          color: #667eea;
          font-size: 0.9rem;
        }

        .creator-name {
          color: #666;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .podcast-description {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.4;
          margin-bottom: 1rem;
          min-height: 40px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .podcast-metadata {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .metadata-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .metadata-icon {
          color: #667eea;
          font-size: 0.8rem;
          width: 14px;
        }

        .metadata-text {
          color: #888;
          font-size: 0.8rem;
        }

        .like-section {
          margin-bottom: 1rem;
        }

        .like-button-modern {
          width: 100%;
          border-radius: 25px;
          border: 2px solid #e9ecef;
          background: white;
          color: #667eea;
          transition: all 0.3s ease;
        }

        .like-button-modern:hover {
          border-color: #667eea;
          background: #667eea;
          color: white;
        }

        .action-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: auto;
        }

        .action-btn {
          border-radius: 20px;
          font-size: 0.8rem;
          padding: 0.5rem 1rem;
          font-weight: 600;
          transition: all 0.3s ease;
          border: 2px solid;
        }

        .listen-btn {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-color: #667eea;
          color: white;
        }

        .listen-btn:hover {
          background: linear-gradient(45deg, #764ba2, #667eea);
          border-color: #764ba2;
          transform: translateY(-2px);
        }

        .view-btn {
          border-color: #667eea;
          color: #667eea;
        }

        .view-btn:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
        }

        .edit-btn {
          border-color: #6c757d;
          color: #6c757d;
        }

        .edit-btn:hover {
          background: #6c757d;
          color: white;
          transform: translateY(-2px);
        }

        .delete-btn {
          border-color: #dc3545;
          color: #dc3545;
        }

        .delete-btn:hover {
          background: #dc3545;
          color: white;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .podcast-card-body {
            padding: 1rem;
          }

          .action-buttons {
            flex-direction: column;
          }

          .action-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default PodcastCard;
