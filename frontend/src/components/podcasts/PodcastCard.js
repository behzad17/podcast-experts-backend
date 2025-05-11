import React from "react";
import { Card, Button, Alert, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useReactions } from "../../contexts/ReactionsContext";
import { useViews } from "../../contexts/ViewsContext";

const PodcastCard = ({ podcast, currentUser, onEdit }) => {
  const { user } = useAuth();
  const { handleReaction, userReaction } = useReactions();
  const { handleView } = useViews();

  const getImageUrl = (podcast) => {
    if (podcast.image) return podcast.image;
    // Use local placeholder image
    return "/logo192.png";
  };

  const handlePodcastClick = () => {
    if (user) {
      handleView("podcast", podcast.id);
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
        <Card.Text className="text-truncate-3" style={{ minHeight: "60px" }}>
          {podcast.description}
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
              variant={
                userReaction(podcast.id) === "like"
                  ? "primary"
                  : "outline-primary"
              }
              size="sm"
              className="me-2"
              onClick={() => handleReaction("podcast", podcast.id, "like")}
              disabled={!user}
            >
              👍 {podcast.likes_count}
            </Button>
            <Button
              variant={
                userReaction(podcast.id) === "dislike"
                  ? "danger"
                  : "outline-danger"
              }
              size="sm"
              onClick={() => handleReaction("podcast", podcast.id, "dislike")}
              disabled={!user}
            >
              👎 {podcast.dislikes_count}
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              className="me-2"
              onClick={() => handlePodcastClick()}
            >
              Listen Now
            </Button>
            {currentUser && podcast.owner?.user === currentUser.id && (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onEdit(podcast)}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
        {!podcast.is_approved && (
          <Alert variant="warning" className="mt-2 mb-0">
            Pending approval
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default PodcastCard;
