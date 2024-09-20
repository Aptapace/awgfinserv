import React, { useState, useEffect } from 'react';
import { Collapse } from 'react-collapse';
import * as XLSX from 'xlsx'; // Import the XLSX library

const Investments = () => {
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('pending');
  const [expandedPlanId, setExpandedPlanId] = useState(null);
  const [overlayImage, setOverlayImage] = useState(null);
  const hosturl = 'http://localhost:5000';

  useEffect(() => {
    const fetchPlansAndUsers = async () => {
      try {
        const plansResponse = await fetch(`${hosturl}/api/purchaseplans`);
        if (!plansResponse.ok) throw new Error('Failed to fetch plans');
        const plansData = await plansResponse.json();

        const userPromises = plansData
          .filter(plan => plan.userId)
          .map(plan =>
            fetch(`${hosturl}/api/app-users/${plan.userId}`).then(res => {
              if (!res.ok) throw new Error('Failed to fetch user details');
              return res.json();
            })
          );

        if (userPromises.length > 0) {
          const usersData = await Promise.all(userPromises);
          const userMap = usersData.reduce((acc, user) => {
            acc[user._id] = user;
            return acc;
          }, {});
          setUsers(userMap);
        }

        const sortedPlans = plansData.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        setPlans(sortedPlans);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlansAndUsers();
  }, []);

  const calculateEndDate = (submittedDate, months) => {
    const startDate = new Date(submittedDate);
    const endDate = new Date(startDate.setMonth(startDate.getMonth() + months));
    return endDate.toLocaleDateString();
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`${hosturl}/api/approvePlan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('Failed to approve plan');
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      alert(error.message);
    }
  };

  const toggleExpand = (planId) => {
    setExpandedPlanId(prevId => (prevId === planId ? null : planId));
  };

  const handleImageClick = (image) => {
    setOverlayImage(image);
  };

  const closeOverlay = () => {
    setOverlayImage(null);
  };

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(plans.map(plan => ({
      SerialNo: plan.serialNo,
      Username: users[plan.userId]?.username || 'N/A',
      PhoneNumber: users[plan.userId]?.phoneNumber || 'N/A',
      PlanType: plan.planType,
      TransactionID: plan.transactionId,
      Investment: plan.investment,
      Amount: plan.amount,
      Returns: plan.returns,
      TotalAmount: plan.totalAmount,
      Months: plan.months,
      SubmittedAt: new Date(plan.submittedAt).toLocaleString(),
      EndDate: calculateEndDate(plan.submittedAt, plan.months),
      SelectedBank: plan.selectedBank
    })), { header: ['SerialNo', 'Username', 'PhoneNumber', 'PlanType', 'TransactionID', 'Investment', 'Amount', 'Returns', 'TotalAmount', 'Months', 'SubmittedAt', 'EndDate', 'SelectedBank'] });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Plans');

    XLSX.writeFile(wb, 'InvestmentPlans.xlsx');
  };

  if (loading) {
    return <div style={styles.container}><span>Loading...</span></div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  const pendingPlans = plans.filter(plan => plan.status === 'pending');
  const activatedPlans = plans.filter(plan => plan.status === 'activated');

  const renderPlan = (plan, index) => {
    const user = users[plan.userId] || {};
    const isExpanded = expandedPlanId === plan._id;

    return (
      <div key={plan._id} style={styles.planContainer}>
        <div style={styles.planHeader}>
          <span style={styles.headerCell}>Serial No.</span>
          <span style={styles.headerCell}>Username</span>
          <span style={styles.headerCell}>Phone Number</span>
          <span style={styles.headerCell}>Plan Type</span>
          <span style={styles.headerCell}>Transaction ID</span>
          <span style={styles.headerCell}>Investment</span>
          <span style={styles.headerCell}></span>
        </div>
        <div style={styles.planRow}>
          <span style={styles.cell}>{index + 1}.</span>
          <p style={styles.cell}>{user.username || 'User details not available'}</p>
          <p style={styles.cell}>{user.phoneNumber || 'User details not available'}</p>
          <p style={styles.cell}>{plan.planType}</p>
          <p style={styles.cell}>{plan.transactionId}</p>
          <p style={styles.cell}>${plan.investment.toLocaleString()}</p>
          <p style={styles.cell}>
            <button
              style={styles.showMoreButton}
              onClick={() => toggleExpand(plan._id)}
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </button>
          </p>
        </div>
        <Collapse isOpened={isExpanded}>
          <div style={styles.collapseContainer}>
            <div style={styles.collapseContent}>
              <div style={styles.collapseItem}>
                <div style={styles.collapseTitle}>Selected Bank:</div>
                <div style={styles.collapseData}>{plan.selectedBank}</div>
              </div>
              <div style={styles.collapseItem}>
                <div style={styles.collapseTitle}>Amount:</div>
                <div style={styles.collapseData}>${plan.amount.toLocaleString()}</div>
              </div>
              <div style={styles.collapseItem}>
                <div style={styles.collapseTitle}>Returns:</div>
                <div style={styles.collapseData}>${plan.returns.toLocaleString()}</div>
              </div>
              <div style={styles.collapseItem}>
                <div style={styles.collapseTitle}>Total Amount:</div>
                <div style={styles.collapseData}>${plan.totalAmount.toLocaleString()}</div>
              </div>
              <div style={styles.collapseItem}>
                <div style={styles.collapseTitle}>Months:</div>
                <div style={styles.collapseData}>{plan.months}</div>
              </div>
              <div style={styles.collapseItem}>
                <div style={styles.collapseTitle}>Submitted At:</div>
                <div style={styles.collapseData}>{new Date(plan.submittedAt).toLocaleString()}</div>
              </div>
              <div style={styles.collapseItem}>
                <div style={styles.collapseTitle}>End Date:</div>
                <div style={styles.collapseData}>{calculateEndDate(plan.submittedAt, plan.months)}</div>
              </div>
              {plan.status === 'pending' && (
                <button
                  style={styles.approveButton}
                  onClick={() => handleApprove(plan._id)}
                >
                  Approve
                </button>
              )}
            </div>
            {plan.selectedImage && (
              <div style={styles.imageContainer}>
                <img
                  src={plan.selectedImage.startsWith('http') ? plan.selectedImage : `${hosturl}/uploads/${plan.selectedImage}`}
                  alt="Plan"
                  style={styles.image}
                  onClick={() => handleImageClick(plan.selectedImage)}
                />
              </div>
            )}
          </div>
        </Collapse>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <button
        style={styles.downloadButton}
        onClick={handleDownload}
      >
        Download
      </button>

      <div style={styles.buttonContainer}>
        <button
          style={{ ...styles.toggleButton, border: view === 'pending' ? '2px solid #007bff' : 'none' }}
          onClick={() => setView('pending')}
        >
          Pending
        </button>
       
        <button
          style={{ ...styles.toggleButton, border: view === 'activated' ? '2px solid #007bff' : 'none' }}
          onClick={() => setView('activated')}
        >
          Activated
        </button>
      </div>

      <div style={styles.sectionTitle}>{view === 'pending' ? 'Pending Plans' : 'Activated Plans'}</div>

      {view === 'pending' && pendingPlans.length === 0 && (
        <div style={styles.error}>No pending plans are available.</div>
      )}
      {view === 'pending' && pendingPlans.map(renderPlan)}

      {view === 'activated' && activatedPlans.length === 0 && (
        <div style={styles.error}>No activated plans are available.</div>
      )}
      {view === 'activated' && activatedPlans.map(renderPlan)}

      {overlayImage && (
        <div style={styles.overlay} onClick={closeOverlay}>
          <img src={overlayImage} alt="Overlay" style={styles.overlayImage} />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    position: 'relative',
    maxHeight: 'calc(100vh - 40px)', // Adjust height to leave space for header/footer if needed
    overflowY: 'auto', // Enable vertical scrolling
  },
  downloadButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    zIndex: 1, // Ensure button is above other content
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginBottom: '20px',
  },
  toggleButton: {
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '6px',
    border: '1px solid transparent',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
  },
  planContainer: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    position: 'relative',
    transition: 'transform 0.3s ease',
  },
  planHeader: {
    display: 'flex',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px',
    marginBottom: '10px',
    textAlign: 'center',
  },
  planRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    borderBottom: '1px solid #ddd',
    transition: 'background-color 0.3s ease',
  },
  headerCell: {
    flex: '1 1 0',
    fontWeight: 'bold',
    color: '#007bff',
    fontSize: '14px',
  },
  cell: {
    flex: '1 1 0',
    fontSize: '14px',
    color: '#333',
    margin: 0,
    textAlign: 'center',
  },
  approveButton: {
    padding: '8px 16px',
    cursor: 'pointer',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    marginTop: '10px',
    transition: 'background-color 0.3s ease',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  },
  collapseContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
  },
  collapseContent: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#f8f9fa',
    marginTop: '10px',
    flex: 1,
  },
  collapseItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  collapseTitle: {
    fontWeight: 'bold',
    color: '#333',
    minWidth: '150px',
  },
  collapseData: {
    flex: 1,
  },
  imageContainer: {
    width: '300px', // Adjust as needed
    height: '100%', // Match height of collapse content
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: '10px',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    cursor: 'pointer',
  },
  overlayImage: {
    maxWidth: '90%',
    maxHeight: '90%',
    objectFit: 'contain',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: '18px',
  },
  showMoreButton: {
    marginBottom: '10px',
    padding: '5px 10px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    borderRadius: 5,
    color: '#fff',
    border: 'none',
    transition: 'background-color 0.3s ease',
  },
};

export default Investments;
