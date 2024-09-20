import React, { useState, useEffect } from 'react';

const MonthlyReturns = () => {
    const [plans, setPlans] = useState([]);
    const [users, setUsers] = useState({});
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [transactionId, setTransactionId] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showPaidReturns, setShowPaidReturns] = useState(false);
    const hosturl = 'http://localhost:5000';

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch(`${hosturl}/api/monthlyreturns`);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setPlans(data);

                const userPromises = data.map(plan =>
                    fetch(`${hosturl}/api/app-users/${plan.userId}`).then(res => res.json())
                );
                const usersData = await Promise.all(userPromises);
                const usersMap = usersData.reduce((acc, user) => {
                    acc[user._id] = user;
                    return acc;
                }, {});
                setUsers(usersMap);
            } catch (error) {
                console.error('Error fetching plans:', error);
                setError('Failed to fetch plans');
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const closeOverlay = () => {
        setSelectedPlan(null);
        setTransactionId('');
        setError(null);
    };

    const handlePayReturn = (plan) => {
        setSelectedPlan(plan);
        const nextReturn = plan.returns.find(r => r.status === 'upcoming');
        if (nextReturn) setAmount(nextReturn.amount);
    };

    const handleSubmitPayReturn = async () => {
        if (!transactionId) {
            setError('Transaction ID is required');
            return;
        }

        setSubmitting(true);
        const monthlyReturnId = selectedPlan._id;
        const month = selectedPlan.returns.find(r => r.status === 'upcoming').month;

        try {
            const response = await fetch(`${hosturl}/api/payReturn`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ monthlyReturnId, month, transactionId }),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            console.log(data.message);
            closeOverlay();
        } catch (error) {
            console.error('Error paying return:', error);
            setError('Failed to pay return');
        } finally {
            setSubmitting(false);
        }
    };

    const togglePaidReturns = () => {
        setShowPaidReturns(prev => !prev);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    const paidPlans = plans.flatMap(plan =>
        plan.returns
            .filter(r => r.status === 'paid')
            .map(returnItem => ({
                ...plan,
                ...returnItem,
                username: users[plan.userId]?.username || 'N/A',
                phoneNumber: users[plan.userId]?.phoneNumber || 'N/A'
            }))
    ).sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.downloadButton}>Download</button>
                <div style={styles.buttonGroup}>
                    <button 
                        style={{ 
                            ...styles.filterButton, 
                            borderBottom: showPaidReturns ? 'none' : '2px solid #007bff' 
                        }} 
                        onClick={() => setShowPaidReturns(false)}
                    >
                        Pending Returns
                    </button>
                    <button 
                        style={{ 
                            ...styles.filterButton, 
                            borderBottom: showPaidReturns ? '2px solid #007bff' : 'none' 
                        }} 
                        onClick={togglePaidReturns}
                    >
                        Paid Returns
                    </button>
                </div>
            </div>

            <div style={styles.monthlyReturnsContainer}>
                <h3>{showPaidReturns ? 'Paid Returns' : 'Upcoming Returns'}</h3>
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>S.No.</th>
                                <th style={styles.th}>Username</th>
                                <th style={styles.th}>Phone Number</th>
                                <th style={styles.th}>Plan ID</th>
                                <th style={styles.th}>Month</th>
                                <th style={styles.th}>Amount (₹)</th>
                                {showPaidReturns && <th style={styles.th}>Date</th>}
                                {!showPaidReturns && <th style={styles.th}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {showPaidReturns
                                ? paidPlans.map((returnItem, index) => (
                                    <tr key={returnItem._id}>
                                        <td style={styles.td}>{index + 1}</td>
                                        <td style={styles.td}>{returnItem.username}</td>
                                        <td style={styles.td}>{returnItem.phoneNumber}</td>
                                        <td style={styles.td}>{returnItem.planId}</td>
                                        <td style={styles.td}>{returnItem.month}</td>
                                        <td style={styles.td}>₹{returnItem.amount}</td>
                                        <td style={styles.td}>{new Date(returnItem.paidAt).toLocaleDateString()}</td>
                                    </tr>
                                ))
                                : plans.map((plan, index) => {
                                    const nextReturn = plan.returns.find(r => r.status === 'upcoming');
                                    const user = users[plan.userId] || {};

                                    return nextReturn ? (
                                        <tr key={plan._id}>
                                            <td style={styles.td}>{index + 1}</td>
                                            <td style={styles.td}>{user.username || 'N/A'}</td>
                                            <td style={styles.td}>{user.phoneNumber || 'N/A'}</td>
                                            <td style={styles.td}>{plan.planId}</td>
                                            <td style={styles.td}>{nextReturn.month}</td>
                                            <td style={styles.td}>₹{nextReturn.amount}</td>
                                            <td style={styles.td}>
                                                <button style={styles.button} onClick={() => handlePayReturn(plan)}>
                                                    Pay Return
                                                </button>
                                            </td>
                                        </tr>
                                    ) : null;
                                })}
                        </tbody>
                    </table>
                </div>

                {selectedPlan && (
                    <div style={styles.overlay}>
                        <div style={styles.overlayContent}>
                            <div style={styles.overlayHeader}>
                                <h3>Confirm Payment</h3>
                                <span onClick={closeOverlay} style={styles.closeButton}>×</span>
                            </div>
                            <p><strong>Amount:</strong> ₹{amount}</p>
                            <label>
                                Transaction ID/UTR:
                                <input
                                    type="text"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    style={styles.input}
                                />
                            </label>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <div style={styles.buttonContainer}>
                                <button style={styles.overlayButtonCancel} onClick={closeOverlay}>
                                    Cancel
                                </button>
                                <button 
                                    style={styles.overlayButtonConfirm} 
                                    onClick={handleSubmitPayReturn}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Processing...' : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MonthlyReturns;

const styles = {
    container: { 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f4f8' 
    },
    header: { 
        display: 'flex',
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
    },
    downloadButton: { 
        backgroundColor: '#007bff', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '8px', 
        padding: '10px 20px', 
        cursor: 'pointer', 
        fontSize: '14px', 
        marginRight: '10px', 
        transition: 'background-color 0.3s ease', 
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)' 
    },
    buttonGroup: { 
        display: 'flex', 
        gap: '10px' 
    },
    filterButton: { 
        backgroundColor: 'transparent', 
        color: '#007bff', 
        border: 'none', 
        cursor: 'pointer', 
        fontSize: '16px', 
        padding: '10px 0', 
        transition: 'border-bottom 0.3s ease',
        fontWeight: '600',
    },
    monthlyReturnsContainer: { 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 6px 12px rgba(0,0,0,0.1)', 
        backgroundColor: '#ffffff' 
    },
    tableWrapper: { 
        overflowX: 'auto' 
    },
    table: { 
        width: '100%', 
        borderCollapse: 'collapse', 
        marginTop: '10px',
        borderRadius: '8px',
        overflow: 'hidden'
    },
    th: { 
        padding: '12px', 
        backgroundColor: '#007bff', 
        color: '#fff',
        textAlign: 'left',
        borderBottom: '2px solid #0056b3'
    },
    td: { 
        padding: '12px', 
        borderBottom: '1px solid #ddd' 
    },
    button: { 
        backgroundColor: '#28a745', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '8px', 
        padding: '8px 16px', 
        cursor: 'pointer', 
        transition: 'background-color 0.3s ease',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)' 
    },
    overlay: { 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    overlayContent: { 
        backgroundColor: '#fff', 
        padding: '20px', 
        borderRadius: '10px', 
        width: '400px', 
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)' 
    },
    overlayHeader: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    closeButton: { 
        cursor: 'pointer', 
        fontSize: '20px', 
        color: '#dc3545' 
    },
    input: { 
        width: '100%', 
        padding: '8px', 
        marginTop: '10px', 
        border: '1px solid #ccc', 
        borderRadius: '4px' 
    },
    buttonContainer: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '20px' 
    },
    overlayButtonCancel: { 
        backgroundColor: '#dc3545', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '8px', 
        padding: '10px 15px', 
        cursor: 'pointer' 
    },
    overlayButtonConfirm: { 
        backgroundColor: '#28a745', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '8px', 
        padding: '10px 15px', 
        cursor: 'pointer' 
    },
};
