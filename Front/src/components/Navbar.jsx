import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { PersonCircle } from 'react-bootstrap-icons';
import { useEffect, useState } from 'react';

const CustomNavbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="fixed-top shadow-sm bg-opacity-75">
      <Container>
        <Navbar.Brand href="/">🎟️ TicketTrail</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/events">Events</Nav.Link>
            {user?.role === 'organizer' && <Nav.Link href="/create-event">Create Event</Nav.Link>}
            {user && <Nav.Link href="/my-tickets">My Tickets</Nav.Link>}
            {user ? <Button variant="outline-light" onClick={handleLogout}>Logout</Button> : <Nav.Link href="/login">Login</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
