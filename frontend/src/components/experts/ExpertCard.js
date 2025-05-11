import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useReactions } from "../../contexts/ReactionsContext";
import { useViews } from "../../contexts/ViewsContext";

const ExpertCard = ({ expert }) => {
  const { user } = useAuth();
  const { handleReaction, userReaction } = useReactions();
  const { handleView } = useViews();

  const handleExpertClick = () => {
    if (user) {
      handleView("expert", expert.id);
    }
  };

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
    if (expert.profile_picture) return expert.profile_picture;
    // Use local placeholder image
    return "/logo192.png";
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={getImageUrl(expert)}
        alt={expert.name}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title>{expert.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {getFirstExpertise(expert.expertise)}
        </Card.Subtitle>
        <Card.Text>{limitWords(expert.bio, 100)}</Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Button
              variant={
                userReaction(expert.id) === "like"
                  ? "primary"
                  : "outline-primary"
              }
              size="sm"
              className="me-2"
              onClick={() => handleReaction("expert", expert.id, "like")}
              disabled={!user}
            >
              👍 {expert.likes_count}
            </Button>
            <Button
              variant={
                userReaction(expert.id) === "dislike"
                  ? "danger"
                  : "outline-danger"
              }
              size="sm"
              onClick={() => handleReaction("expert", expert.id, "dislike")}
              disabled={!user}
            >
              👎 {expert.dislikes_count}
            </Button>
          </div>
          <Link
            to={`/experts/${expert.id}`}
            className="btn btn-primary"
            onClick={handleExpertClick}
          >
            View Profile
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ExpertCard;
