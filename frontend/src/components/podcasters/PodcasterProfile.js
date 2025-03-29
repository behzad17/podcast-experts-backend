import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PodcasterProfileView from "./PodcasterProfileView";
import PodcasterProfileEdit from "./PodcasterProfileEdit";
import PodcasterProfileCreate from "./PodcasterProfileCreate";
import PodcasterList from "./PodcasterList";

const PodcasterProfile = () => {
  return (
    <Routes>
      <Route path="/" element={<PodcasterList />} />
      <Route path="/create" element={<PodcasterProfileCreate />} />
      <Route path="/:id" element={<PodcasterProfileView />} />
      <Route path="/:id/edit" element={<PodcasterProfileEdit />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default PodcasterProfile;
