import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import './style/Home.css';
import MovieDateNavbar from './Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');

    // Retrieve username from localStorage on component mount
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    return (
        <div className="App">
            <MovieDateNavbar />
            <header className="App-header">
                <h2>Welcome back, {username} </h2>
            </header>
        </div>
    );
}

export default Dashboard;