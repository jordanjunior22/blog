"use client";
import React, { useEffect, useState } from 'react';

function Page() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscribers() {
      try {
        const res = await fetch('/api/subscribers');
        const data = await res.json();
        setSubscribers(data);
      } catch (error) {
        console.error('Failed to fetch subscribers:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscribers();
  }, []);

  // Function to convert subscriber data to CSV format
  const exportToCSV = () => {
    const header = ['Email', 'Subscribed At'];
    const rows = subscribers.map(subscriber => [
      subscriber.email,
      new Date(subscriber.subscribedAt).toLocaleString(),
    ]);

    // Create CSV string
    const csvContent = [
      header.join(','), // Add header row
      ...rows.map(row => row.join(',')), // Add subscriber rows
    ].join('\n');

    // Create a downloadable Blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'subscribers.csv';
    link.click();
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={styles.header}>Subscribers</h1>
      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : (
        <div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Email</th>
                <th style={styles.tableHeader}>Subscribed At</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber._id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{subscriber.email}</td>
                  <td style={styles.tableCell}>
                    {new Date(subscriber.subscribedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Export Button */}
          <button onClick={exportToCSV} style={styles.exportButton}>
            Export to CSV
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  header: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: '#777',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '30px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
  tableHeader: {
    backgroundColor: '#F7F7F7',
    fontSize: '1.1rem',
    color: '#555',
    padding: '12px 15px',
    textAlign: 'left',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },
  tableRow: {
    borderBottom: '1px solid #ddd',
  },
  tableCell: {
    padding: '12px 15px',
    textAlign: 'left',
    color: '#333',
    fontSize: '1rem',
  },
  exportButton: {
    padding: '12px 25px',
    fontSize: '1rem',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    display: 'block',
    margin: '0 auto',
    marginTop: '20px',
  },
  exportButtonHover: {
    backgroundColor: '#0056b3',
  },
};

export default Page;
