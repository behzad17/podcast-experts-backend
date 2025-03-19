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
        console.log("[DEBUG] Starting email verification with token:", token);
        const response = await api.get(`/users/verify-email/${token}/`);
        console.log("[DEBUG] Verification response:", response.data);

        if (response.data.message) {
          console.log(
            "[DEBUG] Verification successful:",
            response.data.message
          );
          setStatus("success");
          // Clear any stored tokens to ensure a fresh login
          localStorage.removeItem("token");
          localStorage.removeItem("userData");

          setTimeout(() => {
            console.log("[DEBUG] Redirecting to login page");
            navigate("/login");
          }, 3000);
        } else {
          console.log("[DEBUG] Unexpected response format:", response.data);
          setStatus("error");
          setErrorMessage("Unexpected response from server");
        }
      } catch (error) {
        console.error("[DEBUG] Verification error:", error);
        setStatus("error");
        if (error.response) {
          console.error("[DEBUG] Error response:", error.response.data);
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
          Your email has been verified successfully! You will be redirected to
          the login page in 3 seconds...
        </Alert>
      )}
      {status === "error" && <Alert variant="danger">{errorMessage}</Alert>}
    </Container>
  );
};

export default VerifyEmail;
