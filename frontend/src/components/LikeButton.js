import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Button } from "react-bootstrap";

const LikeButton = ({ expertId, podcastId }) => {
  const [rating, setRating] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkRatingStatus();
  }, [expertId, podcastId]);

  const checkRatingStatus = async () => {
    try {
      const response = await api.get("/ratings/");
      const ratings = response.data;
      const userRating = ratings.find(
        (r) =>
          (expertId && r.expert === expertId) ||
          (podcastId && r.podcast === podcastId)
      );
      setRating(userRating?.score || null);
    } catch (error) {
      console.error("Error checking rating status:", error);
    }
  };

  const handleRating = async (score) => {
    setIsLoading(true);
    try {
      if (rating === score) {
        // Remove rating if clicking the same score
        await api.delete("/ratings/", {
          data: { expert: expertId, podcast: podcastId },
        });
        setRating(null);
      } else {
        // Update or create rating
        await api.post("/ratings/", {
          expert: expertId,
          podcast: podcastId,
          score: score,
        });
        setRating(score);
      }
    } catch (error) {
      console.error("Error updating rating:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((score) => (
        <Button
          key={score}
          variant={rating === score ? "primary" : "outline-primary"}
          onClick={() => handleRating(score)}
          disabled={isLoading}
          className="me-1"
        >
          {score}
        </Button>
      ))}
    </div>
  );
};

export default LikeButton;
