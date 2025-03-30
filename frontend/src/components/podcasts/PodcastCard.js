import React from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PodcastCard = ({ podcast, currentUser, onEdit }) => {
  const navigate = useNavigate();

  const getImageUrl = (podcast) => {
    if (podcast.image) return podcast.image;
    // Use local placeholder image
    return "/logo192.png";
  };

  return (
    <Card>
      <Card.Img
        variant="top"
        src={getImageUrl(podcast)}
        alt={podcast.title}
        loading="lazy"
      />
      <Card.Body style={{ backgroundColor: "#F0F8FF" }}>
        <Card.Title>{podcast.title}</Card.Title>
        <Card.Text>{podcast.description}</Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            By {podcast.owner?.channel_name || "Unknown"}
          </small>
          <div>
            {podcast.link && (
              <a
                href={podcast.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary me-2"
              >
                Listen
              </a>
            )}
            <Button
              variant="outline-primary"
              className="me-2"
              onClick={() => navigate(`/podcasts/${podcast.id}`)}
            >
              View
            </Button>
            {currentUser && podcast.owner?.user === currentUser.id && (
              <Button variant="outline-primary" onClick={() => onEdit(podcast)}>
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
