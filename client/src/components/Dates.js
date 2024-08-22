import React, { useEffect, useState } from 'react';
import MovieDateNavbar from './Navbar';
import { Card, Dropdown, Button } from 'react-bootstrap';
import { useNavigate, useLocation, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './style/Home.css';
import ManageDateModal from './ManageDateModal';

// Access environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Dates() {
    const { username } = useParams();
    const [profileUsername, setProfileUsername] = useState(username);
    const [userExists, setUserExists] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [dates, setDates] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [isFilterReady, setIsFilterReady] = useState(false);
    const [showManageDateModal, setShowManageDateModal] = useState(false);
    const [manageDate, setManageDate] = useState({});
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

    // Format time function (convert SQL time to 12-hour format)
    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const suffix = hours >= 12 ? 'PM' : 'AM';

        let hours12 = hours % 12;
        hours12 = hours12 ? hours12 : 12; // 0 should be converted to 12

        return `${hours12}:${minutes} ${suffix}`;
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
            navigate(`/${profileUsername}/dates`);
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

    // Get user's dates with movie details for movie poster
    useEffect(() => {
        // Function to get the user's dates
        if (isFilterReady) {
            const getDates = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/dates`, {
                        params: {
                            username: profileUsername,
                            selectedFilters: selectedFilters,
                        },
                    });
                    setDates(response.data);
                    console.log('Success fetching user dates:', response.data);
                } catch (error) {
                    console.error('Error fetching user dates:', error);
                }
            };

            getDates();
        }
    }, [profileUsername, selectedFilters, isFilterReady]);

    // Function to open the manage modal with the selected date
    const handleManageDate = (date) => {
        setManageDate(date);
        setShowManageDateModal(true);
    };

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
                            {isCurrentUser ? <h1>My Dates</h1> : <h1>{profileUsername}'s Dates</h1>}
                            <div className="d-flex">
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                                        Filter
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.includes('me')}
                                                    onChange={() => handleFilter('me')}
                                                    onClick={(e) => e.stopPropagation()} // Stop propagation here
                                                    className='mr-2'
                                                />
                                                <label className="filter-checkbox-text" onClick={() => handleFilter('me')}>
                                                    Created By Me
                                                </label>
                                            </div>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.includes('others')}
                                                    onChange={() => handleFilter('others')}
                                                    onClick={(e) => e.stopPropagation()} // Stop propagation here
                                                    className='mr-2'
                                                />
                                                <label className="filter-checkbox-text" onClick={() => handleFilter('others')}>
                                                    Created By Others
                                                </label>
                                            </div>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            {dates.length === 0 && <br></br>}
                            {dates.length === 0 ? <h3>No dates yet. To add a date, visit a movie page and fill out the form.</h3> : null}
                            <br></br>
                            <div className="Movies-grid">
                                {dates.map(date => (
                                    <div key={date.date_id}>
                                        <Link to={`/movies/${date.movie_id}`}>
                                            <Card className="Movies-card" style={{ width: '15rem' }}>
                                                <Card.Img variant="top" className="card-img" src={'https://image.tmdb.org/t/p/w500' + date.poster_path} />
                                                <Card.Body>
                                                    <div className="text-center">
                                                        <h5>{date.title}</h5>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Link>
                                        {!date.invited_users.includes(storedUsername) && <Button className='App-button' style={{ marginBottom: '25px' }} onClick={() => handleManageDate(date)}>Manage</Button>}
                                        {date.invited_users.includes(storedUsername) && <Button variant="outline-danger" className="me-4" style={{ marginBottom: '25px' }}>Invited</Button>}                                                                        
                                        <h5><u>Date</u>:</h5>
                                        <h6><i>{formatDate(date.date)}</i></h6>

                                        <h5><u>Time</u>:</h5>
                                        <h6><i>{date.time ? formatTime(date.time) : 'Not specified'}</i></h6>

                                        <h5><u>Theater</u>:</h5>
                                        <h6><i>{date.theater || 'Not specified'}</i></h6>

                                        <h5><u>Invited Users:</u></h5>
                                        <h6><i>{date.invited_users.join(', ') || 'None'}</i></h6>
                                    </div>
                                ))}
                            </div>
                            <br></br>
                        </header>
                    </div>
                </div>
                {/* Manage Date Modal */}
                <ManageDateModal show={showManageDateModal} date_obj={manageDate} onHide={() => setShowManageDateModal(false)} />
            </div>
        );
    }
}

export default Dates;