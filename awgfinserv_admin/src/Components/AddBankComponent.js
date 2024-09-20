import React,{useState} from "react";
import axios from "axios";
import {FaTachometerAlt } from 'react-icons/fa';
import './PlansComponents/planscomponent.css'
export default function AddBankcomponent(){
    const hosturl = 'http://192.168.1.6:5000';
    const [formData, setFormData] = useState({
      bankname: '',
      accountnumber: '',
      ifsccode: '',
      holdername: '',
      branch: '',
    });
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
          const response = await axios.post(`${hosturl}/bankAccount`, formData);
          alert(response.data.message);
          setFormData({
            bankname: '',
            accountnumber: '',
            ifsccode: '',
            holdername: '',
            branch: '',
          });
          
        } catch (error) {
          console.error('Error adding bank account:', error);
        }
      };
    
    return(
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
          value={formData.name}
          onChange={handleChange}
          placeholder="Bank Name"
          style={styles.input}
        />
          <input
          type="text"
          name="accountnumber"
          value={formData.maxAmount}
          onChange={handleChange}
          placeholder="Account Number"
          style={styles.input}
        />
        <input
          type="text"
          name="ifsccode"
          value={formData.interestRate}
          onChange={handleChange}
          placeholder="IFSC Code"
          style={styles.input}
        />
        <input
          type="text"
          name="holdername"
          value={formData.numberOfMonths}
          onChange={handleChange}
          placeholder="Bank Holder Name"
          style={styles.input}
        />
        <input
          type="text"
          name="branch"
          value={formData.minAmount}
          onChange={handleChange}
          placeholder="Branch"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Add BankAccount</button>
         </form>
        </div>
    )
}
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
}