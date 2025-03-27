import React from "react";
import "./ConversationList.css";

const ConversationList = ({
  conversations,
  onSelectConversation,
  selectedConversation,
}) => {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: "long" });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="conversation-list">
      {conversations.map((conversation) => (
        <div
          key={conversation.conversation_id}
          className={`conversation-item ${
            selectedConversation?.conversation_id ===
            conversation.conversation_id
              ? "selected"
              : ""
          }`}
          onClick={() => onSelectConversation(conversation)}
        >
          <div className="conversation-content">
            <div className="conversation-header">
              <span className="user-name">
                {conversation.other_user.username}
              </span>
              <span className="timestamp">
                {formatTimestamp(conversation.last_message?.timestamp)}
              </span>
            </div>
            <div className="conversation-preview">
              <span className="last-message">
                {conversation.last_message?.content || "No messages yet"}
              </span>
              {conversation.unread_count > 0 && (
                <span className="unread-badge">
                  {conversation.unread_count}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;
