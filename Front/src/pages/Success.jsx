import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const confirmBooking = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.post("http://localhost:5000/api/bookings/confirm", { sessionId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Booking confirmed.");
      } catch (error) {
        console.error("Failed to confirm booking:", error);
      }
    };

    if (sessionId) confirmBooking();
  }, [sessionId]);

  return (
    <div className="text-center mt-5">
      <h2>🎉 Payment Successful!</h2>
      <p>Thank you for your purchase. Your booking is confirmed.</p>
    </div>
  );
};

export default Success;
