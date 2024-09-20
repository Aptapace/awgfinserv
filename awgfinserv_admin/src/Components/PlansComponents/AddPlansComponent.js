import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaCalculator, FaChevronLeft, FaChevronRight,FaTachometerAlt } from 'react-icons/fa';
import './planscomponent.css'; 

export default function AddPlansComponent() {
  const hosturl = 'http://localhost:4500';
  const [formData, setFormData] = useState({
    name: '',
    interestRate: '',
    numberOfMonths: '',
    minAmount: '',
    maxAmount: '',
  });

  const [monthlyReturns, setMonthlyReturns] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    if (formData.minAmount && formData.interestRate && formData.numberOfMonths) {
      const amount = parseFloat(formData.minAmount.replace(/,/g, ''));
      const rate = parseFloat(formData.interestRate);
      const months = parseInt(formData.numberOfMonths, 10);

      if (!isNaN(amount) && !isNaN(rate) && !isNaN(months)) {
        const returns = calculateMonthlyReturns(amount, rate, months);
        setMonthlyReturns(returns);
      }
    }
  }, [formData.minAmount, formData.interestRate, formData.numberOfMonths]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${hosturl}/Add-plans`, formData);
      const newPlan = response.data;
      // No need to recalculate returns here, it's handled by the useEffect
    } catch (error) {
      console.error('Error adding plan:', error);
    }
  };

  const calculateMonthlyReturns = (amount, interestRate, numberOfMonths) => {
    const rate = interestRate / 100;
    const monthlyRate = rate / 12;
    const returns = [];

    for (let month = 1; month <= numberOfMonths; month++) {
      const monthlyReturn = amount * Math.pow(1 + monthlyRate, month) - amount;
      const totalAmount = amount + monthlyReturn;
      returns.push({
        month,
        displayMonth: `Month ${month}`,
        investment: amount.toFixed(2),
        returns: monthlyReturn.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
      });
    }

    return returns;
  };

  const months = parseInt(formData.numberOfMonths, 10) || 0;
  const investment = parseFloat(formData.minAmount.replace(/,/g, '')) || 0;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div style={styles.container}>
       <div className="heading-container">
        <div className="icon-container">
          <FaTachometerAlt className="icon" />
        </div>
        <h5 className="heading">Add Plans</h5>
      </div>
       <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Plan Name"
          style={styles.input}
        />
        <input
          type="text"
          name="interestRate"
          value={formData.interestRate}
          onChange={handleChange}
          placeholder="Interest Rate (%)"
          style={styles.input}
        />
        <input
          type="number"
          name="numberOfMonths"
          value={formData.numberOfMonths}
          onChange={handleChange}
          placeholder="Number of Months"
          style={styles.input}
        />
        <input
          type="text"
          name="minAmount"
          value={formData.minAmount}
          onChange={handleChange}
          placeholder="Minimum Amount"
          style={styles.input}
        />
        <input
          type="text"
          name="maxAmount"
          value={formData.maxAmount}
          onChange={handleChange}
          placeholder="Maximum Amount"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Add Plan</button>
      </form>
      <div style={styles.returnsWrapper}>
        <button style={styles.scrollButton} onClick={scrollLeft}><FaChevronLeft /></button>
        <div ref={scrollRef} style={styles.returnsContainer}>
          {monthlyReturns.map((item) => (
            <div key={item.month} style={styles.returnCard}>
              <div style={styles.returnMonth}>{item.displayMonth}</div>
              <div style={styles.returnDetail}>Investment: {item.investment}</div>
              <div style={styles.returnDetail}>Returns: {item.returns}</div>
              <div style={styles.returnDetail}>Total Amount: {item.totalAmount}</div>
            </div>
          ))}
        </div>
        <button style={styles.scrollButton} onClick={scrollRight}><FaChevronRight /></button>
      </div>
      <div style={styles.summaryContainer}>
        <div style={styles.summaryHeading}>
          <FaCalculator size={23} color="green" style={styles.icon} />
          <h2 style={styles.summaryTextHeading}>Plan Calculation</h2>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryText}>Selected Months:</span>
          <span style={styles.summaryValue}>{months}</span>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryText}>Investment:</span>
          <span style={styles.summaryValue}>{investment.toLocaleString()}</span>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryText}>Total Returns:</span>
          <span style={styles.summaryValue}>{monthlyReturns[months - 1]?.returns || '0'}</span>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryText}>Total Amount:</span>
          <span style={styles.summaryValue}>{monthlyReturns[months - 1]?.totalAmount || '0'}</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    width: '102%',
    height:'105%',
    overflow: 'auto', 
    // boxSizing: 'border-box', 
    margin: '0',
    backgroundColor: '#F0F0F0',
  },
  header: {
    fontSize: '2.5rem',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px',
    gap: '12px',
    marginRight:'50px'
  },
  input: {
    padding: '12px',
    width: '100%',
    maxWidth: '500px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  returnsWrapper: {
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden', // Prevent extra space
    gap: '10px',
    marginBottom: '20px',
    width: '100%',
    boxSizing: 'border-box',
  },
  scrollButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  returnsContainer: {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    padding: '10px',
    gap: '10px',
    flex: '1',
    boxSizing: 'border-box',
  },
  returnCard: {
    backgroundColor: '#F4F4F9',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    fontSize: '14px',
    minWidth: '300px',
    textAlign: 'left',
    boxSizing: 'border-box',
  },
  returnMonth: {
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  returnDetail: {
    marginBottom: '6px',
  },
  summaryContainer: {
    backgroundColor: '#E0F7FA',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    fontSize: '14px',
    textAlign: 'left',
    marginTop: '20px',
  },
  summaryHeading: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  },
  summaryTextHeading: {
    fontSize: '1.5rem',
    marginLeft: '10px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
  },
  summaryText: {
    fontWeight: 'bold',
  },
  summaryValue: {
    color: '#00796B',
  },
  icon: {
    marginRight: '10px',
  },
};
