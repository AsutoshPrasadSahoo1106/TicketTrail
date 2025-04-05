import { Card, Button } from "react-bootstrap";
import "../styles/EventCard.css";

const EventCard = ({ title, date, location, image, onDetailsClick }) => {
  // Format the date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card className="event-card shadow-sm border-0">
      <Card.Img variant="top" src={image} className="event-card-img" />
      <Card.Body>
        <Card.Title className="fw-bold">{title}</Card.Title>
        <Card.Text className="text-muted">
          📅 {formatDate(date)} <br /> 📍 {location}
        </Card.Text>
        <Button
          variant="primary"
          className="w-100"
          onClick={onDetailsClick} // Trigger the event details action
        >
          Event Details
        </Button>
      </Card.Body>
    </Card>
  );
};

export default EventCard;
