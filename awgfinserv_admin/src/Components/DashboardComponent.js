import React from 'react';

const Dashboard = () => {
  const styles = {
    dashboard: {
      backgroundColor: '#f6f6f6',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      left:'10px'
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
      display: 'flex',
      justifyContent: 'space-between',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '30px',
      width: '27%',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      position: 'relative',
    },
    cardTitle: {
      fontSize: '18px',
      marginBottom: '10px',
    },
    cardValue: {
      fontSize: '28px',
      marginBottom: '10px',
    },
    cardText: {
      fontSize: '14px',
      color: '#888',
    },
    icon: {
      fontSize: '20px',
      color: '#6c63ff',
      position: 'absolute',
      top: '20px',
      right: '20px',
    },
    salesCard: {
      background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    },
    ordersCard: {
      background: 'linear-gradient(135deg, #a6c1ee 0%, #fbc2eb 100%)',
    },
    visitorsCard: {
      background: 'linear-gradient(135deg, #a6c1ee 0%, #d4fc79 100%)',
    },
  };

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
        <div style={{ ...styles.card, ...styles.salesCard }}>
          <h3 style={styles.cardTitle}>Weekly Sales</h3>
          <h2 style={styles.cardValue}>$ 15,0000</h2>
          <p style={styles.cardText}>Increased by 60%</p>
          <i className="icon-chart" style={styles.icon} />
        </div>
        <div style={{ ...styles.card, ...styles.ordersCard }}>
          <h3 style={styles.cardTitle}>Weekly Orders</h3>
          <h2 style={styles.cardValue}>45,6334</h2>
          <p style={styles.cardText}>Decreased by 10%</p>
          <i className="icon-bookmark" style={styles.icon} />
        </div>
        <div style={{ ...styles.card, ...styles.visitorsCard }}>
          <h3 style={styles.cardTitle}>Visitors Online</h3>
          <h2 style={styles.cardValue}>95,5741</h2>
          <p style={styles.cardText}>Increased by 5%</p>
          <i className="icon-diamond" style={styles.icon} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
