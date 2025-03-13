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
import { Helmet } from "react-helmet";

function App() {
  return (
    <Router>
      {/* تنظیمات امنیتی متا تگ‌ها */}
      
      <Helmet>
           <meta httpEquiv="Content-Security-Policy" content="default-src 'self' data:; img-src 'self' data:;" />
      </Helmet>
      {/* نمایش نوار ناوبری */}
      <Navbar />

      {/* تعریف مسیرهای برنامه */}
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
  );
}

export default App;
