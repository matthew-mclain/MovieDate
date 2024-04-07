import React, { useState, useEffect } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import './style/Home.css';
import './style/Dashboard.css';
import MovieDateNavbar from './Navbar';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [movies, setMovies] = useState([]);

    // Retrieve username from localStorage
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    // Format date function
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Retrieve movies from the database
    useEffect(() => {
        const fetchMovies = async () => {
          try {
            const response = await axios.get('http://localhost:5000/movies/upcoming');
            const slicedMovies = response.data.slice(0, 7).map(movie => ({
                ...movie,
                release_date: formatDate(movie.release_date),
            }));
            setMovies(slicedMovies);
          } catch (error) {
            console.error('Error fetching movies:', error);
          }
        };
    
        fetchMovies();
    }, []);

    return (
        <div className="App">
            <MovieDateNavbar />
            <header className="App-header">
                <h2>Welcome back, {username} </h2>
                <br></br>
                <Link to="/movies" className="Dashboard-link">
                    <h3 className="Dashboard-header">Upcoming Movies</h3>
                </Link>
                <div className="Dashboard-card">
                    {movies.map(movie => (
                        movie.poster_path && (
                            <Card key={movie.movie_id} className="Dashboard-card" style={{ width: '15rem' }}>
                                <Card.Img variant="top" src={'https://image.tmdb.org/t/p/w500' + movie.poster_path} />
                            </Card>
                        )
                    ))}
                </div>
            </header>
        </div>
    );
}

export default Dashboard;