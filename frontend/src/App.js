import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Experts from "./pages/Experts";
import Podcasts from "./pages/Podcasts";
import Navbar from "./components/Navbar";
import ExpertProfile from "./pages/ExpertProfile";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/experts" element={<Experts />} />
        <Route path="/podcasts" element={<Podcasts />} />
        <Route path="/expert/:id" element={<ExpertProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
