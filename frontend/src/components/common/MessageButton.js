import React, { useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { FaEnvelope } from 'react-icons/fa';
import api from '../../api/axios';

const MessageButton = ({ 
  targetUserId, 
  targetUsername, 
  targetType = 'user', // 'podcaster', 'expert', or 'user'
  variant = 'outline-primary',
  size = 'sm',
  className = ''
}) => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await api.post('/user_messages/', {
        receiver_id: targetUserId,
        content: message.trim()
      });

      setSuccess(true);
      setMessage('');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to send message. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setMessage('');
    setError('');
    setSuccess(false);
  };

  const getButtonText = () => {
    switch (targetType) {
      case 'podcaster':
        return 'Message Podcaster';
      case 'expert':
        return 'Message Expert';
      default:
        return 'Send Message';
    }
  };

  const getModalTitle = () => {
    switch (targetType) {
      case 'podcaster':
        return `Send Message to ${targetUsername}`;
      case 'expert':
        return `Send Message to ${targetUsername}`;
      default:
        return `Send Message to ${targetUsername}`;
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setShowModal(true)}
        title={getButtonText()}
      >
        <FaEnvelope className="me-1" />
        {getButtonText()}
      </Button>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{getModalTitle()}</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {success ? (
            <Alert variant="success">
              Message sent successfully! The modal will close automatically.
            </Alert>
          ) : (
            <Form onSubmit={handleSubmit}>
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}
              
              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Type your message to ${targetUsername}...`}
                  maxLength={1000}
                  disabled={isLoading}
                />
                <Form.Text className="text-muted">
                  {message.length}/1000 characters
                </Form.Text>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        
        {!success && (
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit} 
              disabled={isLoading || !message.trim()}
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
};

export default MessageButton;
