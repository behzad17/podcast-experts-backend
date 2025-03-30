import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LikeButton from "../common/LikeButton";

const ExpertCard = ({ expert, currentUser, onEdit }) => {
  const navigate = useNavigate();

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
    if (expert.profile_image) return expert.profile_image;
    // Use local placeholder image
    return "/logo192.png";
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
            {currentUser && expert.user === currentUser.user_id && (
              <Button
                variant="outline-primary btn-sm"
                onClick={() => onEdit(expert)}
              >
                Edit
              </Button>
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
    </Card>
  );
};

export default ExpertCard;
