import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const ReactionButton = ({ contentType, contentId, initialReaction }) => {
  const [reaction, setReaction] = useState(initialReaction);
  const [count, setCount] = useState(0);
  const { getAuthHeaders } = useAuth();

  useEffect(() => {
    fetchReactionCount();
  }, [contentType, contentId]);

  const fetchReactionCount = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/ratings/count/?content_type=${contentType}&content_id=${contentId}`,
        getAuthHeaders()
      );
      setCount(response.data.count);
    } catch (error) {
      console.error("Error fetching reaction count:", error);
    }
  };

  const handleReaction = async (type) => {
    try {
      if (reaction === type) {
        // Remove reaction
        await axios.delete(
          `http://127.0.0.1:8000/api/ratings/remove/?content_type=${contentType}&content_id=${contentId}`,
          getAuthHeaders()
        );
        setReaction(null);
        setCount((prev) => prev - 1);
      } else {
        // Add or change reaction
        await axios.post(
          "http://127.0.0.1:8000/api/ratings/",
          {
            content_type: contentType,
            content_id: contentId,
            reaction_type: type,
          },
          getAuthHeaders()
        );
        setReaction(type);
        setCount((prev) => (reaction ? prev : prev + 1));
      }
    } catch (error) {
      console.error("Error handling reaction:", error);
    }
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <Button
        variant={reaction === "like" ? "primary" : "outline-primary"}
        size="sm"
        onClick={() => handleReaction("like")}
      >
        <FaThumbsUp className="me-1" />
        Like
      </Button>
      <Button
        variant={reaction === "dislike" ? "danger" : "outline-danger"}
        size="sm"
        onClick={() => handleReaction("dislike")}
      >
        <FaThumbsDown className="me-1" />
        Dislike
      </Button>
      <span className="text-muted">{count}</span>
    </div>
  );
};

export default ReactionButton;
