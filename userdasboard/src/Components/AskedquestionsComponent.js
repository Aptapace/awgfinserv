import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QnAComponent = () => {
  const [data, setData] = useState([]);
  const [questionInput, setQuestionInput] = useState('');
  const [answerInput, setAnswerInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState(''); // For notifications
  const hosturl = 'http://localhost:5000';

  const fetchData = async () => {
    const response = await axios.get(`${hosturl}/api/qas`);
    setData(response.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update existing Q&A
        await axios.put(`${hosturl}/api/qas/${editId}`, {
          question: questionInput,
          answer: answerInput,
        });
        setMessage('Q&A updated successfully!');
      } else {
        // Create new Q&A
        await axios.post(`${hosturl}/api/qas`, {
          question: questionInput,
          answer: answerInput,
        });
        setMessage('Q&A added successfully!');
      }
    } catch (error) {
      setMessage('Error saving Q&A. Please try again.');
    } finally {
      setQuestionInput('');
      setAnswerInput('');
      setEditId(null);
      fetchData();
    }
  };

  const handleEdit = (item) => {
    setQuestionInput(item.question);
    setAnswerInput(item.answer);
    setEditId(item._id);
    setMessage(''); // Clear message on edit
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${hosturl}/api/qas/${id}`);
      setMessage('Q&A deleted successfully!');
    } catch (error) {
      setMessage('Error deleting Q&A. Please try again.');
    } finally {
      fetchData();
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Q&A List</h1>
      {message && <div style={styles.message}>{message}</div>} {/* Message Display */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={questionInput}
          onChange={(e) => setQuestionInput(e.target.value)}
          placeholder="Enter question"
          required
          style={styles.input}
        />
        <input
          type="text"
          value={answerInput}
          onChange={(e) => setAnswerInput(e.target.value)}
          placeholder="Enter answer"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>{editId ? 'Update' : 'Add'}</button>
      </form>
      <ul style={styles.itemList}>
        {data.map((item) => (
          <li key={item._id} style={styles.item}>
            <div>
              <strong>Q:</strong> {item.question} <br />
              <strong>A:</strong> {item.answer}
            </div>
            <div style={styles.buttonGroup}>
              <button onClick={() => handleEdit(item)} style={styles.editButton}>Edit</button>
              <button onClick={() => handleDelete(item._id)} style={styles.deleteButton}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f4f8',
    width: '102%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  title: {
    textAlign: 'center',
    color: '#343a40',
  },
  message: {
    color: '#28a745',
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    marginBottom: '10px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  itemList: {
    listStyleType: 'none',
    padding: '0',
    flexGrow: 1,
    marginBottom: '40px',
    paddingBottom: '40px',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    border: '1px solid #e9ecef',
    borderRadius: '4px',
    marginBottom: '10px',
  },
  buttonGroup: {
    display: 'flex',
  },
  editButton: {
    padding: '5px 10px',
    marginLeft: '5px',
    backgroundColor: '#ffc107',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
  deleteButton: {
    padding: '5px 10px',
    marginLeft: '5px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
};

export default QnAComponent;
