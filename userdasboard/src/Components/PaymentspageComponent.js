import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Input, Select, Alert, Spin, Image, Collapse, Form } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const PaymentsPageComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { planType, months, investment, returns, totalAmount, planId } = location.state || {};

    const [paymentDetails, setPaymentDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transactionId, setTransactionId] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [selectedBankDetails, setSelectedBankDetails] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const hosturl = 'http://localhost:5000';

    useEffect(() => {
        fetchPaymentDetails();
    }, []);

    const fetchPaymentDetails = async () => {
        try {
            const response = await fetch(`${hosturl}/bankaccounts`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setPaymentDetails(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDone = () => {
        if (!selectedBank || !transactionId || !amount || !selectedImage) {
            message.error('Please fill all fields and select an image.'); // Use message.error for displaying the error
            return;
        }
    
        navigate('/home/finalpayment', {
            state: {
                selectedBank,
                amount,
                transactionId,
                selectedImage,
                months,
                investment,
                planType,
                returns,
                totalAmount,
                planId,
            },
        });
    };

    const handleBankSelect = (value) => {
        setSelectedBank(value);
        const bankDetails = paymentDetails.find((details) => details.bankname === value);
        setSelectedBankDetails(bankDetails);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return (
            <Layout style={styles.fullLayout}>
                <Content style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                </Content>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout style={styles.fullLayout}>
                <Content style={{ textAlign: 'center', padding: '50px' }}>
                    <Text type="danger">Error: {error}</Text>
                </Content>
            </Layout>
        );
    }

    return (
        <Layout style={styles.fullLayout}>
            <Header style={styles.header}>
                <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={styles.backButton} />
                <Title level={2} style={{ color: '#fff', margin: 0 }}>Payment Details</Title>
            </Header>
            <Content style={styles.content}>
                <div style={styles.paymentCard}>
                    <Form layout="vertical" style={{ marginTop: '20px' }}>
                        <Form.Item label="Select Bank">
                            <Select
                                value={selectedBank}
                                onChange={handleBankSelect}
                                placeholder="Select Bank"
                                style={{ width: '100%' }}
                                dropdownStyle={{ maxHeight: 200, overflowY: 'auto' }}
                            >
                                <Option disabled>Select Bank</Option>
                                {paymentDetails.map(item => (
                                    <Option key={item.bankname} value={item.bankname}>{item.bankname}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        {selectedBankDetails && (
                            <Collapse>
                                <Collapse.Panel header="Bank Details" key="1">
                                    <Text>Bank Name: {selectedBankDetails.bankname}</Text><br />
                                    <Text>Account Number: {selectedBankDetails.accountnumber}</Text><br />
                                    <Text>IFSC Code: {selectedBankDetails.ifsccode}</Text><br />
                                    <Text>Holder Name: {selectedBankDetails.holdername}</Text><br />
                                    <Text>Branch: {selectedBankDetails.branch}</Text>
                                </Collapse.Panel>
                            </Collapse>
                        )}
                        <Form.Item label="Enter Amount">
                            <Input
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                placeholder="Enter Amount"
                            />
                        </Form.Item>
                        <Form.Item label="Enter Transaction ID/UTR No">
                            <Input
                                value={transactionId}
                                onChange={e => setTransactionId(e.target.value)}
                                placeholder="Enter Transaction ID/UTR No"
                            />
                        </Form.Item>
                        <Form.Item label="Select Image">
                            <Input
                                type="file"
                                onChange={handleImageUpload}
                                style={styles.fileInput}
                            />
                            {selectedImage && (
                                <Image
                                    src={selectedImage}
                                    style={styles.image}
                                />
                            )}
                        </Form.Item>
                        <Button type="primary" onClick={handleDone} style={styles.button}>Done</Button>
                    </Form>
                </div>
            </Content>
        </Layout>
    );
};

export default PaymentsPageComponent;

const styles = {
    fullLayout: {
        width: '102%',
        height: '100%',
        overflow: 'hidden',
        overflowY: 'auto',
    },
    header: {
        background: '#2980B9',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
    },
    content: {
        padding: '20px',
        backgroundColor: '#f5f5f5',
        height: 'calc(100vh - 64px)', // Adjusting for header height
    },
    paymentCard: {
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    button: {
        width: '100%',
        marginTop: '10px',
    },
    fileInput: {
        marginBottom: '20px',
    },
    image: {
        width: '100%',
        height: 'auto',
        marginBottom: '20px',
    },
};
