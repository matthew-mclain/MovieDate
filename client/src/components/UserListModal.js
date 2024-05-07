import React from 'react';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './style/Modal.css';

function UserListModal({ show, onHide, users, title }) {
    const handleUsernameClick = () => {
        onHide(); // Hide the modal when a username is clicked
    };

    return (
        <Modal show={show} onHide={onHide} className=".modal-backdrop">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {users && users.length > 0 ? (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {users.map(user => (
                            <li key={user.id}>
                                <Link
                                    to={`/${user.username}`}
                                    onClick={handleUsernameClick}
                                >
                                    <h5>{user.username}</h5>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No users to display</p>
                )}
            </Modal.Body>
        </Modal>
    );
}

export default UserListModal;
