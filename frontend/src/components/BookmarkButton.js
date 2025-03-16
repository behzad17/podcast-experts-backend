import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Button } from "react-bootstrap";

const BookmarkButton = ({ expertId, podcastId }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkBookmarkStatus();
  }, [expertId, podcastId]);

  const checkBookmarkStatus = async () => {
    try {
      const response = await api.get("/bookmarks/");
      const bookmarks = response.data;
      setIsBookmarked(
        bookmarks.some(
          (bookmark) =>
            (expertId && bookmark.expert === expertId) ||
            (podcastId && bookmark.podcast === podcastId)
        )
      );
    } catch (error) {
      console.error("Error checking bookmark status:", error);
    }
  };

  const handleBookmark = async () => {
    setIsLoading(true);
    try {
      if (isBookmarked) {
        await api.delete("/bookmarks/", {
          data: { expert: expertId, podcast: podcastId },
        });
      } else {
        await api.post("/bookmarks/", {
          expert: expertId,
          podcast: podcastId,
        });
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isBookmarked ? "primary" : "outline-primary"}
      onClick={handleBookmark}
      disabled={isLoading}
    >
      {isBookmarked ? "Bookmarked" : "Bookmark"}
    </Button>
  );
};

export default BookmarkButton;
