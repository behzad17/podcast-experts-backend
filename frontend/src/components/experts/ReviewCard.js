import React from "react";
import { Card, Badge } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

const ReviewCard = ({ review }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h5 className="mb-1">{review.podcaster_name}</h5>
            <small className="text-muted">
              {new Date(review.created_at).toLocaleDateString()}
            </small>
          </div>
          <div>
            <Badge bg="primary">
              <FaStar className="me-1" />
              {review.rating}
            </Badge>
          </div>
        </div>
        <Card.Text>{review.comment}</Card.Text>
        {review.podcast_name && (
          <small className="text-muted">
            For podcast: {review.podcast_name}
          </small>
        )}
      </Card.Body>
    </Card>
  );
};

export default ReviewCard;
