import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTachometerAlt } from 'react-icons/fa';
// import './PlansComponents/planscomponent.css';

export default function AddBankComponent() {
    const hosturl = 'http://localhost:5000';
    const [formData, setFormData] = useState({
        bankname: '',
        accountnumber: '',
        ifsccode: '',
        holdername: '',
        branch: '',
    });
    const [bankAccounts, setBankAccounts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        fetchBankAccounts();
    }, []);

    const fetchBankAccounts = async () => {
        try {
            const response = await axios.get(`${hosturl}/bankaccounts`);
            setBankAccounts(response.data);
        } catch (error) {
            console.error('Error fetching bank accounts:', error);
        }
    };

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
            if (isEditing) {
                await axios.put(`${hosturl}/bankAccount/${currentId}`, formData);
                alert('Bank account updated successfully');
            } else {
                await axios.post(`${hosturl}/bankAccount`, formData);
                alert('Bank account added successfully');
            }
            setFormData({
                bankname: '',
                accountnumber: '',
                ifsccode: '',
                holdername: '',
                branch: '',
            });
            setIsEditing(false);
            setCurrentId(null);
            fetchBankAccounts();
        } catch (error) {
            console.error('Error adding/updating bank account:', error);
        }
    };

    const handleEdit = (account) => {
        setFormData(account);
        setIsEditing(true);
        setCurrentId(account._id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${hosturl}/bankAccount/${id}`);
            alert('Bank account deleted successfully');
            fetchBankAccounts();
        } catch (error) {
            console.error('Error deleting bank account:', error);
        }
    };

    return (
        <div style={styles.container}>
            <div className="heading-container">
                <div className="icon-container">
                    <FaTachometerAlt className="icon" />
                </div>
                <h5 className="heading">Bank Account</h5>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    name="bankname"
                    value={formData.bankname}
                    onChange={handleChange}
                    placeholder="Bank Name"
                    style={styles.input}
                />
                <input
                    type="text"
                    name="accountnumber"
                    value={formData.accountnumber}
                    onChange={handleChange}
                    placeholder="Account Number"
                    style={styles.input}
                />
                <input
                    type="text"
                    name="ifsccode"
                    value={formData.ifsccode}
                    onChange={handleChange}
                    placeholder="IFSC Code"
                    style={styles.input}
                />
                <input
                    type="text"
                    name="holdername"
                    value={formData.holdername}
                    onChange={handleChange}
                    placeholder="Bank Holder Name"
                    style={styles.input}
                />
                <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="Branch"
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>
                    {isEditing ? 'Update Bank Account' : 'Add Bank Account'}
                </button>
            </form>

            <h5>Existing Bank Accounts:</h5>
            <div style={styles.cardContainer}>
                {bankAccounts.map(account => (
                    <div key={account._id} style={styles.card}>
                        <h6 style={styles.cardTitle}>{account.bankname}</h6>
                        <p><strong>Account Number:</strong> {account.accountnumber}</p>
                        <p><strong>IFSC Code:</strong> {account.ifsccode}</p>
                        <p><strong>Holder Name:</strong> {account.holdername}</p>
                        <p><strong>Branch:</strong> {account.branch}</p>
                        <div style={styles.cardActions}>
                            <button onClick={() => handleEdit(account)} style={styles.editButton}>Edit</button>
                            <button onClick={() => handleDelete(account._id)} style={styles.deleteButton}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
const styles = {
  container: {
      padding: '20px',
      width: '100%',
      height: '100vh',
      overflowY: 'auto',
      margin: '0',
      backgroundColor: '#F0F0F0',
      boxSizing: 'border-box',
  },
  form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '20px',
      gap: '12px',
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
  cardContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      justifyContent: 'center',
      marginTop: '10px',
      marginBottom: '60px', // Increased bottom margin for spacing
      paddingBottom: '20px', // Optional: Add padding for more space
  },
  card: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      width: '300px',
      minHeight: '150px',
  },
  cardTitle: {
      fontSize: '1.5rem',
      marginBottom: '10px',
  },
  cardActions: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '15px',
  },
  editButton: {
      backgroundColor: '#FFA500',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '5px 10px',
      cursor: 'pointer',
  },
  deleteButton: {
      backgroundColor: '#FF0000',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '5px 10px',
      cursor: 'pointer',
  },
};
