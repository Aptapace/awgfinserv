import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Slider, Input, Button, Typography, Card, Row, Col, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useCalculation } from './CalculatorContext';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const PlanDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan } = location.state || {};

  const [inputMonths, setInputMonths] = useState(plan?.numberOfMonths?.toString() || '0');
  const [inputInvestment, setInputInvestment] = useState(plan?.minAmount?.toString() || '0');
  const [monthsError, setMonthsError] = useState('');
  const [investmentError, setInvestmentError] = useState('');

  const { calculateReturns } = useCalculation();

  const months = parseInt(plan?.numberOfMonths) || 0;
  const investment = parseFloat(plan?.minAmount) || 0;
  const roi = parseFloat(plan?.interestRate) || 0;

  const [monthlyReturns, setMonthlyReturns] = useState(calculateReturns(months, investment, roi));

  useEffect(() => {
    setMonthlyReturns(calculateReturns(parseInt(inputMonths, 10), parseFloat(inputInvestment), roi));
  }, [inputMonths, inputInvestment, roi]);

  const handleMonthsChange = (value) => {
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue) || numericValue < months) {
      setMonthsError(`Number of months cannot be less than ${months}`);
      setInputMonths(months.toString());
    } else if (numericValue > 120) {
      setMonthsError('Number of months cannot be more than 120');
      setInputMonths('120');
    } else {
      setMonthsError('');
      setInputMonths(value);
    }
  };

  const handleInvestmentChange = (value) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue < investment || numericValue > parseFloat(plan?.maxAmount)) {
      setInvestmentError('Invalid value');
    } else {
      setInvestmentError('');
      setInputInvestment(value);
    }
  };

  const handlePaymentPage = () => {
    const lastReturn = monthlyReturns[parseInt(inputMonths, 10) - 1];
    const returns = lastReturn ? lastReturn.returns : '0';
    const totalAmount = lastReturn ? lastReturn.totalAmount : '0';

    navigate('/home/Paymentspage', {
      state: {
        planType: plan?.name,
        months: parseInt(inputMonths, 10),
        investment: parseFloat(inputInvestment),
        returns,
        totalAmount,
        planId: plan?.planID,
      },
    });
  };

  return (
    <Layout style={styles.layout}>
      <Header style={styles.header}>
        <Text style={styles.headerTitle}>Plan Details</Text>
      </Header>
      <Content style={styles.content}>
        <Card title={plan?.name} style={styles.planCard}>
          <Text>Minimum Investment: <span style={styles.amount}>₹{investment.toLocaleString()}</span></Text><br />
          <Text>Duration: <span style={styles.amount}>{months} months</span></Text><br />
          <Text>Interest Rate: <span style={styles.amount}>{roi}%</span></Text>
        </Card>

        <Card style={styles.sliderCard}>
          <Text style={styles.cardTitle}>Select Duration (Months):</Text>
          <Slider
            min={months}
            max={120}
            step={1}
            value={parseInt(inputMonths, 10)}
            onChange={value => setInputMonths(value.toString())}
            tooltipVisible
            style={styles.slider}
          />
          <Input
            value={inputMonths}
            onChange={e => handleMonthsChange(e.target.value)}
            prefix={<UserOutlined />}
            style={{ ...styles.inputField, borderColor: monthsError ? 'red' : '' }}
          />
          {monthsError && <Text style={styles.errorText}>{monthsError}</Text>}
        </Card>

        <Card style={styles.investmentCard}>
          <Text style={styles.cardTitle}>Select Investment:</Text>
          <Row gutter={16}>
            <Col span={12}>
              <Text>Invested Amount</Text>
              <Input
                value={inputInvestment}
                onChange={e => handleInvestmentChange(e.target.value)}
                prefix={<UserOutlined />}
                style={{ ...styles.inputField, borderColor: investmentError ? 'red' : '' }}
              />
              {investmentError && <Text style={styles.errorText}>{investmentError}</Text>}
              <Text>Maturity Amount: <span style={styles.highlightAmount}>₹{monthlyReturns[parseInt(inputMonths, 10) - 1]?.totalAmount || '0'}</span></Text>
            </Col>
          </Row>
          <Slider
            min={investment}
            max={parseFloat(plan?.maxAmount)}
            step={1000}
            value={parseFloat(inputInvestment)}
            onChange={value => setInputInvestment(value.toString())}
            className="slider"
            style={styles.slider}
          />
        </Card>

        <h4 style={styles.sectionTitle}>Monthly Returns</h4>
        <div style={styles.returnsContainer}>
          <Space direction="horizontal" style={styles.returnsSpace}>
            {monthlyReturns.map((item, index) => (
              <Card key={index} style={styles.returnsCard}>
                <Text strong style={styles.monthText}>{index + 1} Month</Text><br/>
                <Text>Investment: <span className={styles.returnText}>₹{item.investment.toLocaleString()}</span></Text><br />
                <Text>Returns: <span className={styles.returnText}>₹{item.returns.toLocaleString()}</span></Text><br />
                <Text>Total Amount: <span className={styles.highlightAmount}>₹{item.totalAmount.toLocaleString()}</span></Text>
              </Card>
            ))}
          </Space>
        </div>

        <h5 style={styles.sectionTitle}>Total Summary</h5>
        <Card style={{ ...styles.card, backgroundColor: '#f0f0f0' }}>
          <Col span={12}>
            <Text>Selected Months:</Text>
            <Text>{inputMonths}</Text>
          </Col>
          <Col span={12}>
            <Text>Investment:</Text>
            <Text style={styles.amount}>₹{inputInvestment.toLocaleString()}</Text>
          </Col>
          <Col span={12}>
            <Text>Total Returns:</Text>
            <Text style={styles.amount}>₹{monthlyReturns[parseInt(inputMonths, 10) - 1]?.returns || '0'}</Text>
          </Col>
          <Col span={12}>
            <Text>Total Amount:</Text>
            <Text style={styles.amount}>₹{monthlyReturns[parseInt(inputMonths, 10) - 1]?.totalAmount || '0'}</Text>
          </Col>
        </Card>

        <div style={styles.buttonContainer}>
          <Button type="primary" onClick={handlePaymentPage} style={styles.proceedButton}>
            Proceed To Payment
          </Button>
        </div>
      </Content>
      <Footer style={styles.footer}>Footer Content</Footer>
    </Layout>
  );
};

export default PlanDetailPage;

const styles = {
  layout: {
    backgroundColor: '#f7f9fc',
    overflowY: 'auto',
    width: '100%',
    maxHeight: '100%',
  },
  header: {
    backgroundColor: '#4a90e2',
    padding: '16px',
  },
  headerTitle: {
    color: 'white',
    fontSize: '22px',
  },
  content: {
    padding: '20px',
  },
  planCard: {
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
  },
  sliderCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    transition: '0.3s',
  },
  investmentCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
  },
  returnsContainer: {
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    marginBottom: '20px',
  },
  returnsSpace: {
    display: 'inline-flex',
  },
  returnsCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '10px',
    textAlign: 'center',
    marginRight: '10px',
    display: 'inline-block',
    minWidth: '180px',
    transition: '0.3s',
    backgroundColor: '#f9f9f9',
  },
  monthText: {
    fontSize: '16px',
    marginBottom: '8px',
    color: '#333',
  },
  highlightAmount: {
    fontWeight: 'bold',
    color: '#4a90e2',
    fontSize: '16px',
  },
  returnText: {
    color: '#333',
  },
  inputField: {
    borderRadius: '4px',
    borderColor: '#e0e0e0',
    '&:hover': {
      borderColor: '#4a90e2',
    },
  },
  errorText: {
    color: 'red',
    fontSize: '12px',
  },
  proceedButton: {
    width: '100%',
    marginTop: '20px',
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
    '&:hover': {
      backgroundColor: '#357ab8',
    },
  },
  buttonContainer: {
    marginTop: '20px',
  },
  footer: {
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    padding: '10px',
  },
  slider: {
    margin: '10px 0',
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  },
  sectionTitle: {
    color: '#4a90e2',
    fontWeight: '600',
    marginTop: '20px',
    marginBottom: '10px',
  },
};

