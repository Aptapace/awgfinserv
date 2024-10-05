// src/Components/SignInPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const SignInPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const hosturl ='http://localhost:5000';
  
  const handleLogin = async (values) => {
    const { username, password } = values;
  
    try {
      const response = await axios.post(`${hosturl}/login`, {
        phoneNumber: username,
        password: password,
      });
  
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user.userId); // Store userId
        navigate('/home/profile');
      } else {
        message.error(response.data.message || 'Login failed');
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      message.error('invalid credentials');
      console.error(err);
      setError('Please enter correct details');
    }
  };
  

  return (
    <div style={styles.body}>
      <div style={styles.loginCard}>
        <h2 style={styles.header}>Login</h2>
        <Form onFinish={handleLogin} style={styles.form}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
            style={styles.formGroup}
          >
            <Input placeholder="Username" style={styles.input} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            style={styles.formGroup}
          >
            <Input.Password placeholder="Password" style={styles.input} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={styles.button}>
              Login
            </Button>
          </Form.Item>
          {error && <p style={styles.error}>{error}</p>}
        </Form>
      </div>
    </div>
  );
};

export default SignInPage;

const styles = {
  body: {
    margin: 0,
    padding: 0,
    backgroundColor: '#f0f2f5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontFamily: 'Poppins, sans-serif',
  },
  loginCard: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    width: '400px',
    maxWidth: '90%',
    color: 'black',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    margin: '0 0 30px',
    fontSize: '32px',
    color: '#ff6f61',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
  },
  formGroup: {
    marginBottom: '20px',
  },
  input: {
    borderRadius: '8px',
    backgroundColor: '#f7f7f7',
    color: '#333',
    fontSize: '16px',
    border: '1px solid #ddd',
  },
  button: {
    width: '100%',
    borderRadius: '8px',
    backgroundColor: '#ff6f61',
    color: '#fff',
    fontSize: '16px',
    height: '45px',
    border: 'none',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#ff4c39',
  },
  error: {
    color: '#d9534f',
    marginBottom: '20px',
    fontSize: '14px',
  }
};
