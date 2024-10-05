import React, { useState, useEffect } from 'react';

const FeedbackForm = () => {
    const [name, setName] = useState('');
    const [review, setReview] = useState('');
    const [feedbacks, setFeedbacks] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const hosturl = 'http://localhost:5000';

    useEffect(() => {
        fetchFeedbacks(); // Fetch feedbacks on component mount
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await fetch(`${hosturl}/feedback`);
            const data = await response.json();
            setFeedbacks(data);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const feedback = { name, review };

        try {
            if (editingId) {
                await fetch(`${hosturl}/feedback/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(feedback),
                });
            } else {
                await fetch(`${hosturl}/feedback`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(feedback),
                });
            }
            resetForm(); // Make sure resetForm clears state correctly
            fetchFeedbacks(); // Re-fetch feedbacks
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    const handleEdit = (feedback) => {
        setName(feedback.name);
        setReview(feedback.review);
        setEditingId(feedback._id); // Assuming you're using _id for MongoDB
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${hosturl}/feedback/${id}`, {
                method: 'DELETE',
            });
            fetchFeedbacks();
        } catch (error) {
            console.error('Error deleting feedback:', error);
        }
    };

    const resetForm = () => {
        setName('');
        setReview('');
        setEditingId(null);
    };


    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h2 style={styles.title}>Feedback Form</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Review:</label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            required
                            style={styles.textarea}
                        />
                    </div>
                    <div style={styles.buttonContainer}>
                        <button type="submit" style={styles.button}>
                            {editingId ? 'Update' : 'Submit'}
                        </button>
                    </div>
                </form>
                <h3 style={styles.subtitle}>Feedback List</h3>
                <div style={styles.listContainer}>
                    <ul style={styles.list}>
                        {feedbacks.map((feedback) => (
                            <li key={feedback.id} style={styles.listItem}>
                                <div style={styles.feedbackContent}>
                                    <strong>{feedback.name}</strong>: {feedback.review}
                                </div>
                                <div style={styles.buttonGroup}>
                                    <button onClick={() => handleEdit(feedback)} style={styles.editButton}>Edit</button>
                                    <button onClick={() => handleDelete(feedback.id)} style={styles.deleteButton}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
const styles = {
    page: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100vh',
        overflowY: 'auto',
        backgroundColor: '#f0f4f8',
        padding: '0', 
        margin: '0',
        width: '102%',
    },
    container: {
        maxWidth: '90%',
        width: '100%',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#ffffff',
        marginTop: '20px',
        marginBottom: '20px', // Add space below the container
    },
    title: {
        textAlign: 'center',
        color: '#333',
        fontSize: '24px',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#555',
    },
    input: {
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        width: '100%',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        outline: 'none',
    },
    textarea: {
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        width: '100%',
        minHeight: '120px',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        outline: 'none',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '10px',
    },
    button: {
        padding: '12px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#ffffff',
        cursor: 'pointer',
        transition: 'background-color 0.3s, transform 0.3s',
        fontSize: '16px',
    },
    subtitle: {
        marginTop: '20px',
        color: '#555',
        textAlign: 'center',
        fontSize: '20px',
    },
    listContainer: {
        backgroundColor: '#f9f9f9',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
        maxHeight: '300px',
        overflowY: 'auto',
        marginBottom: '20px', // Add space below the list container
    },
    list: {
        listStyleType: 'none',
        padding: '0',
    },
    listItem: {
        padding: '10px',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    feedbackContent: {
        flex: 1,
        fontStyle: 'italic',
        color: '#444',
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px', // Add space between edit and delete buttons
    },
    editButton: {
        backgroundColor: '#ffc107',
        border: 'none',
        color: '#ffffff',
        padding: '8px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        fontSize: '14px',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        border: 'none',
        color: '#ffffff',
        padding: '8px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        fontSize: '14px',
    },
};

export default FeedbackForm;
