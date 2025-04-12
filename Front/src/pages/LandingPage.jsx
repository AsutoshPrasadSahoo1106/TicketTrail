import HeroSection from "../components/HeroSection";
import EventCard from "../components/EventCard";
import Footer from "../components/Footer";
import { Container, Row, Col, Pagination, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const staticEvents = [
  { title: "Concert", date: "2023-12-25", location: "Mumbai", image: "https://wallpapercave.com/wp/wp2646803.jpg" },
  { title: "Festival", date: "2024-01-01", location: "Delhi", image: "https://wallpapercave.com/wp/wp7488226.jpg" },
  { title: "Tech Expo", date: "2024-03-15", location: "Bangalore", image: "https://wallpapercave.com/wp/wp8023984.jpg" },
  { title: "Food Carnival", date: "2024-02-10", location: "Chennai", image: "https://wallpapercave.com/uwp/uwp4350353.jpeg" },
  { title: "Gaming Meetup", date: "2024-04-05", location: "Pune", image: "https://wallpapercave.com/wp/wp2565866.jpg" },
  { title: "Startup Pitch", date: "2024-03-20", location: "Hyderabad", image: "https://wallpapercave.com/wp/wp4676588.jpg" },
  { title: "Comedy Night", date: "2024-01-28", location: "Kolkata", image: "https://wallpapercave.com/wp/wp7585212.jpg" },
  { title: "Art Exhibition", date: "2024-05-12", location: "Jaipur", image: "https://wallpapercave.com/wp/wp4676554.jpg" },
  { title: "Auto Expo", date: "2024-08-30", location: "Jaipur", image: "https://wallpapercave.com/wp/wp10014285.jpg" },
  { title: "Music Fest", date: "2024-09-15", location: "Goa", image: "https://wallpapercave.com/wp/wp12143399.jpg" },
];

const ITEMS_PER_PAGE = 8;

const LandingPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("nearest");
  const [dynamicEvents, setDynamicEvents] = useState([]); // State for events fetched from the database
  const navigate = useNavigate();

  const today = new Date();

  // Fetch events from the database
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events");
        setDynamicEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error.response?.data?.message || error.message);
      }
    };

    fetchEvents();
  }, []);

  // Combine static and dynamic events
  const allEvents = [...staticEvents, ...dynamicEvents];

  // Filter Events
  const filteredEvents = allEvents.filter((event) => {
    const eventDate = new Date(event.date);

    if (filter === "upcoming" && eventDate < today) return false;
    if (filter === "past" && eventDate >= today) return false;

    return event.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Sort Events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return sortOrder === "nearest" ? dateA - dateB : dateB - dateA;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentEvents = sortedEvents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedEvents.length / ITEMS_PER_PAGE);

  const handleEventDetails = (eventId) => {
    navigate(`/events/${eventId}/buy`); };
  

  return (
    <div>
      <HeroSection />

      {/* Search, Filter & Sort Section */}
      <Container className="my-4">
        <Row className="justify-content-between">
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Search Events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Select onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming Events</option>
              <option value="past">Past Events</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select onChange={(e) => setSortOrder(e.target.value)}>
              <option value="nearest">Sort by Nearest Date</option>
              <option value="latest">Sort by Latest Date</option>
            </Form.Select>
          </Col>
        </Row>
      </Container>

      {/* Event Cards Section */}
      <Container>
        <Row>
          {currentEvents.length > 0 ? (
            currentEvents.map((event, index) => (
              <Col key={index} md={3} className="mb-4">
                <EventCard
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  image={event.image.startsWith("http") ? event.image : `http://localhost:5000${event.image}`}
                  onDetailsClick={() => handleEventDetails(event._id || index)} // Use `_id` for dynamic events
                />
              </Col>
            ))
          ) : (
            <p className="text-center w-100">No events found.</p>
          )}
        </Row>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <Pagination className="justify-content-center mt-4">
            <Pagination.Prev
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        )}
      </Container>

      <Footer />
    </div>
  );
};

export default LandingPage;
