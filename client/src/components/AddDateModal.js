import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import './style/Modal.css';
import UserListModal from './UserListModal';

function AddDateModal({ show, onHide, movieId }) {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [theater, setTheater] = useState('');
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [showUserListModal, setShowUserListModal] = useState(false);

    // Get following users
    useEffect(() => {
        const getFollowing = async () => {
            try {
                const username = localStorage.getItem('username');
                const response = await axios.get(`http://localhost:5000/users/following`, {
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

            // Send request to add date
            const response = await axios.post('http://localhost:5000/dates/add', {
                movieId: movieId,
                username: username,
                date: date,
                time: time,
                theater: theater,
                invitedUsers: invitedUsers
            });

            console.log(response.data);

            onHide(); // Close modal
        } catch (error) {
            console.error('Error adding date:', error);
        }
    };

    const handleAddUsersClick = () => {
        setShowUserListModal(true);
    }

    const handleUserSelection = (selectedUsernames) => {
        setInvitedUsers(selectedUsernames);
        setShowUserListModal(false);
    }

    return (
        <>
            <Modal show={show} onHide={onHide} style={{ filter: showUserListModal ? 'blur(5px)' : 'none'}}>
                <Form className='App-date-form' onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Date</Modal.Title>
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
                                    Add User(s)
                                </Button>
                            </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleSubmit} className="App-button">
                                Add Date
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <UserListModal 
                show={showUserListModal} 
                onHide={() => setShowUserListModal(false)}
                users={following} 
                title="Invite Friends"
                onUserSelection={handleUserSelection}
                isProfileModal={false}
            />
        </>
    );
}

export default AddDateModal;
