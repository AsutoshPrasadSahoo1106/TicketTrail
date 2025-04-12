import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import CustomNavbar from "./components/Navbar";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import BuyTickets from "./pages/BuyTickets";


function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
}

function App() {
  return (
    <Router>
      <CustomNavbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events" element={<Events />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="organizer">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-event"
          element={
            <ProtectedRoute role="organizer">
              <CreateEvent />
            </ProtectedRoute>
          }
        />

        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/events/:id/buy" element={<BuyTickets />} />

      </Routes>
    </Router>
    
  );
}

export default App;
