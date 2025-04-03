import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { useEffect, useState } from "react";

const CustomNavbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="fixed-top shadow-sm bg-opacity-75">
      <Container>
      <Navbar.Brand href="/" className="fw-bold fs-2 pt-4">
          🎟️ TicketTrail
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link href="/" className="fs-4 text-light">
              Home
            </Nav.Link>
            <Nav.Link href="/events" className="fs-4 text-light">
              Events
            </Nav.Link>

            {/* Organizer-Specific Links */}
            {user?.role === "organizer" && (
              <>
                <Nav.Link href="/dashboard" className="fs-4 text-light">
                  Dashboard
                </Nav.Link>
                <Nav.Link href="/create-event" className="fs-4 text-light">
                  Create Event
                </Nav.Link>
              </>
            )}

            {/* User-Specific Links */}
            {user?.role === "user" && (
              <Nav.Link href="/my-tickets" className="fs-4 text-light">
                My Tickets
              </Nav.Link>
            )}

            {/* Common Links for Logged-In Users */}
            {user ? (
              <NavDropdown
                title={<span className="fs-4 text-light">{user.name}</span>}
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link href="/login" className="fs-4 text-light">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
