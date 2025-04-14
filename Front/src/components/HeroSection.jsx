import { Button, Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const HeroSection = () => {
  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Carousel as Background with Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <Carousel controls={false} indicators={false} interval={3000} pause={false}>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://wallpapercave.com/w/wp1989190.jpg"
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
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://wallpapercave.com/w/wp10426684.jpg"
              alt="Jaisalmer"
              style={{ height: '100vh', objectFit: 'cover' }}
            />
          </Carousel.Item>
        </Carousel>
        {/* Overlay for fading the background */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7))', zIndex: 2 }}></div>
      </div>

      {/* Text and Button in Foreground */}
      <div className="position-absolute top-50 start-50 translate-middle text-center text-white" style={{ zIndex: 3 }}>
        <h1 className="display-1 fw-bold" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
          Welcome to TicketTrail 🎟
        </h1>
        <p className="fs-3 mt-3">Your gateway to amazing events and experiences.</p>
        <Button variant="light" size="lg" className="mt-4">
          Explore Events
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;