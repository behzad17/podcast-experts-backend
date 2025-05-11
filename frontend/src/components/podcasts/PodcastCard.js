import React from "react";
import { Card, Button, Alert, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PodcastCard = ({ podcast, currentUser, onEdit }) => {
  const navigate = useNavigate();

  const getImageUrl = (podcast) => {
    if (podcast.image) return podcast.image;
    // Use local placeholder image
    return "/logo192.png";
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
              variant="outline-primary"
              size="sm"
              className="me-2"
              onClick={() => navigate(`/podcasts/${podcast.id}`)}
            >
              View
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
