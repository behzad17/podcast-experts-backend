import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/users/${currentUser.id}/`);
        setUserData(response.data);
      } catch (err) {
        setError('Failed to fetch user data');
        console.error(err);
      }
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      setError('');
      setLoading(true);
      await logout();
    } catch (err) {
      setError('Failed to log out');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <Container className="mt-5">
        <Alert variant="info">Please log in to view your profile.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {userData && (
            <>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Username:</strong> {userData.username}</p>
              <p><strong>Date Joined:</strong> {new Date(userData.date_joined).toLocaleDateString()}</p>
            </>
          )}
          <Button
            variant="danger"
            onClick={handleLogout}
            disabled={loading}
            className="w-100 mt-3"
          >
            Log Out
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile; 