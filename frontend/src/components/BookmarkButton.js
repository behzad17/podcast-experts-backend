import React, { useState } from "react";
import { Button } from "react-bootstrap";

const BookmarkButton = ({ expertId }) => {
  const [bookmarked, setBookmarked] = useState(false);

  const handleBookmark = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/bookmarks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expert: expertId }),
      });

      if (response.ok) {
        setBookmarked(!bookmarked);
      } else {
        console.error("Failed to bookmark");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Button onClick={handleBookmark} variant={bookmarked ? "success" : "outline-primary"}>
      {bookmarked ? "Bookmarked" : "Bookmark"}
    </Button>
  );
};

export default BookmarkButton;
