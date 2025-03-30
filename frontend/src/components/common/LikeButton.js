import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "../../api/axios";

const LikeButton = ({ itemId, type, initialCount = 0 }) => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(`/${type}/${itemId}/likes_count/`);
        setCount(response.data.count);
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [itemId, type]);

  const handleLike = async () => {
    try {
      const response = await axios.post(`/${type}/${itemId}/like/`);
      if (response.data.status === "liked") {
        setLiked(true);
        setCount((prev) => prev + 1);
      } else {
        setLiked(false);
        setCount((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <Button
      variant={liked ? "primary" : "outline-primary"}
      onClick={handleLike}
      className="d-flex align-items-center gap-2"
    >
      <i className={`bi bi-heart${liked ? "-fill" : ""}`}></i>
      <span>{count}</span>
    </Button>
  );
};

export default LikeButton;
