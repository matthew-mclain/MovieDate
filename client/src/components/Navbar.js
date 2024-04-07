import React, { useState, useEffect } from 'react';
import { Navbar, Container, Dropdown, ButtonGroup, Nav } from 'react-bootstrap';
import popcorn from './icons/popcorn.svg';
import './style/Navbar.css';
import { useNavigate } from 'react-router-dom';

function MovieDateNavbar() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');

    const handleRedirect = () => {
        const token = localStorage.getItem('token');
        // If token is present, redirect to dashboard, otherwise redirect to home
        token ? navigate('/dashboard') : navigate('/');
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    };

    const handleMoviesClick = () => {
        navigate('/movies');
    }

    const handleCalendarClick = () => {
        navigate(`/${username}/calendar`);
    }

    // Retrieve username from localStorage on component mount
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    return (
        <Navbar className="bg-body-tertiary">
            <Container>
                <Navbar.Brand onClick={handleRedirect} className="App-navbar">
                    <img
                        alt=""
                        src={popcorn}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                    MovieDate
                </Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link onClick={handleMoviesClick} style={{ color: 'white' }}>Movies</Nav.Link> {/* Add Movies */}
                    <Nav.Link onClick={handleCalendarClick} style={{ color: 'white' }}>My Calendar</Nav.Link> {/* Add My Calendar */}
                </Nav>
                {localStorage.getItem('token') && (
                    <Dropdown as={ButtonGroup}>
                        <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                            {username}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => navigate(`/${username}`)}>View Profile</Dropdown.Item>
                            <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                )}
            </Container>
        </Navbar>
    );
}

export default MovieDateNavbar;