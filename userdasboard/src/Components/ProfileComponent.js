import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, DatePicker, Upload, message, Card, Col, Row } from 'antd';
import moment from 'moment';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';

const { Item } = Form;

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const userId = localStorage.getItem('userId'); 
  const hosturl = 'http://localhost:5000'; 

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${hosturl}/api/app-users/${userId}`);
        if (response.data) {
          setUserDetails(response.data);
          if (response.data.profileImage) {
            setImagePreview(`${hosturl}/uploads/profileImages/${response.data.profileImage}`);
          }
        } else {
          setError(response.data.message || 'Failed to fetch user details');
        }
      } catch (err) {
        setError('An error occurred while fetching user details');
        console.error(err);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const onFinish = async (values) => {
    const { username, phoneNumber, dob, address, bankaccount, profileImage } = values;

    const formData = new FormData();
    formData.append('username', username);
    formData.append('phoneNumber', phoneNumber);
    formData.append('dob', dob ? dob.format('YYYY-MM-DD') : null);
    formData.append('address', JSON.stringify(address));
    formData.append('bankaccount', JSON.stringify(bankaccount));
    if (profileImage) {
      formData.append('profileImage', profileImage.file.originFileObj);
    }

    try {
      const response = await axios.patch(`${hosturl}/update-profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success(response.data.message);
      setUserDetails(response.data.user);
      if (response.data.user.profileImage) {
        setImagePreview(`${hosturl}/uploads/profileImages/${response.data.user.profileImage}`);
      }
    } catch (err) {
      message.error('Failed to update profile');
      console.error(err);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userDetails) {
    return <div>Loading user details...</div>;
  }
  

  return (
    <div style={styles.container}>
      <Row gutter={16}>
        <Col span={16}>
          <Card title="Edit Profile" style={styles.card}>
            <Form
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                username: userDetails.username,
                phoneNumber: userDetails.phoneNumber,
                dob: userDetails.dob ? moment(userDetails.dob) : null,
                address: userDetails.address || {},
                bankaccount: userDetails.bankaccount || {},
              }}
              style={styles.form}
            >
              <Item label="Username" name="username">
                <Input />
              </Item>
              <Item label="Phone Number" name="phoneNumber">
                <Input disabled />
              </Item>
              <Item label="Date of Birth" name="dob">
                <DatePicker />
              </Item>
              <Item label="Address">
                <Form.Item name={['address', 'houseNo']} label="House No">
                  <Input />
                </Form.Item>
                <Form.Item name={['address', 'area']} label="Area">
                  <Input />
                </Form.Item>
                <Form.Item name={['address', 'pincode']} label="Pincode">
                  <Input />
                </Form.Item>
              </Item>
              <Item label="Bank Details:" style={{fontSize:22,}}>
                <Form.Item name={['bankaccount', 'bankName']} label="Bank Name">
                  <Input />
                </Form.Item>
                <Form.Item name={['bankaccount', 'accountHolderName']} label="Account Holder Name">
                  <Input />
                </Form.Item>
                <Form.Item name={['bankaccount', 'accountNumber']} label="Account Number">
                  <Input />
                </Form.Item>
                <Form.Item name={['bankaccount', 'ifscCode']} label="IFSC Code">
                  <Input />
                </Form.Item>
              </Item>
              <Item label="Profile Image" name="profileImage">
                <Upload
                  accept=".png,.jpg,.jpeg"
                  showUploadList={false}
                  beforeUpload={file => {
                    setImagePreview(URL.createObjectURL(file));
                    return false;
                  }}
                  onChange={({ file }) => {
                    if (file.status !== 'uploading') {
                      file.originFileObj = file.originFileObj; 
                    }
                  }}
                >
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
              </Item>
              <div style={styles.submitContainer}>
                <Button type="primary" htmlType="submit">
                  Save Changes
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={styles.profileCard}>
            <div style={styles.profileImageContainer}>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  style={styles.profileImage}
                />
              ) : (
                <div style={styles.defaultProfileImage}>
                  <UserOutlined style={styles.defaultIcon} />
                </div>
              )}
            </div>
            <h4 style={styles.username}>{userDetails.username}</h4>
            <p style={styles.phoneNumber}>{userDetails.phoneNumber}</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxHeight: '100%',
    overflowY: 'auto',
    width:'101.5%'
  },
  card: {
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  profileCard: {
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center items in the card
  },
  profileImageContainer: {
    width: '100px',
    height: '100px',
    borderRadius: '50%', // Circular shape
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: '50%', // Ensure the image is circular
    objectFit: 'cover',
  },
  defaultProfileImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  defaultIcon: {
    fontSize: '50px',
    color: '#888',
  },
  username: {
    margin: '10px 0',
    fontSize: '20px',
  },
  phoneNumber: {
    color: '#555',
  },
  submitContainer: {
    marginTop: '20px',
    textAlign: 'right',
  },
};

export default UserDetails;
