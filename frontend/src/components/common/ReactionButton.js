import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import axios from "axios";

const ReactionButton = ({ type, id, initialReaction }) => {
  const [reaction, setReaction] = useState(initialReaction);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReaction = async (newReaction) => {
    try {
      setLoading(true);
      setError(null);

      // If clicking the same reaction, remove it
      if (reaction === newReaction) {
        await axios.delete(`/api/${type}/reactions/${id}/`);
        setReaction(null);
        return;
      }

      // If changing reaction, update it
      const response = await axios.post(`/api/${type}/reactions/`, {
        [`${type}`]: id,
        reaction: newReaction,
      });

      setReaction(newReaction);
    } catch (err) {
      setError("Failed to update reaction. Please try again.");
      console.error("Reaction error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex gap-2 align-items-center">
      <Button
        variant={reaction === "like" ? "primary" : "outline-primary"}
        onClick={() => handleReaction("like")}
        disabled={loading}
        className="d-flex align-items-center gap-1"
      >
        <FaThumbsUp />
        Like
      </Button>
      <Button
        variant={reaction === "dislike" ? "danger" : "outline-danger"}
        onClick={() => handleReaction("dislike")}
        disabled={loading}
        className="d-flex align-items-center gap-1"
      >
        <FaThumbsDown />
        Dislike
      </Button>
      {error && <div className="text-danger small">{error}</div>}
    </div>
  );
};

export default ReactionButton;
