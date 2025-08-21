import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Podcasts from "./pages/Podcasts";
import PodcastDetail from "./pages/PodcastDetail";
import CreatePodcast from "./pages/PodcastCreate";
import EditPodcast from "./pages/EditPodcast";
import Experts from "./pages/Experts";
import ExpertDetail from "./pages/ExpertDetail";
import CreateExpert from "./pages/ExpertCreate";
import EditExpert from "./pages/EditExpert";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { HelmetProvider, Helmet } from "react-helmet-async";
import AdminDashboard from "./pages/AdminDashboard";
import VerifyEmail from "./pages/VerifyEmail";
import AdminExpertApproval from "./pages/AdminExpertApproval";
import AdminPodcastApproval from "./pages/AdminPodcastApproval";
import Profile from "./pages/Profile";
import PodcasterProfileCreate from "./pages/PodcasterProfileCreate";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Messages from "./pages/Messages";
import PrivateRoute from "./components/PrivateRoute";
import { Spinner } from "react-bootstrap";

function AppContent() {
  const { loading, user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "50vh" }}
          >
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={user ? <Navigate to="/" replace /> : <Login />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/" replace /> : <Register />}
            />
            <Route path="/podcasts" element={<Podcasts />} />
            <Route path="/podcasts/:id" element={<PodcastDetail />} />
            <Route path="/experts" element={<Experts />} />
            <Route path="/experts/:id" element={<ExpertDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/podcasts/create"
              element={
                <PrivateRoute>
                  <CreatePodcast />
                </PrivateRoute>
              }
            />
            <Route
              path="/podcasts/:id/edit"
              element={
                <PrivateRoute>
                  <EditPodcast />
                </PrivateRoute>
              }
            />
            <Route
              path="/podcasts/profile/create"
              element={
                <PrivateRoute>
                  <PodcasterProfileCreate />
                </PrivateRoute>
              }
            />
            <Route
              path="/experts/create"
              element={
                <PrivateRoute>
                  <CreateExpert />
                </PrivateRoute>
              }
            />
            <Route
              path="/experts/:id/edit"
              element={
                <PrivateRoute>
                  <EditExpert />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/expert-approval"
              element={
                <PrivateRoute>
                  <AdminExpertApproval />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/podcast-approval"
              element={
                <PrivateRoute>
                  <AdminPodcastApproval />
                </PrivateRoute>
              }
            />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <PrivateRoute>
                  <Messages />
                </PrivateRoute>
              }
            />
            <Route
              path="/messages/:userId"
              element={
                <PrivateRoute>
                  <Messages />
                </PrivateRoute>
              }
            />
          </Routes>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self' http://localhost:8000 ws://localhost:8000; connect-src 'self' http://localhost:8000 ws://localhost:8000 http://127.0.0.1:8000; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: http://localhost:8000 http://127.0.0.1:8000;"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
      </Helmet>

      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
