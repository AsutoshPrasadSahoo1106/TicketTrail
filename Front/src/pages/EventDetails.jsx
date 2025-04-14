import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Image,
  Button,
  Row,
  Col,
  Form,
  Badge,
} from "react-bootstrap";
import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaBuilding,
  FaTag,
  FaTicketAlt,
  FaEdit,
  FaTrash,
  FaPercent,
} from "react-icons/fa";
import axios from "axios";
import "../styles/EventDetails.css";
import "../styles/common.css";

const EventDetails = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const [event, setEvent] = useState(null);
  const [editMode, setEditMode] = useState(false); // Toggle for edit mode
  const [formData, setFormData] = useState({}); // Form data for editing
  const [imagePreview, setImagePreview] = useState(null); // Preview for the uploaded image
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [promoData, setPromoData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    validFrom: "",
    validUntil: "",
    maxUses: "",
  });
  const [promos, setPromos] = useState([]);
  const [bookingStats, setBookingStats] = useState({
    general: { count: 0, amount: 0 },
    vip: { count: 0, amount: 0 },
  });
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from localStorage
        const response = await axios.get(
          `http://localhost:5000/api/events/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token for authentication
            },
          }
        );
        setEvent(response.data);
        setFormData({
          ...response.data,
          generalQuantity:
            response.data.ticketTypes.find((t) => t.name === "General")
              ?.quantity || "",
          generalPrice:
            response.data.ticketTypes.find((t) => t.name === "General")
              ?.price || "",
          vipQuantity:
            response.data.ticketTypes.find((t) => t.name === "VIP")?.quantity ||
            "",
          vipPrice:
            response.data.ticketTypes.find((t) => t.name === "VIP")?.price ||
            "",
        });
        setImagePreview(`http://localhost:5000${response.data.image}`); // Set the image preview
      } catch (error) {
        console.error(
          "Error fetching event details:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchEventDetails();
  }, [id]);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/promos/event/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPromos(response.data);
      } catch (error) {
        console.error("Error fetching promos:", error);
      }
    };

    fetchPromos();
  }, [id]);

  const fetchBookingStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/bookings/stats/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookingStats(response.data);
    } catch (error) {
      console.error("Error fetching booking stats:", error);
    }
  };

  useEffect(() => {
    if (event) {
      fetchBookingStats();
    }
  }, [event]);

  const handleEditToggle = () => {
    setEditMode(!editMode); // Toggle edit mode
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    setImagePreview(URL.createObjectURL(file)); // Update the image preview
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage
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
        {
          name: "General",
          quantity: formData.generalQuantity,
          price: formData.generalPrice,
        },
        {
          name: "VIP",
          quantity: formData.vipQuantity,
          price: formData.vipPrice,
        },
      ];
      data.append("ticketTypes", JSON.stringify(ticketTypes));

      if (formData.image instanceof File) {
        data.append("image", formData.image); // Append the new image file if updated
      }

      const response = await axios.put(
        `http://localhost:5000/api/events/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token for authentication
          },
        }
      );
      alert("Event updated successfully!");
      setEvent(response.data); // Update the event state with the new data
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error(
        "Error updating event:",
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || "Failed to update event.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const token = localStorage.getItem("token"); // Get the token from localStorage
        await axios.delete(`http://localhost:5000/api/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token for authentication
          },
        });
        alert("Event deleted successfully!");
        navigate("/dashboard"); // Redirect to the dashboard after deletion
      } catch (error) {
        console.error(
          "Error deleting event:",
          error.response?.data?.message || error.message
        );
        alert(error.response?.data?.message || "Failed to delete event.");
      }
    }
  };

  const handlePromoSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/promos",
        { ...promoData, event: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Promo code created successfully!");
      setShowPromoForm(false);
      // Refresh promos list
      const response = await axios.get(
        `http://localhost:5000/api/promos/event/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPromos(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create promo code.");
    }
  };

  if (!event) {
    return <p>Loading event details...</p>;
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 24-hour time to 12-hour time
    return `${formattedHours}:${minutes} ${period}`;
  };

  return (
    <div className="page-container">
      <div className="page-container event-details-container">
        <Container>
          <Row className="g-4">
            <Col lg={7}>
              <div className="event-image-container">
                <Image src={imagePreview} className="event-image" />
              </div>

              {/* Booking Statistics Section */}
              <div className="booking-stats mt-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title mb-4">Booking Statistics</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="stats-card p-3 bg-light rounded mb-3">
                          <h6 className="text-primary mb-2">General Tickets</h6>
                          <p className="mb-1">Sold: {bookingStats.general.count}</p>
                          <p className="mb-0">
                            Revenue: ₹{bookingStats.general.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="stats-card p-3 bg-light rounded mb-3">
                          <h6 className="text-primary mb-2">VIP Tickets</h6>
                          <p className="mb-1">Sold: {bookingStats.vip.count}</p>
                          <p className="mb-0">
                            Revenue: ₹{bookingStats.vip.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="stats-card p-3 bg-primary text-white rounded">
                          <h6 className="mb-2">Total Revenue</h6>
                          <h4 className="mb-0">
                            ₹
                            {(
                              bookingStats.general.amount +
                              bookingStats.vip.amount
                            ).toLocaleString()}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={5}>
              {editMode ? (
                <Form className="edit-form">
                  <h3 className="mb-4">Edit Event</h3>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Time</Form.Label>
                    <Form.Control
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Venue</Form.Label>
                    <Form.Control
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <h4 className="mt-4">Ticket Types</h4>
                  <Form.Group className="mb-3">
                    <Form.Label>General Tickets</Form.Label>
                    <Form.Control
                      type="number"
                      name="generalQuantity"
                      value={formData.generalQuantity}
                      onChange={handleInputChange}
                      placeholder="Quantity"
                    />
                    <Form.Control
                      type="number"
                      name="generalPrice"
                      value={formData.generalPrice}
                      onChange={handleInputChange}
                      placeholder="Price"
                      className="mt-2"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>VIP Tickets</Form.Label>
                    <Form.Control
                      type="number"
                      name="vipQuantity"
                      value={formData.vipQuantity}
                      onChange={handleInputChange}
                      placeholder="Quantity"
                    />
                    <Form.Control
                      type="number"
                      name="vipPrice"
                      value={formData.vipPrice}
                      onChange={handleInputChange}
                      placeholder="Price"
                      className="mt-2"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Event Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <Button
                    variant="success"
                    className="me-2"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </Button>
                  <Button variant="secondary" onClick={handleEditToggle}>
                    Cancel
                  </Button>
                </Form>
              ) : (
                <div className="event-info-card">
                  <h1 className="event-title">{event.title}</h1>

                  <div className="info-badges mb-4">
                    <div className="info-badge">
                      <FaCalendar className="text-primary me-2" />
                      {formatDate(event.date)}
                    </div>
                    <div className="info-badge">
                      <FaClock className="text-primary me-2" />
                      {formatTime(event.time)}
                    </div>
                    <div className="info-badge">
                      <FaMapMarkerAlt className="text-primary me-2" />
                      {event.location}
                    </div>
                    <div className="info-badge">
                      <FaBuilding className="text-primary me-2" />
                      {event.venue}
                    </div>
                    <div className="info-badge">
                      <FaTag className="text-primary me-2" />
                      <Badge bg="primary">{event.category}</Badge>
                    </div>
                  </div>

                  <div className="description-section">
                    <h5 className="fw-bold mb-3">About the Event</h5>
                    <p>{event.description}</p>
                  </div>

                  <div className="ticket-section">
                    <h5 className="fw-bold mb-3">
                      <FaTicketAlt className="me-2" />
                      Ticket Information
                    </h5>
                    {event.ticketTypes.map((ticket, index) => (
                      <div key={index} className="ticket-type-card">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">{ticket.name}</h6>
                            <small className="text-muted">
                              {ticket.quantity} tickets available
                            </small>
                          </div>
                          <h5 className="mb-0">₹{ticket.price}</h5>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="promo-section mt-4">
                    <h5 className="fw-bold mb-3">
                      <FaPercent className="me-2" />
                      Promo Codes
                    </h5>

                    {Array.isArray(promos) && promos.length > 0 ? (
                      promos.map((promo, index) => (
                        <div
                          key={index}
                          className="promo-card mb-2 p-3 border rounded"
                        >
                          <h6 className="mb-1 fs-5">Code: {promo.code || "N/A"}</h6>
                          <p className="mb-1 fs-6">
                            Discount: {promo.discountValue ?? "N/A"}
                            {promo.discountType === "percentage"
                              ? "%"
                              : promo.discountType === "flat"
                              ? "₹"
                              : ""}
                          </p>
                          <p className="mb-1 fs-6">
                            Valid:&nbsp;
                            {promo.validFrom
                              ? new Date(promo.validFrom).toLocaleDateString()
                              : "N/A"}{" "}
                            &nbsp;-&nbsp;
                            {promo.validUntil
                              ? new Date(promo.validUntil).toLocaleDateString()
                              : "N/A"}
                          </p>
                          <p className="mb-0 fs-6">
                            Uses remaining: {promo.maxUses - (promo.usedCount || 0)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No promo codes available.</p>
                    )}

                    {!showPromoForm ? (
                      <Button
                        variant="outline-primary"
                        onClick={() => setShowPromoForm(true)}
                      >
                        Add New Promo Code
                      </Button>
                    ) : (
                      <Form onSubmit={handlePromoSubmit} className="mt-3">
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Promo Code</Form.Label>
                              <Form.Control
                                type="text"
                                value={promoData.code}
                                onChange={(e) =>
                                  setPromoData({
                                    ...promoData,
                                    code: e.target.value,
                                  })
                                }
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Discount Value (%)</Form.Label>
                              <Form.Control
                                type="number"
                                value={promoData.discountValue}
                                onChange={(e) =>
                                  setPromoData({
                                    ...promoData,
                                    discountValue: e.target.value,
                                  })
                                }
                                required
                                min="0"
                                max="100"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Valid From</Form.Label>
                              <Form.Control
                                type="date"
                                value={promoData.validFrom}
                                onChange={(e) =>
                                  setPromoData({
                                    ...promoData,
                                    validFrom: e.target.value,
                                  })
                                }
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Valid Until</Form.Label>
                              <Form.Control
                                type="date"
                                value={promoData.validUntil}
                                onChange={(e) =>
                                  setPromoData({
                                    ...promoData,
                                    validUntil: e.target.value,
                                  })
                                }
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group className="mb-3">
                              <Form.Label>Maximum Uses</Form.Label>
                              <Form.Control
                                type="number"
                                value={promoData.maxUses}
                                onChange={(e) =>
                                  setPromoData({
                                    ...promoData,
                                    maxUses: e.target.value,
                                  })
                                }
                                required
                                min="1"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <div>
                          <Button
                            type="submit"
                            variant="primary"
                            className="me-2"
                          >
                            Create Promo Code
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => setShowPromoForm(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </Form>
                    )}
                  </div>

                  <div className="action-buttons">
                    <Button
                      variant="warning"
                      className="me-3"
                      onClick={handleEditToggle}
                    >
                      <FaEdit className="me-2" />
                      Edit Event
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                      <FaTrash className="me-2" />
                      Delete Event
                    </Button>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default EventDetails;
