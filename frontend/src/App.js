import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Experts from "./pages/Experts";
import Podcasts from "./pages/Podcasts";
import PodcastCreate from "./pages/PodcastCreate";
import Navbar from "./components/Navbar";
import ExpertProfile from "./pages/ExpertProfile";
import AdminDashboard from "./pages/AdminDashboard";
import VerifyEmail from "./pages/VerifyEmail";
import ExpertProfileCreate from "./pages/ExpertProfileCreate";
import PodcasterProfileCreate from "./pages/PodcasterProfileCreate";
import ExpertProfileDetail from "./pages/ExpertProfileDetail";
import AdminExpertApproval from "./pages/AdminExpertApproval";
import { HelmetProvider, Helmet } from "react-helmet-async";
import Profile from "./pages/Profile";

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self' http://localhost:8000 ws://localhost:8000; connect-src 'self' http://localhost:8000 ws://localhost:8000 http://127.0.0.1:8000; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: http://localhost:8000;"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
      </Helmet>

      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/experts" element={<Experts />} />
          <Route path="/experts/create" element={<ExpertProfileCreate />} />
          <Route path="/experts/:id" element={<ExpertProfileDetail />} />
          <Route path="/podcasts" element={<Podcasts />} />
          <Route path="/podcasts/create" element={<PodcastCreate />} />
          <Route path="/expert/:id" element={<ExpertProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route
            path="/expert/profile/create"
            element={<ExpertProfileCreate />}
          />
          <Route
            path="/podcaster/profile/create"
            element={<PodcasterProfileCreate />}
          />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/experts" element={<AdminExpertApproval />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
