import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "../../api/axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const LikeButton = ({ itemId, type, initialCount = 0, className = "" }) => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(`/${type}/${itemId}/reactions/`);
        const reactions = response.data;
        const userReaction = reactions.find(
          (r) => r.user === JSON.parse(localStorage.getItem("userData"))?.id
        );
        setLiked(userReaction?.reaction_type === "like");
        setCount(reactions.filter((r) => r.reaction_type === "like").length);
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [itemId, type]);

  const handleLike = async () => {
    try {
      const response = await axios.post(`/${type}/${itemId}/react/`, {
        reaction_type: liked ? "dislike" : "like",
      });
      if (response.data.status === "reaction removed") {
        setLiked(false);
        setCount((prev) => prev - 1);
      } else {
        setLiked(true);
        setCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <Button
      variant={liked ? "primary" : "outline-primary"}
      onClick={handleLike}
      className={`d-flex align-items-center gap-2 ${className}`}
    >
      {liked ? <FaHeart /> : <FaRegHeart />}
      <span>{count}</span>
    </Button>
  );
};

export default LikeButton;
