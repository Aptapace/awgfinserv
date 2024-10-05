import React, { useState, useEffect } from 'react';
import {
  Layout,
  Typography,
  Collapse,
  Spin,
  Alert,
  Card,
  Row,
  Col,
  message,
} from 'antd';
import axios from 'axios';

const { Title } = Typography;
const { Panel } = Collapse;
const { Content } = Layout;

const hosturl = 'http://localhost:5000';

export default function HistoryDetails({ navigate }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [plans, setPlans] = useState([]);
  const [monthlyReturns, setMonthlyReturns] = useState([]);

  useEffect(() => {
    const fetchUserAndPlans = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        message.error('User not logged in');
        navigate('/login');
        return;
      }

      try {
        const userResponse = await axios.get(`${hosturl}/api/app-users/${userId}`);
        const plansResponse = await axios.get(`${hosturl}/api/purchaseplans?userId=${userId}`);

        setPlans(plansResponse.data.filter(plan => plan.userId === userId));
        setMonthlyReturns(userResponse.data.monthlyReturns || []);
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndPlans();
  }, [navigate]);

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  const paidReturns = monthlyReturns.length > 0 ? monthlyReturns[0].returns.filter(returnItem => returnItem.status === 'paid') : [];

  
  return (
    <Layout>
      <Content style={styles.container}>
        <Title level={4} style={styles.title}>Investment Details</Title>
        <Collapse  className="history-collapse">
          <Panel header="Investment Details"style={styles.collapseHeader}>
            {plans.length > 0 ? (
              plans.map(plan => (
                <Card key={plan._id} style={styles.card} hoverable onMouseEnter={e => (e.currentTarget.style.transform = styles.cardHover.transform)} onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                  <Row>
                    <Col span={12}><strong style={styles.strong}>Selected Plan:</strong> {plan.planType}</Col>
                    <Col span={12}><strong style={styles.strong}>No of Months:</strong> {plan.months}</Col>
                  </Row>
                  <Row>
                    <Col span={12}><strong style={styles.strong}>Investment:</strong> {plan.investment}</Col>
                    <Col span={12}><strong style={styles.strong}>Monthly Returns:</strong> {(plan.returns / plan.months).toFixed(2)}</Col>
                  </Row>
                  <Row>
                    <Col span={12}><strong style={styles.strong}>Total Returns:</strong> {plan.returns}</Col>
                    <Col span={12}><strong style={styles.strong}>Total Amount:</strong> {plan.totalAmount}</Col>
                  </Row>
                </Card>
              ))
            ) : (
              <p>No active plans found.</p>
            )}
          </Panel>

        </Collapse>
      </Content>
    </Layout>
  );
}
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    maxHeight: '100%', 
    overflowY: 'auto',  // Enable vertical scrolling
  },
  title: {
    color: '#333',
    fontWeight: 600,
  },
  collapseHeader: {
    backgroundColor: 'green',
    color: 'white',
    borderRadius: '8px',
    // fontWeight:'bold'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s',
    marginBottom: '10px',
  },
  cardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
  },
  strong: {
    color: '#555',
  },
};
