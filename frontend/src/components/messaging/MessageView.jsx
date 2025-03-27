import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./MessageView.css";

const MessageView = ({ conversation }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    scrollToBottom();
  }, [conversation.conversation_id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get("/api/messages/", {
        params: {
          conversation_id: conversation.conversation_id,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessages(response.data.results);
      markMessagesAsRead();
    } catch (err) {
      setError("Failed to load messages");
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await axios.post("/api/messages/mark_all_read/", null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment(file);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !attachment) return;

    try {
      const formData = new FormData();
      formData.append("receiver_id", conversation.other_user.id);
      if (newMessage.trim()) {
        formData.append("content", newMessage.trim());
      }
      if (attachment) {
        formData.append("attachment", attachment);
      }

      const response = await axios.post("/api/messages/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessages([...messages, response.data]);
      setNewMessage("");
      setAttachment(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError("Failed to send message");
      console.error("Error sending message:", err);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderAttachment = (message) => {
    if (!message.attachment) return null;

    const isImage = message.attachment_type?.startsWith("image/");
    const isAudio = message.attachment_type?.startsWith("audio/");
    const isVideo = message.attachment_type?.startsWith("video/");

    if (isImage) {
      return (
        <img
          src={message.attachment}
          alt={message.attachment_name}
          className="message-attachment image"
        />
      );
    }

    if (isAudio) {
      return (
        <audio controls className="message-attachment audio">
          <source src={message.attachment} type={message.attachment_type} />
          Your browser does not support the audio element.
        </audio>
      );
    }

    if (isVideo) {
      return (
        <video controls className="message-attachment video">
          <source src={message.attachment} type={message.attachment_type} />
          Your browser does not support the video element.
        </video>
      );
    }

    return (
      <a
        href={message.attachment}
        target="_blank"
        rel="noopener noreferrer"
        className="message-attachment file"
      >
        <i className="fas fa-file"></i>
        <span>{message.attachment_name}</span>
      </a>
    );
  };

  if (loading) return <div className="loading">Loading messages...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="message-view">
      <div className="message-header">
        <h2>{conversation.other_user.username}</h2>
      </div>
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.sender.id === conversation.other_user.id
                ? "received"
                : "sent"
            }`}
          >
            <div className="message-content">
              {message.content && <p>{message.content}</p>}
              {renderAttachment(message)}
              <span className="timestamp">
                {formatTimestamp(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="file-input"
          id="file-input"
        />
        <label htmlFor="file-input" className="file-input-label">
          <i className="fas fa-paperclip"></i>
        </label>
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageView;
