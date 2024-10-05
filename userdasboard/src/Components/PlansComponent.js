import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Spin, Alert, Button } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const { Meta } = Card;

const PlansDisplay = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hosturl = 'http://localhost:5000';
  const navigate = useNavigate(); // Use useNavigate instead of useNavigation

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${hosturl}/plans`);
        setPlans(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" />;
  }

  const handleSelectPlan = (plan) => {
    navigate('/home/plandetails', { state: { plan } }); 
    console.log("plan", plan)
  };

  return (
    <div style={styles.container}>
      <h5 style={styles.heading}>Available Plans</h5>
      <Row gutter={[16, 16]} justify="start">
        {plans.map((plan) => (
          <Col span={6} key={plan.planID}>
            <Card
              hoverable
              style={styles.card}
              bodyStyle={{ textAlign: 'left' }}
            >
              <Meta title={plan.name} description={`Interest Rate: ${plan.interestRate}%`} />
              <div style={styles.details}>
                <p>Duration: {plan.numberOfMonths} months</p>
                <p>Min Amount: {plan.minAmount}</p>
                <p>Max Amount: {plan.maxAmount}</p>
              </div>
              <Button type="primary" style={styles.selectButton} onClick={() => handleSelectPlan(plan)}>
                Select Plan
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    overflowY: 'auto', // Add this line
    maxHeight: '100%',
    width:'102%'
  },
  heading: {
    textAlign: 'left',
    marginBottom: '20px',
  },
  card: {
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s',
  },
  details: {
    margin: '16px 0',
  },
  selectButton: {
    borderRadius: '20px',
    position: 'relative',
    bottom: 0, // Aligns button at the bottom
  },
};

export default PlansDisplay;
