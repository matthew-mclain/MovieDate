import React, { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import './style/Home.css';
import './style/Dashboard.css';
import MovieDateNavbar from './Navbar';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

function Profile() {
    const { username } = useParams(); // Retrieve the username from the URL parameter
    const [profileUsername, setProfileUsername] = useState(username); // Store the username in state
    const [movies, setMovies] = useState([]); // State to store the user's movies

    const storedUsername = localStorage.getItem('username'); // Retrieve the username from localStorage
    const isCurrentUser = storedUsername === profileUsername; // Check if the current user is viewing their own profile

    // Get user's calendar
    useEffect(() => {
        // Function to get the user's calendar
        const getCalendar = async () => {
            try {
                const response = await axios.get('http://localhost:5000/calendar', {
                    params: {
                        username: profileUsername,
                    },
                });
                setMovies(response.data.slice(0, 5));
                console.log('Success fetching user calendar:', response.data);
            } catch (error) {
                console.error('Error fetching user calendar:', error);
            }
        };

        getCalendar();
    }, [profileUsername]);

    return (
        <div className="App">
            <MovieDateNavbar />
            <div className="container">
                <div className="d-flex align-items-center">
                    <header className="App-header">
                        <br></br>
                        <h1>{profileUsername}</h1>
                        {isCurrentUser && <Button className="App-button">Edit Profile</Button>}
                        {!isCurrentUser && <Button className="App-button">Follow</Button>}
                        <br></br>
                        <br></br>
                        <Link 
                            to={`/${profileUsername}/calendar`}
                            className="Dashboard-link">
                            <h2>Calendar</h2>
                        </Link>
                        <div className="Dashboard-card">
                            {movies.map(movie => (
                                movie.poster_path && (
                                    <Card key={movie.movie_id} className="Dashboard-card" style={{ width: '15rem' }}>
                                        <Link to={`/movies/${movie.movie_id}`}>
                                            <Card.Img variant="top" className="card-img" src={'https://image.tmdb.org/t/p/w500' + movie.poster_path} />
                                        </Link>
                                    </Card>
                                )
                            ))}
                        </div>
                        <br></br>
                    </header>
                </div>
            </div>    
        </div>
    );
}

export default Profile;