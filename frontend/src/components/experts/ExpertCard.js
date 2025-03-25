import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const ExpertCard = ({ expert, currentUser, onEdit }) => {
  const navigate = useNavigate();

  return (
    <Card className="h-100">
      {expert.profile_image && (
        <Card.Img
          variant="top"
          src={expert.profile_image}
          alt={expert.name}
          style={{ height: "200px", objectFit: "cover" }}
          loading="lazy"
        />
      )}
      <Card.Body>
        <Card.Title>{expert.name}</Card.Title>
        <Card.Text>{expert.bio}</Card.Text>
        <div className="mb-2">
          <Badge bg="primary" className="me-2">
            {expert.expertise}
          </Badge>
          <Badge bg="secondary">
            {expert.experience_years} years experience
          </Badge>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="text-muted">
            <FaStar className="text-warning me-1" />
            {expert.rating?.toFixed(1) || "No ratings"}
          </div>
          <div>
            <Button
              variant="outline-primary"
              className="me-2"
              onClick={() => navigate(`/experts/${expert.id}`)}
            >
              View Profile
            </Button>
            {currentUser && expert.user === currentUser.user_id && (
              <Button variant="outline-primary" onClick={() => onEdit(expert)}>
                Edit
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ExpertCard;
