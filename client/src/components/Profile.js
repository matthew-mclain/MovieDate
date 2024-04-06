import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import './style/Home.css';
import MovieDateNavbar from './Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
    return (
        <div className="App">
            <MovieDateNavbar />
            <header className="App-header">
                <h2>Profile</h2>
            </header>
        </div>
    );
}

export default Profile;