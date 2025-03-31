import { Button, Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const HeroSection = () => {
  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Carousel as Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <Carousel controls={false} indicators={false} interval={3000} pause={false}>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://wallpapercave.com/wp/wp1862480.jpg"
              alt="Holi Celebration"
              style={{ height: '100vh', objectFit: 'cover' }}
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://wallpapercave.com/wp/wp2866245.jpg"
              alt="Delhi"
              style={{ height: '100vh', objectFit: 'cover' }}
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://wallpapercave.com/wp/wp4223766.jpg"
              alt="Jaisalmer"
              style={{ height: '100vh', objectFit: 'cover' }}
            />
          </Carousel.Item>
        </Carousel>
      </div>

      {/* Text and Button in Foreground */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2, textAlign: 'center', color: 'white' }}>
        <h1 className="display-1">Welcome to TicketTrail 🎟️</h1>
        <p>Your gateway to amazing events and experiences.</p>
        <Button variant="light" size="lg">Explore Events</Button>
      </div>
    </div>
  );
};

export default HeroSection;