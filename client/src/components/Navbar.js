import React, { useState, useEffect } from 'react';
import { Navbar, Container, Dropdown, Button, ButtonGroup, Nav, Form, ListGroup } from 'react-bootstrap';
import { ReactComponent as PopcornIcon } from './icons/popcorn.svg';
import { ReactComponent as UserIcon } from './icons/user.svg';
import { ReactComponent as SearchIcon } from './icons/search.svg';
import './style/Navbar.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Access environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function MovieDateNavbar() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({ movies: [], users: [] });

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

    const handleDatesClick = () => {
        navigate(`/${username}/dates`);
    }

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
        if (!e.target.value) {
            setSearchResults(false);
        }
    };

    const handleSearchFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`${API_BASE_URL}/search?query=${searchQuery}`);
            setSearchResults(response.data);
            console.log('Search results:', response.data);
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    const handleResultClick = (result) => {
        if (result.hasOwnProperty('movie_id')) {
            setSearchResults(false);
            setSearchQuery('');
            navigate(`/movies/${result.movie_id}`);
        } else {
            setSearchResults(false);
            setSearchQuery('');
            navigate(`/${result.username}`);
        }
    };

    // Retrieve username from localStorage on component mount
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    return (
        <>
            {/* Navbar */}
            <Navbar className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand onClick={handleRedirect} className="App-navbar">
                        <PopcornIcon className="d-inline-block align-top" width="30" height="30"/>
                        MovieDate
                    </Navbar.Brand>
                    {localStorage.getItem('token') && (
                        <Nav className="me-auto">
                            <Nav.Link onClick={handleMoviesClick} style={{ color: 'white' }}>Movies</Nav.Link>
                            <Nav.Link onClick={handleCalendarClick} style={{ color: 'white' }}>My Calendar</Nav.Link>
                            <Nav.Link onClick={handleDatesClick} style={{ color: 'white' }}>My Dates</Nav.Link>
                        </Nav>
                    )}
                    {localStorage.getItem('token') && (
                        <Form onSubmit={handleSearchFormSubmit} className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Search Movies/Users..."
                                className="me-2 search-input"
                                aria-label="Search"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                            />
                            <Button type="submit" variant="outline-danger" className="me-4">
                                <SearchIcon className="nav-icons" width="15" height="15"/>
                            </Button>
                        </Form>
                    )}
                    {localStorage.getItem('token') && (
                        <Dropdown as={ButtonGroup}>
                            <Dropdown.Toggle variant="outline-light" id="dropdown-basic" className="nav-icons">
                                <UserIcon className="d-inline-block align-top" width="20" height="20" style={{marginRight: '5px'}}/>
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

            {/* Search results */}
            {searchResults?.movies?.length > 0 && (
                <Container className='mt-4'>
                    <ListGroup>
                        <ListGroup.Item className='custom-active-list-item'>Movies</ListGroup.Item>
                        {searchResults.movies.map((movie, index) => (
                            <ListGroup.Item action onClick={() => handleResultClick(movie, 'movie')} key={index} className='custom-list-item'>{movie.title}</ListGroup.Item>
                        ))}
                    </ListGroup>
                </Container>
            )}

            {searchResults?.users?.length > 0 && (
                <Container className='mt-4'>
                    <ListGroup>
                        <ListGroup.Item className='custom-active-list-item'>Users</ListGroup.Item>
                        {searchResults.users.map((user, index) => (
                            <ListGroup.Item action onClick={() => handleResultClick(user, 'user')} key={index} className='custom-list-item'>{user.username}</ListGroup.Item>
                        ))}
                    </ListGroup>
                </Container>
            )}
        </>
    );
}

export default MovieDateNavbar;