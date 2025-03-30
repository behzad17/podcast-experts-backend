import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { Button } from "react-bootstrap";

const LikeButton = ({ itemId, type, initialCount = 0, className = "" }) => {
  const [count, setCount] = useState(initialCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  const handleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const endpoint =
        type === "podcasts/podcasts"
          ? `/podcasts/podcasts/${itemId}/like/`
          : `/experts/profiles/${itemId}/react/`;

      const response = await api.post(
        endpoint,
        type === "experts/profiles"
          ? { reaction_type: isLiked ? "dislike" : "like" }
          : {}
      );

      if (type === "podcasts/podcasts") {
        if (response.data.status === "liked") {
          setCount((prev) => prev + 1);
          setIsLiked(true);
        } else {
          setCount((prev) => prev - 1);
          setIsLiked(false);
        }
      } else {
        // For experts, the response indicates if the reaction was removed
        if (response.data.status === "reaction removed") {
          setCount((prev) => prev - 1);
          setIsLiked(false);
        } else {
          setCount((prev) => prev + 1);
          setIsLiked(true);
        }
      }
    } catch (error) {
      console.error("Error updating like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isLiked ? "primary" : "outline-primary"}
      onClick={handleLike}
      disabled={isLoading}
      className={className}
    >
      {isLiked ? "❤️" : "🤍"} {count}
    </Button>
  );
};

export default LikeButton;
