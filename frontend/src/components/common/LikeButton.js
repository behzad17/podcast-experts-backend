import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { Button } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";

const LikeButton = ({ itemId, type, initialCount = 0, className = "" }) => {
  const [count, setCount] = useState(initialCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Map content types to correct API endpoints
  const getApiEndpoints = (contentType) => {
    switch (contentType) {
      case 'experts/profiles':
        return {
          reactions: `/experts/profiles/${itemId}/reactions/`,
          react: `/experts/profiles/${itemId}/react/`
        };
      case 'podcasts':
        // Podcasts use a different like system
        return {
          reactions: `/podcasts/${itemId}/likes/`,
          react: `/podcasts/${itemId}/like/`
        };
      default:
        return {
          reactions: `/${contentType}/${itemId}/reactions/`,
          react: `/${contentType}/${itemId}/react/`
        };
    }
  };

  useEffect(() => {
    setCount(initialCount);
    
    // Only check like status if user is authenticated
    if (!user) {
      setIsLiked(false);
      return;
    }

    // Check if the user has already liked this item
    const checkLikeStatus = async () => {
      try {
        const endpoints = getApiEndpoints(type);
        const response = await api.get(endpoints.reactions);
        
        // Handle different response structures
        let userReaction;
        if (type === 'experts/profiles') {
          userReaction = response.data.find(
            (reaction) => reaction.reaction_type === "like"
          );
        } else if (type === 'podcasts') {
          // For podcasts, check if user exists in likes array
          userReaction = response.data.current_user_liked;
        }
        
        setIsLiked(!!userReaction);
      } catch (error) {
        console.error("Error checking like status:", error);
        // Don't set isLiked to true on error
        setIsLiked(false);
      }
    };
    checkLikeStatus();
  }, [itemId, type, initialCount, user]);

  const handleLike = async () => {
    if (isLoading || !user) return;
    setIsLoading(true);
    try {
      const endpoints = getApiEndpoints(type);
      const response = await api.post(endpoints.react, { reaction_type: "like" });

      if (type === 'podcasts') {
        // Handle podcast like response
        if (response.data.status === "unliked") {
          setCount((prev) => prev - 1);
          setIsLiked(false);
        } else if (response.data.status === "liked") {
          setCount((prev) => prev + 1);
          setIsLiked(true);
        }
      } else {
        // Handle expert reaction response
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
      // If there's an error, revert the UI state
      setIsLiked(!isLiked);
      setCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show like button if user is not authenticated
  if (!user) {
    return (
      <Button
        variant="outline-secondary"
        disabled
        className={className}
        title="Please login to like content"
      >
        🤍 {count}
      </Button>
    );
  }

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
