import React, { useEffect, useState } from 'react';
import MovieDateNavbar from './Navbar';
import { Card, Dropdown } from 'react-bootstrap';
import { useNavigate, useLocation, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './style/Home.css';

// Access environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Calendar() {
    const { username } = useParams();
    const [profileUsername, setProfileUsername] = useState(username);
    const [userExists, setUserExists] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [movies, setMovies] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [isFilterReady, setIsFilterReady] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const storedUsername = localStorage.getItem('username'); // Retrieve the username from localStorage
    const isCurrentUser = storedUsername === profileUsername; // Check if the current user is viewing their own profile

    // Check if the user exists
    useEffect(() => {
        const checkUserExists = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/users/${profileUsername}`);
                console.log('User:', response.data);
            } catch (error) {
                console.error('User does not exist:', error);
                setUserExists(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkUserExists();
    }, [profileUsername]);

    // Log userExists after it has been updated
    useEffect(() => {
        console.log('User exists:', userExists);
    }, [userExists]);

    // Format date function
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Handle filtering movies
    const handleFilter = (filterOption) => {
        // Deselect the other filter if it's selected
        const newSelectedFilter = selectedFilters.includes(filterOption) ? [] : [filterOption];

        // Update URL with query parameters
        if (newSelectedFilter.length > 0) {
            const params = new URLSearchParams(location.search);
            params.set('filter', newSelectedFilter[0]); // Set the selected filter in the URL
            navigate(`?${params.toString()}`);
        } else {
            navigate(`/${profileUsername}/calendar`);
        }

        setSelectedFilters(newSelectedFilter);
    };

    // Parse query parameters from the URL and apply filters if not already applied
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const filter = params.get('filter');

        if (filter) {
            setSelectedFilters([filter]);
        }
        setIsFilterReady(true);
    }, [location.search]);

    // Set the profile username to the username from the URL parameter
    useEffect(() => {
        setProfileUsername(username);
    }, [username]);

    // Get user's calendar
    useEffect(() => {
        // Function to get the user's calendar
        if (isFilterReady) {
            const getCalendar = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/calendar`, {
                        params: {
                            username: profileUsername,
                            selectedFilters: selectedFilters,
                        },
                    });
                    setMovies(response.data);
                    console.log('Success fetching user calendar:', response.data);
                } catch (error) {
                    console.error('Error fetching user calendar:', error);
                }
            };

            getCalendar();
        }
    }, [profileUsername, selectedFilters, isFilterReady]);

    if (isLoading) {
        return (
            <div className="App">
                <MovieDateNavbar />
                <div className="container">
                    <header className="App-header">
                        <br></br>
                        <h1>Loading...</h1>
                    </header>
                </div>
            </div>
        );
    }

    else if (!userExists) {
        return (
            <div className="App">
                <MovieDateNavbar />
                <div className="container">
                    <header className="App-header">
                        <br></br>
                        <h1>User not found</h1>
                    </header>
                </div>
            </div>
        );
    }

    else {
        return (
            <div className="App">
                <MovieDateNavbar />
                <div className="container">
                    <div className="d-flex align-items-center">
                        <header className="App-header">
                            <br></br>
                            {isCurrentUser ? <h1>My Calendar</h1> : <h1>{profileUsername}'s Calendar</h1>}
                            {movies.length === 0 && <br></br>}
                            {movies.length === 0 ? <h3>No movies in the calendar</h3> : null}
                            {movies.length > 0 && <div className="d-flex">
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                                        Filter
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.includes('upcoming')}
                                                    onChange={() => handleFilter('upcoming')}
                                                    onClick={(e) => e.stopPropagation()} // Stop propagation here
                                                    className='mr-2'
                                                />
                                                <label className="filter-checkbox-text" onClick={() => handleFilter('upcoming')}>
                                                    Upcoming
                                                </label>
                                            </div>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.includes('released')}
                                                    onChange={() => handleFilter('released')}
                                                    onClick={(e) => e.stopPropagation()} // Stop propagation here
                                                    className='mr-2'
                                                />
                                                <label className="filter-checkbox-text" onClick={() => handleFilter('released')}>
                                                    Released
                                                </label>
                                            </div>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>}
                            <br></br>
                            <div className="Movies-grid">
                                {movies.map(movie => (
                                    <Card key={movie.movie_id} className="Movies-card" style={{ width: '15rem' }}>
                                        <Link to={`/movies/${movie.movie_id}`}>
                                            {movie.poster_path ? (
                                                <Card.Img variant="top" className="card-img" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
                                            ) : (
                                                <Card.Img variant="top" className="card-img" src={'https://via.placeholder.com/446x669.png?text=Poster+Not+Available'} />
                                            )}
                                        </Link>
                                        <Card.Body>
                                            <Card.Text className="card-text">
                                                <b>{movie.title}</b>
                                                <br />
                                                <i>{formatDate(movie.release_date)}</i>
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        </header>
                    </div>
                </div>    
            </div>
        );
    }
}

export default Calendar;