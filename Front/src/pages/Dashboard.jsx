import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EventCard from "../components/EventCard";
import { FaCalendar, FaTicketAlt, FaUsers, FaPlus } from 'react-icons/fa';
import "../styles/Dashboard.css";
import "../styles/common.css";


const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalTickets: 0,
    activeEvents: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const organizerId = JSON.parse(localStorage.getItem("user"))._id;
        
        const eventsResponse = await axios.get("http://localhost:5000/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const organizerEvents = eventsResponse.data.filter(
          (event) => event.organizer === organizerId
        );

        setEvents(organizerEvents);
        setStats({
          totalEvents: organizerEvents.length,
          totalTickets: organizerEvents.reduce((acc, event) => 
            acc + event.ticketTypes.reduce((sum, type) => sum + type.quantity, 0), 0),
          activeEvents: organizerEvents.filter(event => new Date(event.date) >= new Date()).length
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="dashboard-title">Organizer Dashboard</h2>
            <Button 
              className="create-event-btn"
              onClick={() => navigate('/create-event')}
            >
              <FaPlus className="me-2" />
              Create Event
            </Button>
          </div>
          
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalEvents}</div>
              <div className="stat-label">
                <FaCalendar className="me-2" />
                Total Events
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">{stats.totalTickets}</div>
              <div className="stat-label">
                <FaTicketAlt className="me-2" />
                Total Tickets
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">{stats.activeEvents}</div>
              <div className="stat-label">
                <FaUsers className="me-2" />
                Active Events
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        {events.length === 0 ? (
          <div className="no-events">
            <FaCalendar className="no-events-icon" />
            <h3>No events created yet</h3>
            <p className="text-muted">Start by creating your first event!</p>
            <Button 
              className="create-event-btn mt-3"
              onClick={() => navigate('/create-event')}
            >
              <FaPlus className="me-2" />
              Create Your First Event
            </Button>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <EventCard
                key={event._id}
                title={event.title}
                date={new Date(event.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
                location={event.location}
                image={`http://localhost:5000${event.image}`}
                onDetailsClick={() => navigate(`/events/${event._id}`)}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;
