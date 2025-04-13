import { useState, useEffect } from 'react';
import axios from 'axios';
import Ticket from '../components/Ticket';
import styles from './MyTickets.module.css';


const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTickets(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Failed to fetch your tickets');
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loader}>
          <div className={styles.spinningCircle}></div>
          <p>Loading your tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span>
          <h2>{error}</h2>
          <p>Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (

    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Tickets</h1>
        <p className={styles.subtitle}>Manage your event tickets</p>
      </div>

      {tickets.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🎫</span>
          <h2>No Tickets Found</h2>
          <p>Looks like you haven't purchased any tickets yet.</p>
        </div>
      ) : (
        <div className={styles.ticketList}>
          {tickets.map((ticket, index) => (
            <div key={ticket._id}>
              <div className={styles.ticketWrapper}>
                <Ticket ticket={ticket} />
              </div>
              {index < tickets.length - 1 && <div className={styles.separator} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;