import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createPodcast } from "../../services/api";
import { toast } from "react-toastify";

const PodcastCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    audio_url: "",
    cover_image: null,
  });

  const createPodcastMutation = useMutation({
    mutationFn: createPodcast,
    onSuccess: () => {
      toast.success("Podcast created successfully!");
      navigate("/podcasts");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error creating podcast");
    },
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    createPodcastMutation.mutate(formDataToSend);
  };

  return (
    <Container>
      <h2 className="mb-4">Create New Podcast</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Audio URL</Form.Label>
          <Form.Control
            type="url"
            name="audio_url"
            value={formData.audio_url}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Cover Image</Form.Label>
          <Form.Control
            type="file"
            name="cover_image"
            onChange={handleChange}
            accept="image/jpeg,image/jpg,image/png,image/webp"
          />
          <small className="text-muted">jpg, jpeg, png, webp up to 10MB</small>
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          disabled={createPodcastMutation.isPending}
        >
          {createPodcastMutation.isPending ? "Creating..." : "Create Podcast"}
        </Button>
      </Form>
    </Container>
  );
};

export default PodcastCreate;
