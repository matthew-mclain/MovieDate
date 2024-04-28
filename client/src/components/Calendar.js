import React, { useState, useEffect } from 'react';
import './style/Home.css';
import MovieDateNavbar from './Navbar';
import { Card, Button } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Calendar() {
    const { username } = useParams(); // Retrieve the username from the URL parameter
    const [profileUsername, setProfileUsername] = useState(username); // Store the username in state
    const [movies, setMovies] = useState([]); // State to store the user's movies

    const storedUsername = localStorage.getItem('username'); // Retrieve the username from localStorage
    const isCurrentUser = storedUsername === profileUsername; // Check if the current user is viewing their own profile

    // Format date function
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Set the profile username to the username from the URL parameter
    useEffect(() => {
        setProfileUsername(username);
    }, [username]);

    // Get user's calendar
    useEffect(() => {
        // Function to get the user's calendar
        const getCalendar = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/calendar?username=${profileUsername}`);
                setMovies(response.data);
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
                        {isCurrentUser ? <h1>My Calendar</h1> : <h1>{profileUsername}'s Calendar</h1>}
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

export default Calendar;