import React from "react";
import { Card, Badge, Button, Row, Col } from "react-bootstrap";
import { FaStar, FaGlobe, FaShareAlt, FaEnvelope } from "react-icons/fa";

const ExpertDetails = ({ expert, currentUser, onEdit }) => {
  return (
    <Card className="mb-4">
      <Row>
        <Col md={4}>
          {(expert.profile_picture_display_url || expert.profile_picture_url) && (
            <img
              src={expert.profile_picture_display_url || expert.profile_picture_url}
              alt={expert.name}
              className="img-fluid rounded"
              style={{ maxWidth: "200px" }}
            />
          )}
        </Col>
        <Col md={8}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <Card.Title className="h2 mb-2">{expert.name}</Card.Title>
                <div className="mb-3">
                  <Badge bg="primary" className="me-2">
                    {expert.expertise}
                  </Badge>
                  <Badge bg="secondary">
                    {expert.experience_years} years experience
                  </Badge>
                </div>
                <div className="mb-3">
                  <FaStar className="text-warning me-1" />
                  <span className="me-2">
                    {expert.average_rating?.toFixed(1) || "No ratings"}
                  </span>
                  <span className="text-muted">
                    ({expert.ratings?.length || 0} reviews)
                  </span>
                </div>
              </div>
              <div>
                {currentUser && expert.user?.id === currentUser.user_id && (
                  <Button
                    variant="outline-primary"
                    onClick={() => onEdit(expert)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            <Card.Text className="mb-3">{expert.bio}</Card.Text>

            <div className="d-flex gap-3">
              {expert.website && (
                <Button
                  variant="outline-primary"
                  href={expert.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGlobe className="me-2" />
                  Website
                </Button>
              )}
              {expert.email && (
                <Button
                  variant="outline-primary"
                  href={`mailto:${expert.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaEnvelope className="me-2" />
                  Email
                </Button>
              )}
              <Button variant="outline-primary">
                <FaShareAlt className="me-2" />
                Share Profile
              </Button>
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default ExpertDetails;
