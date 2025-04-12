import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Image, Button, Row, Col, Form, Card, Badge } from "react-bootstrap";
import axios from "axios";
import { FaCalendar, FaClock, FaMapMarkerAlt, FaBuilding, FaTag } from 'react-icons/fa';
import "../styles/BuyTickets.css";
import "../styles/common.css";

const BuyTickets = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1); // Quantity for ticket purchase
  const [ticketType, setTicketType] = useState("General"); // Selected ticket type
  const [promoCode, setPromoCode] = useState(""); // Promo code (optional)
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event details:", error.response?.data?.message || error.message);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleBuyNow = async () => {
    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      if (!token) {
        alert("You must be signed in to buy tickets.");
        navigate("/login");
        return;
      }

      // Prepare the booking data
      const bookingData = {
        eventId: id,
        ticketType,
        quantity,
        promoCode, // Optional promo code
        paymentMethodId: "pm_card_visa", // Replace with actual payment method ID from Stripe
      };

      // Send the booking request to the backend
      const response = await axios.post("http://localhost:5000/api/bookings", bookingData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token for authentication
        },
      });

      alert("Tickets purchased successfully!");
      console.log("Booking Response:", response.data);

      // Redirect to the user's bookings page
      navigate("/my-tickets");
    } catch (error) {
      console.error("Error purchasing tickets:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Failed to purchase tickets.");
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
      <Container className="event-container mt-5" >
        <Row className="g-4">
          <Col lg={7}>
            <Card className="event-details border-0 shadow-sm">
              <Card.Body>
                <div className="event-image">
                  <Image 
                    src={`http://localhost:5000${event?.image}`} 
                    fluid 
                    className="w-100"
                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                  />
                </div>
                <h2 className="event-title">{event?.title}</h2>
                
                <div className="d-flex flex-wrap gap-4 mb-4">
                  <div className="info-badge">
                    <FaCalendar className="text-primary" />
                    <span>{formatDate(event?.date)}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaClock className="text-primary me-2" />
                    <span>{formatTime(event?.time)}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaMapMarkerAlt className="text-primary me-2" />
                    <span>{event?.location}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaBuilding className="text-primary me-2" />
                    <span>{event?.venue}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaTag className="text-primary me-2" />
                    <Badge bg="primary">{event?.category}</Badge>
                  </div>
                </div>

                <h5 className="fw-bold mb-3">About the Event</h5>
                <p className="event-description">{event?.description}</p>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={5}>
            <Card className="booking-card border-0 shadow-sm">
              <Card.Body>
                <h4 className="fw-bold mb-4">Book Tickets</h4>
                
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Available Tickets</h6>
                  {event?.ticketTypes.map((ticket, index) => (
                    <div key={index} className="p-3 border rounded mb-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{ticket.name}</h6>
                          <small className="text-muted">{ticket.quantity} tickets available</small>
                        </div>
                        <h5 className="mb-0">₹{ticket.price}</h5>
                      </div>
                    </div>
                  ))}
                </div>

                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Select Ticket Type</Form.Label>
                    <Form.Select
                      value={ticketType}
                      onChange={(e) => setTicketType(e.target.value)}
                      className="py-2"
                    >
                      {event?.ticketTypes.map((ticket, index) => (
                        <option key={index} value={ticket.name}>
                          {ticket.name} - ₹{ticket.price}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max={event?.ticketTypes.find((t) => t.name === ticketType)?.quantity || 1}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="py-2"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Promo Code</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter promo code (optional)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="py-2"
                    />
                  </Form.Group>

                  
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={handleBuyNow}
                      className="buy-button w-100"
                    >
                      Buy Now
                    </Button>
                  
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BuyTickets;