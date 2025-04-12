import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Image,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import md5 from "md5"; // Import md5 for hashing email addresses

const CustomNavbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user details from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    // Clear user data and redirect to login
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Generate Gravatar URL
  const getGravatarUrl = (email) => {
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=60`; // Default to "identicon" and size 60px
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      className="fixed-top shadow-sm bg-opacity-75"
    >
      <Container>
        <Navbar.Brand href="/" className="fw-bold fs-4">
          🎟️ TicketTrail
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link href="/" className="fs-5 text-light">
              Home
            </Nav.Link>
            

            {/* Organizer-Specific Links */}
            {user?.role === "organizer" && (
              <>
                <Nav.Link href="/dashboard" className="fs-5 text-light">
                  Dashboard
                </Nav.Link>
                <Nav.Link href="/create-event" className="fs-5 text-light">
                  Create Event
                </Nav.Link>
              </>
            )}

            {/* User-Specific Links */}
            {user?.role === "user" && (
              <Nav.Link href="/my-tickets" className="fs-5 text-light">
                My Tickets
              </Nav.Link>
            )}

            {/* Common Links for Logged-In Users */}
            {user ? (
              <NavDropdown
                title={
                  <span>
                    <Image
                      src={
                        user.profilePicture
                          ? `http://localhost:5000${user.profilePicture}` // Use the profilePicture field from the backend
                          : getGravatarUrl(user.email) // Use Gravatar if no profile picture is available
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getGravatarUrl(user.email); // Fallback to Gravatar
                      }}
                      roundedCircle
                      width={60}
                      height={69}
                      className="me-2 profile-image"
                      alt="Profile"
                    />
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link href="/login" className="fs-5 text-light">
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
