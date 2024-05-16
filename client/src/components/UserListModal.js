import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './style/Modal.css';

function UserListModal({ show, onHide, users, invitedUsers, title, onUserSelection, isProfileModal }) {
    const [selectedUsernames, setSelectedUsernames] = useState([]);

    useEffect(() => {
        setSelectedUsernames(invitedUsers);
    }, [invitedUsers]);

    const handleUsernameClick = () => {
        onHide();
    };

    const handleUserClick = (username) => {
        if (selectedUsernames.includes(username)) {
            setSelectedUsernames(selectedUsernames.filter(u => u !== username));
        } else {
            setSelectedUsernames([...selectedUsernames, username]);
        }
    };

    const handleSaveClick = () => {
        // Pass the selected usernames to the parent component
        onUserSelection(selectedUsernames);
        onHide();
    };

    if (isProfileModal) {
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

    else {
        return (
            <Modal show={show} onHide={onHide} className=".modal-backdrop">
                <Modal.Header closeButton>
                    <div>
                        <Modal.Title>{title}</Modal.Title>
                        <i>Select/Deselect a user by clicking on their username</i>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    {users && users.length > 0 ? (
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {users.map(user => (
                                <li 
                                    key={user.id} 
                                    onClick={() => handleUserClick(user.username)}
                                    style={{ cursor: 'pointer', textDecoration: selectedUsernames.includes(user.username) ? 'underline' : 'none' }}
                                >
                                    <h5>{user.username}</h5>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No users to display</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleSaveClick} className="App-button">
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default UserListModal;
