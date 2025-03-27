import React, { useState, useCallback, useEffect, useRef } from "react";
import ConversationList from "./ConversationList";
import MessageView from "./MessageView";
import { Button, Modal, Form } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import api from "../../api/axios";
import "./MessagingLayout.css";

const MessagingLayout = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [conversations, setConversations] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  const fetchConversations = useCallback(async () => {
    try {
      const response = await api.get("/messages/conversations/");
      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, []);

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.length >= 2) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(searchQuery);
      }, 300);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearch = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      const response = await api.get(`/users/search/?query=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendNewMessage = async () => {
    if (!selectedUser || !messageContent.trim()) return;

    try {
      await api.post("/messages/", {
        receiver_id: selectedUser.id,
        content: messageContent,
      });

      // Fetch updated conversations
      await fetchConversations();

      // Find the new conversation from the updated list
      const updatedConversations = await api.get("/messages/conversations/");

      const newConversation = updatedConversations.data.find(
        (conv) => conv.other_user.id === selectedUser.id
      );

      // If conversation exists, select it
      if (newConversation) {
        setSelectedConversation(newConversation);
      }

      // Reset modal state
      setShowNewMessageModal(false);
      setSelectedUser(null);
      setMessageContent("");
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="messaging-layout">
      <div className="conversation-list-container">
        <div className="conversation-list-header">
          <h3>Conversations</h3>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowNewMessageModal(true)}
          >
            <FaPlus className="me-1" />
            New Message
          </Button>
        </div>
        <ConversationList
          conversations={conversations}
          onSelectConversation={setSelectedConversation}
          selectedConversation={selectedConversation}
        />
      </div>
      <div className="message-view-container">
        {selectedConversation ? (
          <MessageView conversation={selectedConversation} />
        ) : (
          <div className="no-conversation-selected">
            Select a conversation or start a new one
          </div>
        )}
      </div>

      {/* New Message Modal */}
      <Modal
        show={showNewMessageModal}
        onHide={() => {
          setShowNewMessageModal(false);
          setSelectedUser(null);
          setMessageContent("");
          setSearchQuery("");
          setSearchResults([]);
          if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>New Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Search Users</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by name or email... (wait 300ms after typing)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isSearching}
              />
              {isSearching && (
                <div className="search-loading">
                  Searching... (waiting for 300ms after typing)
                </div>
              )}
            </Form.Group>

            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className={`search-result-item ${
                      selectedUser?.id === user.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    {user.username} ({user.email})
                  </div>
                ))}
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type your message..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowNewMessageModal(false);
              setSelectedUser(null);
              setMessageContent("");
              setSearchQuery("");
              setSearchResults([]);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSendNewMessage}
            disabled={!selectedUser || !messageContent.trim() || isSearching}
          >
            Send Message
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MessagingLayout;
