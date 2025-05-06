import React, { useState } from "react";
import { Container, Row, Col, Alert, Pagination, Form } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { getPodcasts } from "../../services/api";
import PodcastCard from "./PodcastCard";

const PodcastList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const pageSize = 9;

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["podcasts", currentPage],
    queryFn: () => getPodcasts({ page: currentPage, page_size: pageSize }),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    keepPreviousData: true, // Keep previous data while loading new data
    refetchOnMount: false,
    retry: 1, // Only retry once on failure
    onError: (error) => {
      console.error("Error fetching podcasts:", error);
    },
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when changing category
  };

  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          {error?.response?.data?.detail ||
            "Failed to load podcasts. Please try again later."}
        </Alert>
      </Container>
    );
  }

  const podcasts = Array.isArray(data) ? data : data?.results || [];
  const totalPages = Math.ceil((data?.count || 0) / pageSize);

  return (
    <Container className="mt-5">
      <h2 className="mb-4">All Podcasts</h2>

      <Row className="mb-4">
        <Col md={12}>
          <Form.Group>
            <Form.Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              aria-label="Select podcast category"
            >
              <option value="">All Categories</option>
              {data?.categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {podcasts.length === 0 ? (
        <Alert variant="info">No podcasts available.</Alert>
      ) : (
        <>
          <Row xs={1} md={2} lg={3} className="g-4">
            {podcasts.map((podcast) => (
              <Col key={podcast.id}>
                <PodcastCard podcast={podcast} />
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default PodcastList;
