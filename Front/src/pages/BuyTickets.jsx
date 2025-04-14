import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Image,
  Button,
  Row,
  Col,
  Form,
  Card,
  Badge,
} from "react-bootstrap";
import axios from "axios";
import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaBuilding,
  FaTag,
  FaPercent,
} from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import "../styles/BuyTickets.css";
import "../styles/common.css";

const stripePromise = loadStripe(
  "pk_test_51R9imVFjVCXkZ1HtXCcCcJjFTg10wb5PdQAMPCuIsQ0d1j1psYbXPei80W9TBzKFSmYbrCBdRBqRz4VgAdNtyv6m003Oxvc2sc",{
    advancedFraudSignals: false, // Disable Stripe analytics
  }
); // Replace with your Stripe Publishable Key

const PaymentForm = ({ handleBuyNow }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe has not loaded yet.");
      alert("Stripe is not ready. Please try again later.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        console.error("Stripe Error:", error);
        alert(error.message || "Payment failed. Please try again.");
        return;
      }

      // Pass the payment method ID to the parent function
      handleBuyNow(paymentMethod.id);
    } catch (err) {
      console.error("Error during payment submission:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="mb-3" />
      <Button type="submit" variant="primary" disabled={!stripe}>
        Pay Now
      </Button>
    </form>
  );
};

const BuyTickets = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1); // Quantity for ticket purchase
  const [ticketType, setTicketType] = useState("General"); // Selected ticket type
  const [promoCode, setPromoCode] = useState(""); // Promo code (optional)
  const [discount, setDiscount] = useState(0); // Discount value
  const [isPromoValid, setIsPromoValid] = useState(false); // Promo code validity
  const [availablePromos, setAvailablePromos] = useState([]);
  const [promos, setPromos] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchPromoCodes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/promos/event/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPromos(response.data);
    } catch (error) {
      console.error("Error fetching promos:", error);
    }
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/events/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEvent(response.data);
      } catch (error) {
        console.error(
          "Error fetching event details:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchEventDetails();
    fetchPromoCodes();
  }, [id]);

  const handleBuyNow = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be signed in to buy tickets.");
        navigate("/login");
        return;
      }

      const bookingData = {
        eventId: id,
        ticketType,
        quantity,
        promoCode,
      };

      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Redirect to Stripe Checkout
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        alert("Failed to initiate checkout. Please try again.");
      }
    } catch (error) {
      console.error(
        "Error initiating checkout:",
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || "Failed to initiate checkout.");
    }
  };

  const handleApplyPromoCode = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/promos/apply",
        { code: promoCode, eventId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Promo Code Response:", response.data); // Correct placement of console.log

      const { discountType, discountValue } = response.data;

      // Calculate the discount
      const ticketPrice =
        event.ticketTypes.find((t) => t.name === ticketType)?.price || 0;
      const calculatedDiscount =
        discountType === "percentage"
          ? (ticketPrice * discountValue) / 100
          : discountValue;

      setDiscount(calculatedDiscount);
      setIsPromoValid(true);
      alert("Promo code applied successfully!");
    } catch (error) {
      console.error(
        "Error applying promo code:",
        error.response?.data?.message || error.message
      );
      setDiscount(0);
      setIsPromoValid(false);
      alert(error.response?.data?.message || "Failed to apply promo code.");
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

  const ticketPrice =
    event.ticketTypes.find((t) => t.name === ticketType)?.price || 0;
  const totalPrice = ticketPrice * quantity - discount;

  return (
    <Elements stripe={stripePromise}>
      <div className="page-container">
        <Container className="event-container mt-5">
          <Row className="g-4">
            <Col lg={7}>
              <Card className="event-details border-0 shadow-sm">
                <Card.Body>
                  <div className="event-image">
                    <Image
                      src={`http://localhost:5000${event?.image}`}
                      fluid
                      className="w-100"
                      style={{ maxHeight: "400px", objectFit: "cover" }}
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
                            <small className="text-muted">
                              {ticket.quantity} tickets available
                            </small>
                          </div>
                          <h5 className="mb-0">₹{ticket.price}</h5>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">
                      <FaPercent className="me-2" />
                      Promo Codes
                    </h6>

                    {Array.isArray(promos) && promos.length > 0 ? (
                      <div className="promo-codes-container">
                        {promos.map((promo, index) => (
                          <div key={index} className="promo-card mb-2 p-3 border rounded">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h6 className="mb-1 fs-5">Code: {promo.code || "N/A"}</h6>
                                <p className="mb-1 fs-6">
                                  Discount: {promo.discountValue ?? "N/A"}
                                  {promo.discountType === "percentage" ? "%" : "₹"}
                                </p>
                                <p className="mb-1 fs-6">
                                  Valid until: {new Date(promo.validUntil).toLocaleDateString()}
                                </p>
                                <p className="mb-0 fs-6">
                                  Uses remaining: {promo.maxUses - (promo.usedCount || 0)}
                                </p>
                              </div>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => {
                                  setPromoCode(promo.code);
                                  
                                }}
                              >
                                Apply Code
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">No promo codes available for this event.</p>
                    )}

                    <Form.Group className="mt-4">
                      <Form.Label className="fw-bold">Enter Promo Code</Form.Label>
                      <div className="d-flex gap-2">
                        <Form.Control
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter code manually"
                        />
                        <Button
                          variant="primary"
                          onClick={handleApplyPromoCode}
                          disabled={!promoCode}
                        >
                          Apply
                        </Button>
                      </div>
                      {isPromoValid && (
                        <small className="text-success d-block mt-2">
                          Promo code applied! Discount: ₹{discount}
                        </small>
                      )}
                    </Form.Group>
                  </div>

                  <div>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Select Ticket Type
                      </Form.Label>
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
                        max={
                          event?.ticketTypes.find((t) => t.name === ticketType)
                            ?.quantity || 1
                        }
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="py-2"
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="fw-bold">Total Price:</h5>
                      <h5 className="text-primary">
                        ₹{totalPrice > 0 ? totalPrice : 0}
                      </h5>
                    </div>

                    <Button onClick={handleBuyNow} variant="primary">
                      Buy Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </Elements>
  );
};

export default BuyTickets;
