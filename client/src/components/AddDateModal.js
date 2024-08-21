import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import './style/Modal.css';
import UserListModal from './UserListModal';

function AddDateModal({ show, onHide, dateId, movieId, dateValue, timeValue, theaterValue, invitedUsersValue, title, userButtonTitle, submitButtonTitle}) {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [theater, setTheater] = useState('');
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [showUserListModal, setShowUserListModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        if (dateValue) setDate(dateValue.substring(0, 10)); // Extract date from datetime string
        if (timeValue) setTime(timeValue); else setTime('');
        if (theaterValue) setTheater(theaterValue); else setTheater('');
        if (invitedUsersValue) setInvitedUsers(invitedUsersValue); else setInvitedUsers([]);
    }, [dateValue, timeValue, theaterValue, invitedUsersValue]);

    // Get following users
    useEffect(() => {
        const getFollowing = async () => {
            try {
                const username = localStorage.getItem('username');
                const response = await axios.get(`http://backend:8000/users/following`, {
                    params: {
                        username: username
                    }
                });
                setFollowing(response.data);
            } catch (error) {
                console.error('Error getting following users:', error);
            }
        };
        getFollowing();
    }, []);

    const handleDateChange = (event) => {
        // If date is in the past, prevent user from selecting it
        if (event.target.value < new Date().toISOString().split('T')[0]) {
            alert('Please select a future date.');
            return;
        }
        setDate(event.target.value);
    };

    const handleTimeChange = (event) => {
        setTime(event.target.value);
    };

    const handleTheaterChange = (event) => {
        setTheater(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Get username from localStorage
            const username = localStorage.getItem('username');

            // Send request to add/update date
            if (dateId) {
                // Update date
                const response = await axios.put('http://backend:8000/dates/edit', {
                    dateId: dateId,
                    date: date,
                    time: time,
                    theater: theater,
                    invitedUsers: invitedUsers
                });

                console.log(response.data);

                // Refresh dates
                window.location.reload();
            } else {
                // Add date
                const response = await axios.post('http://backend:8000/dates/add', {
                    movieId: movieId,
                    username: username,
                    date: date,
                    time: time,
                    theater: theater,
                    invitedUsers: invitedUsers
                });

                console.log(response.data);

                // Show success alert
                setShowAlert(true);
                setAlertVariant('success');
                setAlertMessage('Date added successfully.');
            }

            onHide(); // Close modal
        } catch (error) {
            console.error('Error adding date:', error);
            // Show error alert
            setShowAlert(true);
            setAlertVariant('danger');
            setAlertMessage('Error adding date. Please try again.');
        }
    };

    const handleAddUsersClick = () => {
        setShowUserListModal(true);
    }

    const handleUserSelection = (selectedUsernames) => {
        setInvitedUsers(selectedUsernames);
        console.log('invitedUsers:', invitedUsers);
        setShowUserListModal(false);
    }

    const handleDelete = async () => {
        try {
            const response = await axios.delete('http://backend:8000/dates/delete', {
                data: {
                    dateId: dateId
                }
            });
            console.log(response.data);

            // Refresh dates
            window.location.reload();
        } catch (error) {
            console.error('Error deleting date:', error);
            // Show error alert
            setShowAlert(true);
            setAlertVariant('danger');
            setAlertMessage('Error deleting date. Please try again.');
        }
        onHide(); // Close modal
    }

    return (
        <>
            <Modal show={show} onHide={onHide} style={{ filter: showUserListModal ? 'blur(5px)' : 'none'}}>
                <Form className='App-date-form' onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <Form.Group controlId="date">
                                <Form.Label>Date (required)</Form.Label>
                                <Form.Control type="date" value={date} onChange={handleDateChange} required />
                            </Form.Group>
                            <Form.Group controlId="time">
                                <Form.Label>Time</Form.Label>
                                <Form.Control type="time" value={time} onChange={handleTimeChange} />
                            </Form.Group>
                            <Form.Group controlId="theater">
                                <Form.Label>Theater Name</Form.Label>
                                <Form.Control type="text" value={theater} onChange={handleTheaterChange} />
                            </Form.Group>
                            <br></br>
                            <Form.Group controlId="invitedUsers">
                            <Form.Label>Want to invite friends?</Form.Label><br></br>
                                <Button className="App-button" onClick={handleAddUsersClick}>
                                    {userButtonTitle}
                                </Button><br></br>
                                <i>To add friends here, go to their profile and follow them first.</i>
                            </Form.Group>
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {submitButtonTitle === 'Update' && 
                            (<Button className="App-button" onClick={handleDelete}>
                                Delete
                            </Button>)
                        }
                        <Button onClick={handleSubmit} className="App-button">
                            {submitButtonTitle}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <UserListModal 
                show={showUserListModal} 
                onHide={() => setShowUserListModal(false)}
                users={following}
                invitedUsers={invitedUsers}
                title="Invite Friends"
                onUserSelection={handleUserSelection}
                isProfileModal={false}
            />
            {/* Alert */}
            <Alert show={showAlert} variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
                <h5>{alertMessage}</h5>
            </Alert>
        </>
    );
}

export default AddDateModal;
