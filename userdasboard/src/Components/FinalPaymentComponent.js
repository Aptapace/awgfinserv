import React, { useState, useEffect } from 'react';
import { Form, Button, Image, Typography, Spin, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const hosturl = 'http://localhost:5000';

const FinalPaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedBank, amount, transactionId, selectedImage, months, investment, planType, returns, totalAmount, planId } = location.state || {};

    const [submitted, setSubmitted] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [loadingUser, setLoadingUser] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                message.error('User not logged in');
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get(`${hosturl}/api/app-users/${userId}`);
                setUser(response.data);
                setLoadingUser(false);
            } catch (error) {
                message.error('Error fetching user data');
                navigate('/login');
            }
        };

        fetchUser();
    }, [navigate]);

    useEffect(() => {
        let timer;
        if (submitted && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            navigate('/mainpage');
        }
        return () => clearInterval(timer);
    }, [submitted, countdown, navigate]);

    const handleSubmit = async () => {
        if (!user) {
            message.error('User data is not available');
            return;
        }

        setSubmitted(true);
        const formData = new FormData();
        formData.append('userId', user._id);
        formData.append('planID', planId);
        formData.append('selectedBank', selectedBank);
        formData.append('amount', Number(amount));
        formData.append('transactionId', transactionId);
        formData.append('months', Number(months));
        formData.append('investment', Number(investment));
        formData.append('planType', planType);
        formData.append('returns', Number(returns));
        formData.append('totalAmount', Number(totalAmount));

        if (selectedImage) {
            formData.append('selectedImage', {
                uri: selectedImage,
                type: 'image/jpeg',
                name: 'image.jpg',
            });
        }

        try {
            const response = await fetch(`${hosturl}/api/submitPlan`, {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                message.success('Plan submitted successfully');
            } else {
                const errorResponse = await response.json();
                message.error(`Failed to submit plan: ${errorResponse.message}`);
            }
        } catch (error) {
            message.error('Error submitting plan');
        }
    };

    if (submitted) {
        return (
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <CheckCircleOutlined style={{ fontSize: '50px', color: '#00C851' }} />
                    <Title level={3}>Your plan will be activated within 1 day.</Title>
                    <Text>Redirecting in {countdown} seconds...</Text>
                </div>
            </div>
        );
    }

    return (
        <Spin spinning={loadingUser}>
            <div style={containerStyle}>
                <Title level={3} style={{ marginBottom: '30px' }}>Final Payment Details</Title>
                <Form layout="vertical" style={{ width: '100%' }}>
                    {renderSummaryItem("Selected Months", months)}
                    {renderSummaryItem("Investment", investment ? investment.toLocaleString() : '0')}
                    {renderSummaryItem("Total Returns", returns)}
                    {renderSummaryItem("Total Amount", totalAmount)}
                    {renderSummaryItem("Plan Type", planType || 'N/A')}
                    {renderSummaryItem("Selected Bank", selectedBank || 'N/A')}
                    {renderSummaryItem("Amount", `$${amount || '0'}`)}
                    {renderSummaryItem("Transaction ID/UTR No", transactionId || 'N/A')}
                    {selectedImage ? (
                        <Image
                            src={selectedImage}
                            style={{ width: '100%', height: 'auto', borderRadius: '8px', marginTop: '15px' }}
                        />
                    ) : (
                        <Text>No image available</Text>
                    )}
                    <div style={footerStyle}>
                        <Button type="primary" onClick={handleSubmit} disabled={!user} style={buttonStyle}>
                            Submit
                        </Button>
                    </div>
                </Form>
            </div>
        </Spin>
    );
};

const renderSummaryItem = (label, value) => (
    <div style={summaryItemStyle}>
        <Text strong>{label}</Text>
        <Text>{value}</Text>
    </div>
);

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px',
    paddingBottom: '60px',
    margin: 'auto',
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
    overflowY: 'auto',
    maxHeight: '100vh',
};

const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px',
    fontWeight: 'bold',
};

const summaryItemStyle = {
    background: '#f5f5f5',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '15px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const footerStyle = {
    textAlign: 'center',
    marginTop: '30px',
    marginBottom: '60px',
};

const buttonStyle = {
    width: '100%', // Full width button
    height: '50px', // Increased height for a more modern look
    fontSize: '18px', // Larger text
    borderRadius: '8px', // Rounded corners
};

export default FinalPaymentPage;
