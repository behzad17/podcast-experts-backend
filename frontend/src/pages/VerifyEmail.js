import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { Container, Alert } from "react-bootstrap";

const VerifyEmail = () => {
  const [status, setStatus] = useState("verifying");
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/users/verify-email/${token}/`);
        setStatus("success");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        setStatus("error");
        console.error("Verification error:", error);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <Container className="mt-4">
      <h2>Email Verification</h2>
      {status === "verifying" && (
        <Alert variant="info">Verifying your email...</Alert>
      )}
      {status === "success" && (
        <Alert variant="success">
          Your email has been verified successfully! Redirecting to login...
        </Alert>
      )}
      {status === "error" && (
        <Alert variant="danger">
          Failed to verify your email. Please try again or contact support.
        </Alert>
      )}
    </Container>
  );
};

export default VerifyEmail;
