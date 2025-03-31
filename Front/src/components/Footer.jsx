import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4">
      <Container>
        <Row className="text-center">
          <Col md={4} className="mb-3">
            <h5>About Us</h5>
            <p>TicketTrail helps you discover and book amazing events happening around you.</p>
          </Col>

          <Col md={4} className="mb-3">
            <h5>Follow Us</h5>
            <div className="d-flex justify-content-center gap-3">
              <a href="#" className="text-light"><FaFacebook size={24} /></a>
              <a href="#" className="text-light"><FaTwitter size={24} /></a>
              <a href="#" className="text-light"><FaInstagram size={24} /></a>
              <a href="#" className="text-light"><FaLinkedin size={24} /></a>
            </div>
          </Col>

          <Col md={4} className="mb-3">
            <h5>Contact Us</h5>
            <p>Email: support@tickettrail.com</p>
            <p>Phone: +91 9876543210</p>
          </Col>
        </Row>

        <hr className="bg-light" />

        <div className="text-center">
          <p className="mb-0">&copy; 2025 TicketTrail. All Rights Reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
