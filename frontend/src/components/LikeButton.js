import React, { useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";

const LikeButton = ({ expertId }) => {
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8000/api/ratings/`,
        { expert: expertId, score: 5 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLiked(true);
    } catch (error) {
      console.error("Error liking expert:", error);
    }
  };

  return (
    <Button variant="outline-primary" onClick={handleLike} disabled={liked}>
      {liked ? "Liked!" : "Like"}
    </Button>
  );
};

export default LikeButton;
