import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { Button } from "react-bootstrap";

const LikeButton = ({ itemId, type, initialCount = 0, className = "" }) => {
  const [count, setCount] = useState(initialCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCount(initialCount);
    // Check if the user has already liked this item
    const checkLikeStatus = async () => {
      try {
        const response = await api.get(`/${type}/${itemId}/reactions/`);
        const userReaction = response.data.find(
          (reaction) => reaction.reaction_type === "like"
        );
        setIsLiked(!!userReaction);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };
    checkLikeStatus();
  }, [itemId, type, initialCount]);

  const handleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const endpoint = `/${type}/${itemId}/react/`;
      const response = await api.post(endpoint, { reaction_type: "like" });

      if (response.data.status === "reaction removed") {
        setCount((prev) => prev - 1);
        setIsLiked(false);
      } else {
        setCount((prev) => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error updating like:", error);
      // If there's an error, revert the UI state
      setIsLiked(!isLiked);
      setCount((prev) => (isLiked ? prev - 1 : prev + 1));
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
