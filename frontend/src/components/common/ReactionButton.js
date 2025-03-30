import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import api from "../../api/axios";

const ReactionButton = ({ type, id, initialRating }) => {
  const [rating, setRating] = useState(initialRating);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRating = async (newRating) => {
    try {
      setLoading(true);
      setError(null);

      // If clicking the same rating, remove it
      if (rating === newRating) {
        await api.post("/ratings/", {
          podcast_id: id,
          score: null,
        });
        setRating(null);
        return;
      }

      // If changing rating, update it
      await api.post("/ratings/", {
        podcast_id: id,
        score: newRating,
      });

      setRating(newRating);
    } catch (err) {
      setError("Failed to update rating. Please try again.");
      console.error("Rating error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex gap-2 align-items-center">
      <Button
        variant={rating === 5 ? "primary" : "outline-primary"}
        onClick={() => handleRating(5)}
        disabled={loading}
        className="d-flex align-items-center gap-1"
      >
        <FaThumbsUp />
        Like
      </Button>
      <Button
        variant={rating === 1 ? "danger" : "outline-danger"}
        onClick={() => handleRating(1)}
        disabled={loading}
        className="d-flex align-items-center gap-1"
      >
        <FaThumbsDown />
        Dislike
      </Button>
      {error && <div className="text-danger">{error}</div>}
    </div>
  );
};

export default ReactionButton;
