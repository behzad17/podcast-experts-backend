import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import { HelmetProvider, Helmet } from "react-helmet-async";
import AdminDashboard from "./pages/AdminDashboard";
import VerifyEmail from "./pages/VerifyEmail";
import AdminExpertApproval from "./pages/AdminExpertApproval";
import Profile from "./pages/Profile";
import PodcasterProfileCreate from "./pages/PodcasterProfileCreate";
import { AuthProvider } from "./contexts/AuthContext";
import Messages from "./pages/Messages";
import PrivateRoute from "./components/PrivateRoute";
import PodcasterProfile from "./components/podcasters/PodcasterProfile";

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

      <AuthProvider>
        <Router>
          <div>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/podcasts" element={<Podcasts />} />
              <Route path="/podcasts/create" element={<CreatePodcast />} />
              <Route path="/podcasts/:id" element={<PodcastDetail />} />
              <Route path="/podcasts/:id/edit" element={<EditPodcast />} />
              <Route
                path="/podcasts/profile/create"
                element={<PodcasterProfileCreate />}
              />
              <Route path="/experts" element={<Experts />} />
              <Route path="/experts/create" element={<CreateExpert />} />
              <Route path="/experts/:id" element={<ExpertDetail />} />
              <Route path="/experts/:id/edit" element={<EditExpert />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route
                path="/admin/expert-approval"
                element={<AdminExpertApproval />}
              />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route path="/profile" element={<Profile />} />
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
              <Route path="/podcasters/*" element={<PodcasterProfile />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
