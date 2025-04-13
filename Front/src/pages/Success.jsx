import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from './Success.module.css';

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const confirmBooking = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          "http://localhost:5000/api/bookings/confirm",
          { sessionId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStatus("success");
      } catch (error) {
        console.error("Failed to confirm booking:", error);
        setStatus("error");
      }
    };

    if (sessionId) {
      confirmBooking();
    } else {
      setStatus("error");
    }
  }, [sessionId]);

  const handleViewBookings = () => {
    navigate("/bookings");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {status === "loading" && (
          <div>
            <div className={styles.loadingSpinner}></div>
            <h2 className={styles.title}>Processing Payment</h2>
            <p className={styles.message}>Please wait while we confirm your booking</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className={`${styles.icon} ${styles.successIcon}`}>✨</div>
            <h2 className={styles.title}>Payment Successful!</h2>
            <p className={styles.message}>Your booking has been confirmed successfully</p>
            <div className={styles.buttonGroup}>
              <button
                onClick={handleViewBookings}
                className={styles.primaryButton}
              >
                View My Bookings
              </button>
              <button
                onClick={handleGoHome}
                className={styles.secondaryButton}
              >
                Return to Homepage
              </button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className={`${styles.icon} ${styles.errorIcon}`}>⚠️</div>
            <h2 className={styles.title}>Oops! Something went wrong</h2>
            <p className={styles.message}>
              We couldn't confirm your booking. Please contact our support team.
            </p>
            <button
              onClick={handleGoHome}
              className={styles.primaryButton}
            >
              Return to Homepage
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Success;
