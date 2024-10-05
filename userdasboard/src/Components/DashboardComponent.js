import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [dataCounts, setDataCounts] = useState({
    totalUsers: 0,
    totalPurchases: 0,
    totalPlans: 0,
    totalBankAccounts: 0,
    totalFeedbacks: 0,
    totalQAs: 0,
  });

  const hosturl = 'http://localhost:5000';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataCounts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${hosturl}/api/dashboard/counts`);
        const counts = await response.json();

        setDataCounts({
          totalUsers: counts.totalUsers || 0,
          totalPurchases: counts.totalPurchases || 0,
          totalPlans: counts.totalPlans || 0,
          totalBankAccounts: counts.totalBankAccounts || 0,
          totalFeedbacks: counts.totalFeedbacks || 0,
          totalQAs: counts.totalQAs || 0,
        });
      } catch (error) {
        console.error('Error fetching data counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataCounts();
  }, []);

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.dashboard}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <i className="icon-home" />
          <h2 style={styles.headerTitle}>Dashboard</h2>
        </div>
        <div style={styles.headerRight}>
          <h4 style={styles.overviewText}>Overview</h4>
          <i className="icon-info" />
        </div>
      </div>

      <div style={styles.cards}>
        {renderCard('Total Users', dataCounts.totalUsers, 'Users in the system')}
        {renderCard('Total Purchases', dataCounts.totalPurchases, 'Total purchases made')}
        {renderCard('Total Plans', dataCounts.totalPlans, 'Available plans')}
        {renderCard('Total Bank Accounts', dataCounts.totalBankAccounts, 'Registered bank accounts')}
        {renderCard('Total Feedbacks', dataCounts.totalFeedbacks, 'User feedbacks received')}
        {renderCard('Total Q&A', dataCounts.totalQAs, 'Questions and Answers')}
      </div>
    </div>
  );
};

const renderCard = (title, value, text) => (
  <div style={styles.card}>
    <h3 style={styles.cardTitle}>{title}</h3>
    <h2 style={styles.cardValue}>{value}</h2>
    <p style={styles.cardText}>{text}</p>
    <i className="icon-chart" style={styles.icon} />
  </div>
);

export default Dashboard;

const styles = {
  dashboard: {
    backgroundColor: '#f6f6f6',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  headerTitle: {
    marginLeft: '10px',
    fontSize: '24px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
  },
  overviewText: {
    marginRight: '5px',
    fontSize: '16px',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '30px',
    justifyItems: 'center', // Center the cards in the grid
    marginTop: '20px',
  },
  card: {
    backgroundColor: '#e0f7fa',
    borderRadius: '50%', // Circular card
    padding: '20px',
    height: '200px', // Fixed height for circular shape
    width: '200px', // Fixed width for circular shape
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'transform 0.3s, box-shadow 0.3s',
    position: 'relative',
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: '16px',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  cardValue: {
    fontSize: '32px',
    margin: '10px 0',
    color: '#333',
  },
  cardText: {
    fontSize: '12px',
    color: '#888',
  },
  icon: {
    fontSize: '20px',
    color: '#6c63ff',
    position: 'absolute',
    top: '10px',
    right: '10px',
  },
  loading: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '20px',
  },
};

// Adding hover effect
const cardHoverStyle = {
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 40px rgba(0, 0, 0, 0.2)',
  },
};

// Apply hover style to cards using a higher-order function
Object.assign(styles.card, cardHoverStyle);
