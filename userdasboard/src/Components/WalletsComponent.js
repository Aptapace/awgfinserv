import React, { useEffect, useState } from 'react';
import {
    Button,
    List,
    Typography,
    Spin,
    Card,
    Space,
    message,
    Layout,
    Divider,
    Tag,
} from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Content } = Layout;

const ReinvestScreen = () => {
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [monthlyReturns, setMonthlyReturns] = useState(0);
    const [loading, setLoading] = useState(true);
    const [investment, setInvestment] = useState(0);
    const [interestRate, setInterestRate] = useState(0);
    const [reinvestDisabled, setReinvestDisabled] = useState(true);
    const [lastReinvestmentDate, setLastReinvestmentDate] = useState(null);
    const [nextAvailableDate, setNextAvailableDate] = useState(null);
    const [detailsVisible, setDetailsVisible] = useState(false); // New state for toggling details
    const hosturl = 'http://localhost:5000';
    const navigate = useNavigate();

    const styles = {
        content: {
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            overflowY: 'auto',
            maxHeight: '100%',
            width:'101.5%'

        },
        card: {
            marginTop: '20px',
            border: 'none',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            padding: '20px',
        },
        planCard: {
            width: '100%',
            marginBottom: '10px',
            border: 'none',
            borderRadius: '10px',
            transition: '0.3s',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#f9f9f9',
        },
        button: {
            float: 'right',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
        },
        reinvestButton: {
            borderRadius: '5px',
            backgroundColor: '#4CAF50',
            color: 'white',
        },
        errorText: {
            color: 'red',
        },
    };

    useEffect(() => {
        const fetchUserAndPlans = async () => {
            try {
                const storedUserId = localStorage.getItem('userId');
                if (!storedUserId) {
                    message.error('User ID not found');
                    return;
                }
                setLoading(true);
                const plansResponse = await axios.get(`${hosturl}/api/purchaseplans?userId=${storedUserId}`);
                const userPlans = plansResponse.data.filter(plan => plan.userId === storedUserId && plan.status === 'activated');
                if (userPlans.length > 0) {
                    setPlans(userPlans);
                } else {
                    message.info('No activated plans.');
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
                message.error('Failed to load data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndPlans();
    }, []);

    const fetchMonthlyReturns = async (planId) => {
        try {
            const returnsResponse = await axios.get(`${hosturl}/api/monthlyreturns?planId=${planId}`);
            const monthlyReturnsData = returnsResponse.data.find(data => data.planId === planId);

            if (monthlyReturnsData && Array.isArray(monthlyReturnsData.returns)) {
                const upcomingReturn = monthlyReturnsData.returns.find(returnItem => returnItem.status === 'upcoming');

                if (upcomingReturn) {
                    setMonthlyReturns(upcomingReturn.amount);
                } else {
                    resetMonthlyReturns();
                }

                const recentDate = new Date();
                const nextAvailableDate = new Date(recentDate);
                nextAvailableDate.setMonth(nextAvailableDate.getMonth() + 1);

                setLastReinvestmentDate(recentDate);
                setNextAvailableDate(nextAvailableDate);
                setReinvestDisabled(new Date() < nextAvailableDate);
            } else {
                resetMonthlyReturns();
            }
        } catch (error) {
            console.error('Error fetching monthly returns:', error.message);
            message.error('Failed to fetch monthly returns');
        }
    };

    const fetchPlanDetails = async (planId) => {
        try {
            const planResponse = await axios.get(`${hosturl}/plans`);
            const planDetails = planResponse.data.find(plan => plan.planID === String(planId));
            if (planDetails) {
                setInterestRate(parseFloat(planDetails.interestRate));
            } else {
                console.error('Plan details not found for planId:', planId);
            }
        } catch (error) {
            console.error('Error fetching plan details:', error.message);
            message.error('Failed to fetch plan details');
        }
    };

    const handlePlanSelect = async (plan) => {
        if (selectedPlan?.planId === plan.planId) {
            setDetailsVisible(!detailsVisible); // Toggle visibility
        } else {
            setSelectedPlan(plan);
            setInvestment(plan.investment);
            await fetchMonthlyReturns(plan.planId);
            await fetchPlanDetails(plan.planId);
            setDetailsVisible(true); // Show details
        }
    };

    const handleReinvest = async () => {
        if (!selectedPlan || monthlyReturns <= 0) {
            message.error('No valid plan selected or returns available for reinvestment');
            return;
        }

        const newInvestment = investment + monthlyReturns;
        const newMonthlyReturns = calculateMonthlyReturns(newInvestment);

        try {
            const response = await axios.post(`${hosturl}/api/reinvest`, {
                planId: selectedPlan.planId,
                newInvestment,
                newMonthlyReturns,
            });

            if (response.status === 200) {
                message.success('Reinvestment successful!');
                setInvestment(newInvestment);
                setMonthlyReturns(newMonthlyReturns);
            } else {
                message.error(response.data.error || 'Failed to reinvest');
            }
        } catch (error) {
            console.error('Error during reinvestment:', error.message);
            message.error('Failed to connect to the server');
        }
    };

    const calculateMonthlyReturns = (investment) => {
        const interestRateDecimal = interestRate / 100 / 12;
        return investment * interestRateDecimal;
    };

    const resetMonthlyReturns = () => {
        setMonthlyReturns(0);
        setLastReinvestmentDate(null);
        setNextAvailableDate(null);
        setReinvestDisabled(true);
    };

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <Layout style={styles.content}>
            <Content >
                <Title level={3} style={{marginBottom: '20px', color: '#4CAF50' }}>Wallets</Title>

                <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
                    {plans.length > 0 ? (
                        <List
                            bordered
                            dataSource={plans}
                            renderItem={(item) => (
                                <List.Item onClick={() => handlePlanSelect(item)}>
                                    <Card
                                        style={styles.planCard}
                                        hoverable
                                    >
                                        <Text strong>Plan ID: {item.planId}</Text><br />
                                        <Text>Investment: ₹{item.investment.toFixed(2)}</Text><br />
                                        <Text>Status: <Tag color="green">{item.status}</Tag></Text>
                                        <Button style={styles.button}>View</Button>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    ) : (
                        <Text>No activated plans found.</Text>
                    )}
                </div>

                {detailsVisible && selectedPlan && (
                    <Card style={styles.card}>
                        <Title level={5}>Selected Plan ID: {selectedPlan.planId}</Title>
                        <Divider />
                        <Text strong>Available Monthly Returns: </Text>
                        <Text>₹{monthlyReturns > 0 ? monthlyReturns.toFixed(2) : '0.00'}</Text>
                        <br />
                        <Text strong>Investment Amount: </Text>
                        <Text>₹{investment.toFixed(2)}</Text>
                        <br />
                        <Text strong>Interest Rate: </Text>
                        <Text>{interestRate}%</Text>
                        <br />
                        {lastReinvestmentDate ? (
                            <>
                                <Text strong>Last Reinvestment Date: </Text>
                                <Text>{lastReinvestmentDate.toLocaleDateString()}</Text>
                                <br />
                                <Text strong>Next Available Reinvestment Date: </Text>
                                <Text>{nextAvailableDate ? nextAvailableDate.toLocaleDateString() : 'N/A'}</Text>
                            </>
                        ) : (
                            <Text>No reinvestment history available.</Text>
                        )}
                        <Space style={{ marginTop: '10px', display: 'block' }}>
                            {!reinvestDisabled ? (
                                <Button type="primary" onClick={handleReinvest} style={styles.reinvestButton}>
                                    Reinvest
                                </Button>
                            ) : (
                                <Text style={styles.errorText}>
                                    Reinvestment is disabled until {nextAvailableDate ? nextAvailableDate.toLocaleDateString() : 'N/A'}.
                                </Text>
                            )}
                        </Space>
                    </Card>
                )}
            </Content>
        </Layout>
    );
};

export default ReinvestScreen;
