import React, { useState } from "react";
import { Card, Button, Badge, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LikeButton from "../common/LikeButton";
import { expertApi } from "../../api/expertApi";
import { toast } from "react-toastify";

const ExpertCard = ({ expert, currentUser, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const limitWords = (text, wordCount) => {
    if (!text) return "";
    const words = text.split(" ");
    return (
      words.slice(0, wordCount).join(" ") +
      (words.length > wordCount ? "..." : "")
    );
  };

  const getFirstExpertise = (expertise) => {
    if (!expertise) return "";
    // If expertise is a string, split by comma and get first item
    if (typeof expertise === "string") {
      return expertise.split(",")[0].trim();
    }
    // If expertise is an array, return the first item
    if (Array.isArray(expertise)) return expertise[0] || "";
    return "";
  };

  const getImageUrl = (expert) => {
    // Prioritize profile_picture_display_url (new field for Cloudinary URL)
    if (expert.profile_picture_display_url && expert.profile_picture_display_url.startsWith('http')) {
      return expert.profile_picture_display_url;
    }
    
    // Fallback to profile_picture_url (existing Cloudinary URL field)
    if (expert.profile_picture_url && expert.profile_picture_url.startsWith('http')) {
      return expert.profile_picture_url;
    }
    
    // Fallback to profile_picture (if it somehow contains a URL, though it should be a file path now)
    if (expert.profile_picture && expert.profile_picture.startsWith('http')) {
      return expert.profile_picture;
    }
    
    // Default placeholder if no valid image URL is found
    return "/logo192.png";
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await expertApi.deleteExpertProfile(expert.id);
      toast.success("Expert profile deleted successfully");
      if (onDelete) {
        onDelete(expert.id);
      }
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting expert profile:", error);
      toast.error("Failed to delete expert profile");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="h-100 shadow-sm rounded-3">
      <div className="d-flex h-100">
        <div
          className="p-3"
          style={{
            width: "75%",
            borderRight: "2px solid #ced4da",
            backgroundColor: "#F0F8FF",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Card.Title className="h6 mb-2">{expert.name}</Card.Title>
            <Card.Text
              className="small text-muted mb-2"
              style={{ height: "3em", overflow: "hidden" }}
            >
              {limitWords(expert.bio, 10)}
            </Card.Text>
            <div className="mb-2">
              <Badge bg="primary">{getFirstExpertise(expert.expertise)}</Badge>
            </div>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <LikeButton
              itemId={expert.id}
              type="experts/profiles"
              initialCount={expert.likes_count}
              className="btn-sm"
            />
            <Button
              variant="outline-primary btn-sm"
              onClick={() => navigate(`/experts/${expert.id}`)}
            >
              View Profile
            </Button>
            {currentUser && expert.user?.id === currentUser.id && (
              <>
                <Button
                  variant="outline-primary btn-sm"
                  onClick={() => onEdit(expert)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline-danger btn-sm"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
        <div style={{ width: "25%", minWidth: "25%" }}>
          <Card.Img
            src={getImageUrl(expert)}
            alt={expert.name}
            style={{ height: "100%", objectFit: "cover" }}
            className="rounded-end-3"
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Expert Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the expert profile for{" "}
          <strong>{expert.name}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Profile"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default ExpertCard;
