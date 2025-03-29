import React, { useState, useEffect, useCallback } from "react";
import { Button } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import api from "../../api/axios";

const RatingButton = ({ type, id, initialRating }) => {
  const [rating, setRating] = useState(initialRating);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update rating when initialRating changes
  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleRating = useCallback(
    async (newRating) => {
      try {
        setLoading(true);
        setError(null);

        // If clicking the same rating, remove it
        if (rating === newRating) {
          // Get all ratings for this podcast/expert
          const response = await api.get(`/ratings/`);
          const ratings = response.data;

          // Find the rating for this podcast/expert
          const existingRating = ratings.find(
            (r) =>
              (type === "podcast" && r.podcast === id) ||
              (type === "expert" && r.expert === id)
          );

          if (existingRating) {
            await api.delete(`/ratings/${existingRating.id}/`);
            setRating(null);
          }
          return;
        }

        // Create new rating
        const data = {
          score: newRating,
          [type]: id, // This will set either podcast or expert
        };

        console.log("Sending rating data:", data); // Debug log
        const response = await api.post("/ratings/", data);
        if (response.data) {
          setRating(newRating);
        }
      } catch (err) {
        console.error("Rating error:", err);
        const errorMessage =
          err.response?.data?.detail ||
          err.response?.data?.error ||
          err.message ||
          "Failed to update rating. Please try again.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [rating, type, id]
  );

  return (
    <div className="d-flex gap-2 align-items-center">
      {[1, 2, 3, 4, 5].map((score) => (
        <Button
          key={score}
          variant={rating === score ? "primary" : "outline-primary"}
          onClick={() => handleRating(score)}
          disabled={loading}
          className="d-flex align-items-center gap-1"
        >
          <FaStar />
          {score}
        </Button>
      ))}
      {error && <div className="text-danger small">{error}</div>}
    </div>
  );
};

export default RatingButton;
