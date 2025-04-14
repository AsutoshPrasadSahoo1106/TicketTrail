import { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaImage, FaTicketAlt, FaCalendar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import axios from "axios";
import "../styles/CreateEvent.css";

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
  const [selectedFileName, setSelectedFileName] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventImage(file);
      setSelectedFileName(file.name);
    }
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
      const token = localStorage.getItem("token");

      // First create the event
      const eventResponse = await axios.post("http://localhost:5000/api/events", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Event Created Successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Failed to create event.");
    }
  };

  return (
    <Container className="create-event-container" style={{ paddingTop: "80px" }}>
      <div className="form-box">
        <h1 className="page-title">Create New Event</h1>
        <Form onSubmit={handleSubmit}>
          <section>
            <h3 className="section-title">Basic Information</h3>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-4">
                  <Form.Label>Event Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter event title"
                  />
                </Form.Group>
              </Col>
              
              {/* Add Category Field */}
              <Col md={12}>
                <Form.Group className="mb-4">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Music">Music</option>
                    <option value="Sports">Sports</option>
                    <option value="Theatre">Theatre</option>
                    <option value="Conference">Conference</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group className="mb-4">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Describe your event"
                  />
                </Form.Group>
              </Col>
            </Row>
          </section>

          <section>
            <h3 className="section-title">Event Details</h3>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaCalendar className="me-2" />
                    Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaClock className="me-2" />
                    Time
                  </Form.Label>
                  <Form.Control
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaMapMarkerAlt className="me-2" />
                    Venue
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    required
                    placeholder="Enter venue name"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaMapMarkerAlt className="me-2" />
                    Location
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="Enter location (e.g., City, Country)"
                  />
                  <Form.Text className="text-muted">
                    Enter the city or area where the event will take place
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </section>

          <section>
            <h3 className="section-title">
              <FaTicketAlt className="me-2" />
              Ticket Information
            </h3>
            
            <div className="ticket-type-card">
              <h5>General Admission</h5>
              <div className="ticket-inputs">
                <Form.Group>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    name="generalQuantity"
                    value={formData.generalQuantity}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="generalPrice"
                    value={formData.generalPrice}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="ticket-type-card">
              <h5>VIP Tickets</h5>
              <div className="ticket-inputs">
                <Form.Group>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    name="vipQuantity"
                    value={formData.vipQuantity}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="vipPrice"
                    value={formData.vipPrice}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
            </div>
          </section>

          <section>
            <h3 className="section-title">
              <FaImage className="me-2" />
              Event Image
            </h3>
            <div className="image-upload-container">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload" className="mb-0">
                <FaImage size={32} className="mb-3" />
                <p className="mb-0">
                  {selectedFileName ? `Selected: ${selectedFileName}` : "Click to upload event image"}
                </p>
              </label>
            </div>
          </section>

          <Button type="submit" className="submit-button w-100">
            Create Event
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default CreateEvent;
