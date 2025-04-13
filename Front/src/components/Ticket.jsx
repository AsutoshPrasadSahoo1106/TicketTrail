import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import styles from './Ticket.module.css';

const Ticket = ({ ticket }) => {
  const imageUrl = ticket.event.image || ticket.event.imageUrl;
  const fullImageUrl = imageUrl?.startsWith('http') 
    ? imageUrl 
    : `http://localhost:5000${imageUrl}`;

  const qrValue = JSON.stringify({
    ticketId: ticket._id,
    eventId: ticket.event._id,
    userId: ticket.userId,
  });

  const downloadPDF = async () => {
    const ticketElement = document.getElementById(`ticket-${ticket._id}`);
    const canvas = await html2canvas(ticketElement, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
    });
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`ticket-${ticket._id.slice(-6)}.pdf`);
  };

  return (
    <div className={styles.ticketContainer}>
      <div id={`ticket-${ticket._id}`}>
        <div className={styles.ticketHeader}>
          <h1 className={styles.eventTitle}>{ticket.event.title}</h1>
          <span className={styles.ticketType}>{ticket.ticketType}</span>
        </div>
        
        <div className={styles.ticketContent}>
          <div className={styles.eventImage}>
            <img 
              src={fullImageUrl} 
              alt={ticket.event.name}
              onError={(e) => {
                console.error('Image failed to load:', fullImageUrl);
                e.target.src = '/placeholder.jpg';
              }}
            />
          </div>

          <div className={styles.eventDetails}>
            <div className={styles.mainInfo}>
              <div className={styles.infoColumn}>
                <h3 className={styles.infoLabel}>Date</h3>
                <p className={styles.infoValue}>
                  {new Date(ticket.event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className={styles.infoColumn}>
                <h3 className={styles.infoLabel}>Time</h3>
                <p className={styles.infoValue}>
                  {new Date(ticket.event.date).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            <div className={styles.venueInfo}>
              <h3 className={styles.infoLabel}>Venue</h3>
              <p className={styles.venueValue}>{ticket.event.venue}</p>
              <p className={styles.locationValue}>{ticket.event.location}</p>
            </div>

            <div className={styles.ticketInfo}>
              <div className={styles.infoColumn}>
                <h3 className={styles.infoLabel}>Quantity</h3>
                <p className={styles.infoValue}>{ticket.quantity}</p>
              </div>
              <div className={styles.infoColumn}>
                <h3 className={styles.infoLabel}>Ticket ID</h3>
                <p className={styles.infoValue}>#{ticket._id.slice(-6)}</p>
              </div>
            </div>
          </div>

          <div className={styles.qrSection}>
            <QRCodeSVG
              value={qrValue}
              size={100}
              level="H"
              includeMargin={true}
            />
          </div>
        </div>
      </div>
      <div className={styles.downloadSection}>
        <button 
          className={styles.downloadButton}
          onClick={downloadPDF}
        >
          Download Ticket
        </button>
      </div>
    </div>
  );
};

export default Ticket;