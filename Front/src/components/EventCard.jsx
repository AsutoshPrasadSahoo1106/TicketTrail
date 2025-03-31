import { Card, Button } from 'react-bootstrap';
import '../styles/EventCard.css'; 

const EventCard = ({ title, date, location, image }) => {
  return (
    <Card className="event-card shadow-sm border-0">
      <Card.Img variant="top" src={image} className="event-card-img" />
      <Card.Body>
        <Card.Title className="fw-bold">{title}</Card.Title>
        <Card.Text className="text-muted">
          📅 {date} <br /> 📍 {location}
        </Card.Text>
        <Button variant="primary" className="w-100">Book Now</Button>
      </Card.Body>
    </Card>
  );
};

export default EventCard;
