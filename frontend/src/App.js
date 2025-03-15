import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Experts from "./pages/Experts";
import Podcasts from "./pages/Podcasts";
import Navbar from "./components/Navbar";
import ExpertProfile from "./pages/ExpertProfile";
import AdminDashboard from "./pages/AdminDashboard";
import { HelmetProvider, Helmet } from "react-helmet-async";

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self' http://localhost:8001 ws://localhost:8001; connect-src 'self' http://localhost:8001 ws://localhost:8001; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: http://localhost:8001;"
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
          <Route path="/podcasts" element={<Podcasts />} />
          <Route path="/expert/:id" element={<ExpertProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
