import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EventCard from "../components/EventCard";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from localStorage
        const response = await axios.get("http://localhost:5000/api/events", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token for authentication
          },
        });

        // Filter events to show only those created by the logged-in organizer
        const organizerId = JSON.parse(localStorage.getItem("user"))._id;
        const organizerEvents = response.data.filter(
          (event) => event.organizer === organizerId
        );

        setEvents(organizerEvents);
      } catch (error) {
        console.error("Error fetching events:", error.response?.data?.message || error.message);
      }
    };

    fetchEvents();
  }, []);

  const handleEventDetails = (eventId) => {
    // Navigate to the event details page
    navigate(`/events/${eventId}`);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container className="mt-5" style={{ paddingTop: "80px" }}>
      <h2 className="mb-4">Organizer Dashboard</h2>
      {events.length === 0 ? (
        <p>No events created yet. Start by creating your first event!</p>
      ) : (
        <Row>
          {events.map((event) => (
            <Col key={event._id} md={4} className="mb-4">
              <EventCard
                title={event.title}
                date={formatDate(event.date)} // Format the date
                location={event.location}
                image={`http://localhost:5000${event.image}`} // Use the image URL from the backend
                onDetailsClick={() => handleEventDetails(event._id)} // Pass event ID to the handler
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Dashboard;
