import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Events = () => {
  const events = [
    { id: 1, name: 'Music Fest 2025', date: '2025-07-10', location: 'New York' },
    { id: 2, name: 'Tech Conference', date: '2025-09-20', location: 'San Francisco' },
  ];

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Upcoming Events</h2>
      <Row>
        {events.map(event => (
          <Col key={event.id} md={6} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>{event.name}</Card.Title>
                <Card.Text>
                  <strong>Date:</strong> {event.date} <br />
                  <strong>Location:</strong> {event.location}
                </Card.Text>
                <Button variant="primary">View Details</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Events;
