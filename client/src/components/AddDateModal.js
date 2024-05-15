import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function AddDateModal({ show, onHide, movieId }) {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [theater, setTheater] = useState('');
    const [invitedUsers, setInvitedUsers] = useState([]);

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    const handleTimeChange = (event) => {
        setTime(event.target.value);
    };

    const handleTheaterChange = (event) => {
        setTheater(event.target.value);
    };

    const handleSubmit = async () => {
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
                invitedUsers: []
            });

            console.log(response.data);

            onHide(); // Close modal
        } catch (error) {
            console.error('Error adding date:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Form onSubmit={handleSubmit}>
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
                            <Button className="App-button">
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
    );
}

export default AddDateModal;
