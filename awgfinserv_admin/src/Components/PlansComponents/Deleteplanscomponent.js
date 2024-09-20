import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaTachometerAlt } from "react-icons/fa";
import './planscomponent.css'; 
export default function Deleteplanscomponent() {
  const hosturl = 'http://192.168.1.6:5000';
  const [plans, setPlans] = useState([]);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [planIDToDelete, setPlanIDToDelete] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${hosturl}/plans`);
        const plansData = response.data.map(plan => ({
          id: plan.planID,
          type: plan.name.split(' ')[0],
          minInvestment: plan.minAmount,
          roi: plan.interestRate,
          duration: plan.numberOfMonths
        }));
        setPlans(plansData);
      } catch (error) {
        console.error('Error retrieving plans:', error.message);
      }
    };

    fetchPlans();
  }, []);

  const handleDeleteClick = () => {
    setShowDeleteForm(true);
  };

  const handleDeletePlan = async () => {
    try {
      await axios.delete(`${hosturl}/plans/${planIDToDelete}`);
      setPlans(plans.filter(plan => plan.id !== planIDToDelete));
      setShowDeleteForm(false);
      setPlanIDToDelete('');
      setError('');
    } catch (error) {
      setError('Error deleting plan: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    setPlanIDToDelete(e.target.value);
  };

  const styles = {
    container: {
      height: '550px',
      overflowY: 'auto',
      overflowX: 'hidden',
      width: '102%',
      padding: '20px',
      boxSizing: 'border-box',
      backgroundColor:'#f0f0f0'
    },
    headingContainer: {
      marginBottom: '20px',
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
    },
    icon: {
      fontSize: '24px',
      marginRight: '10px',
    },
    heading: {
      fontSize: '18px',
      margin: 0,
    },
    tableContainer: {
      maxHeight: '400px',
      overflowY: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      border: '1px solid #ddd',
      padding: '8px',
      backgroundColor: '#f4f4f4',
    },
    td: {
      border: '1px solid #ddd',
      padding: '8px',
    },
    deleteForm: {
      position: 'fixed',
      top: '20%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '350px',
      background: 'white',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      padding: '10px',
      borderRadius: '4px',
    },
    deleteFormHeader: {
      display: 'flex',
      alignItems: 'center',
      // justifyContent: 'space-between',
      padding: '10px',
      borderBottom: '1px solid #ccc',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      marginleft:'50px'
    },
    inputField: {
      padding: '10px',
      width: 'calc(100% - 22px)',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    formActions: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '10px',
    },
    cancelButton: {
      padding: '10px',
      backgroundColor: '#ccc',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '2px',
    },
    confirmButton: {
      padding: '10px',
      backgroundColor: 'red',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '2px',
    },
    errorMessage: {
      color: 'red',
      fontSize: '14px',
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.headingContainer}>
        <div style={styles.iconContainer}>
          <FaTachometerAlt style={styles.icon} />
          <h5 style={styles.heading}>Delete Plans</h5>
        </div>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>S.No</th>
                <th style={styles.th}>Plan ID</th>
                <th style={styles.th}>Plan Name</th>
                <th style={styles.th}>Min Investment (INR)</th>
                <th style={styles.th}>ROI</th>
                <th style={styles.th}>Min Duration</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan, index) => (
                <tr key={plan.id}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{plan.id}</td>
                  <td style={styles.td}>{plan.type}</td>
                  <td style={styles.td}>{plan.minInvestment}</td>
                  <td style={styles.td}>{plan.roi}</td>
                  <td style={styles.td}>{plan.duration} months</td>
                  <td style={styles.td}>
                    <button onClick={handleDeleteClick}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showDeleteForm && (
          <div style={styles.deleteForm}>
            <div style={styles.deleteFormHeader}>
              <FaTrash style={{ fontSize: '22px', color: 'red' }} />
              <h5 style={{ marginRight: '50px', marginTop: '10px' }}>Delete Plan</h5>
              <button
                style={styles.closeButton}
                onClick={() => setShowDeleteForm(false)}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '10px' }}>
              <input
                type="text"
                placeholder="Enter Plan ID"
                value={planIDToDelete}
                onChange={handleInputChange}
                style={styles.inputField}
              />
              <div style={styles.formActions}>
                <button
                  onClick={() => setShowDeleteForm(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePlan}
                  style={styles.confirmButton}
                >
                  Confirm
                </button>
              </div>
              {error && <p style={styles.errorMessage}>{error}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
