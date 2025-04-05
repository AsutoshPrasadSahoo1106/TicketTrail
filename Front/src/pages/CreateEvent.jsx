import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import "./styles/CreateEvent.css"; // Import the CSS file for styling

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    venue: "",
    location: "",
    generalQuantity: "",
    generalPrice: "",
    vipQuantity: "",
    vipPrice: "",
  });

  const [eventImage, setEventImage] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setEventImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data for submission
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("date", formData.date);
    data.append("time", formData.time);
    data.append("venue", formData.venue);
    data.append("location", formData.location);

    // Add ticket types as JSON
    const ticketTypes = [
      { name: "General", quantity: formData.generalQuantity, price: formData.generalPrice },
      { name: "VIP", quantity: formData.vipQuantity, price: formData.vipPrice },
    ];
    data.append("ticketTypes", JSON.stringify(ticketTypes));

    data.append("image", eventImage); // Append the image file

    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      const response = await axios.post("http://localhost:5000/api/events", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Include the token for authentication
        },
      });

      alert("Event Created Successfully!");
      console.log("Event Created:", response.data);

      // Redirect to the dashboard page
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating event:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Failed to create event.");
    }
  };

  return (
    <Container className="mt-5" style={{ paddingTop: "80px" }}>
      <div className="form-box">
        <h2 className="mb-4 text-center">Create New Event</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Event Title</Form.Label>
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
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Time</Form.Label>
            <Form.Control
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Venue</Form.Label>
            <Form.Control
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Ticket Types */}
          <h4 className="mt-4">Ticket Types</h4>
          <Form.Group className="mb-3">
            <Form.Label>General Tickets</Form.Label>
            <Form.Control
              type="number"
              name="generalQuantity"
              value={formData.generalQuantity}
              onChange={handleChange}
              placeholder="Quantity"
              required
            />
            <Form.Control
              type="number"
              name="generalPrice"
              value={formData.generalPrice}
              onChange={handleChange}
              placeholder="Price"
              className="mt-2"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>VIP Tickets</Form.Label>
            <Form.Control
              type="number"
              name="vipQuantity"
              value={formData.vipQuantity}
              onChange={handleChange}
              placeholder="Quantity"
              required
            />
            <Form.Control
              type="number"
              name="vipPrice"
              value={formData.vipPrice}
              onChange={handleChange}
              placeholder="Price"
              className="mt-2"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Event Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleFileChange} required />
          </Form.Group>

          <Button type="submit" variant="success" className="w-100">
            Create Event
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default CreateEvent;
