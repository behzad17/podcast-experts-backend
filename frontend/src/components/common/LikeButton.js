import React from "react";
import { Button } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const LikeButton = ({ isLiked, onClick, size = "sm" }) => {
  return (
    <Button
      variant={isLiked ? "danger" : "outline-danger"}
      size={size}
      onClick={onClick}
      className="d-flex align-items-center gap-1"
    >
      {isLiked ? <FaHeart /> : <FaRegHeart />}
      {isLiked ? "Liked" : "Like"}
    </Button>
  );
};

export default LikeButton;
