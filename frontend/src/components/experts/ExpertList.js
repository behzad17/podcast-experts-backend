import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getExperts } from "../../services/api";

function ExpertList() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["experts", currentPage],
    queryFn: () => getExperts({ page: currentPage, page_size: pageSize }),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    keepPreviousData: true, // Keep previous data while loading new data
    refetchOnMount: false,
    retry: 1, // Only retry once on failure
    onError: (error) => {
      console.error("Error fetching experts:", error);
    },
  });

  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          {error?.response?.data?.detail ||
            "Failed to load experts. Please try again later."}
        </Alert>
      </Container>
    );
  }

  const experts = Array.isArray(data) ? data : data?.results || [];
  const totalPages = Math.ceil((data?.count || 0) / pageSize);

  return (
    <Container className="my-4">
      <h2 className="mb-4">Podcast Experts</h2>
      {experts.length === 0 ? (
        <Alert variant="info">No experts available.</Alert>
      ) : (
        <>
          <Row xs={1} md={2} lg={3} className="g-4">
            {experts.map((expert) => (
              <Col key={expert.id}>
                <Card className="h-100">
                  <Card.Img
                    variant="top"
                    src={
                      expert.profile_image || "https://via.placeholder.com/150"
                    }
                    alt={expert.user.username}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{expert.user.username}</Card.Title>
                    <Card.Text>{expert.bio}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Expertise: {expert.expertise}
                      </small>
                      <Button
                        variant="primary"
                        as={Link}
                        to={`/experts/${expert.id}`}
                      >
                        View Profile
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Button
                variant="outline-primary"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="me-2"
              >
                Previous
              </Button>
              <span className="align-self-center mx-3">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline-primary"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="ms-2"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
}

export default ExpertList;
