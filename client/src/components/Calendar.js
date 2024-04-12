import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import './style/Home.css';
import MovieDateNavbar from './Navbar';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function Calendar() {
    const { username } = useParams(); // Retrieve the username from the URL parameter
    const [profileUsername, setProfileUsername] = useState(username); // Store the username in state

    useEffect(() => {
        // Fetch additional profile data using the username, if needed
        // Example: Fetch user data from the server based on the username
    }, [username]);

    const storedUsername = localStorage.getItem('username'); // Retrieve the username from localStorage
    const isCurrentUser = storedUsername === profileUsername; // Check if the current user is viewing their own profile

    return (
        <div className="App">
            <MovieDateNavbar />
            <div className="container">
                <div className="d-flex align-items-center">
                    <header className="App-header">
                        <br></br>
                        {isCurrentUser ? <h1>My Calendar</h1> : <h1>{profileUsername}'s Calendar</h1>}
                    </header>
                </div>
            </div>    
        </div>
    );
}

export default Calendar;