import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const PodcastEditModal = ({
  show,
  onHide,
  podcast,
  formData,
  categories = [],
  onChange,
  onSubmit,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Podcast</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category *</Form.Label>
            <Form.Select
              name="category_id"
              value={formData.category_id || ""}
              onChange={onChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Link</Form.Label>
            <Form.Control
              type="url"
              name="link"
              value={formData.link}
              onChange={onChange}
              placeholder="https://your-podcast-platform.com/episode"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>New Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              onChange={onChange}
              accept="image/*"
            />
            <Form.Text className="text-muted">
              Leave empty to keep current image
            </Form.Text>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PodcastEditModal;
