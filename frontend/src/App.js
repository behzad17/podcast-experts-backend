import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import PodcastList from "./components/podcasts/PodcastList";
import PodcastDetail from "./components/podcasts/PodcastDetail";
import PodcastCreate from "./components/podcasts/PodcastCreate";
import ExpertList from "./components/experts/ExpertList";
import ExpertDetail from "./components/experts/ExpertDetail";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profile from "./components/users/Profile";
import Messages from "./components/messages/Messages";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <Container className="flex-grow-1 py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/podcasts" element={<PodcastList />} />
              <Route path="/podcasts/create" element={<PodcastCreate />} />
              <Route path="/podcasts/:id" element={<PodcastDetail />} />
              <Route path="/experts" element={<ExpertList />} />
              <Route path="/experts/:id" element={<ExpertDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/messages" element={<Messages />} />
            </Routes>
          </Container>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
