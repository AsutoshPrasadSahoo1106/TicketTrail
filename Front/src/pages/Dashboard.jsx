import { Container, Card } from 'react-bootstrap';

const Dashboard = () => {
  return (
    <Container className="mt-5">
      <h2 className="mb-4">Organizer Dashboard</h2>
      <Card className="p-4 shadow-sm">
        <h5>Welcome to your dashboard</h5>
        <p>Manage your events and track ticket sales.</p>
      </Card>
    </Container>
  );
};

export default Dashboard;
