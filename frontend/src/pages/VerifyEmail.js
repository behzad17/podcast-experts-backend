import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Container, Alert } from "react-bootstrap";

const VerifyEmail = () => {
  const [status, setStatus] = useState("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        console.log("Verifying email with token:", token);
        const response = await api.get(`/users/verify-email/${token}/`);
        console.log("Verification response:", response.data);
        setStatus("success");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        if (error.response) {
          setErrorMessage(error.response.data.detail || "Verification failed");
        } else if (error.code === "ERR_NETWORK") {
          setErrorMessage(
            "Cannot connect to server. Please check if the server is running."
          );
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus("error");
      setErrorMessage("Invalid verification link");
    }
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
      {status === "error" && <Alert variant="danger">{errorMessage}</Alert>}
    </Container>
  );
};

export default VerifyEmail;
