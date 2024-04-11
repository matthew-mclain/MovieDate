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
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);

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

    // Retrieve upcoming movies from the database
    useEffect(() => {
        const fetchUpcomingMovies = async () => {
          try {
            const response = await axios.get('http://localhost:5000/movies/upcoming');
            const slicedUpcomingMovies = response.data.slice(0, 5).map(movie => ({
                ...movie,
                release_date: formatDate(movie.release_date),
            }));
            setUpcomingMovies(slicedUpcomingMovies);
          } catch (error) {
            console.error('Error fetching movies:', error);
          }
        };
    
        fetchUpcomingMovies();
    }, []);

    // Retrieve now playing movies from the database
    useEffect(() => {
        const fetchNowPlayingMovies = async () => {
          try {
            const response = await axios.get('http://localhost:5000/movies/now_playing');
            const slicedNowPlayingMovies = response.data.slice(0, 5).map(movie => ({
                ...movie,
                release_date: formatDate(movie.release_date),
            }));
            setNowPlayingMovies(slicedNowPlayingMovies);
          } catch (error) {
            console.error('Error fetching movies:', error);
          }
        };
    
        fetchNowPlayingMovies();
    }, []);

    return (
        <div className="App">
            <MovieDateNavbar />
            <header className="App-header">
                <br></br>
                <h2>Welcome back, {username} </h2>
                <br></br>
                <Link to="/movies" className="Dashboard-link">
                    <h3 className="Dashboard-header-1">Upcoming</h3>
                </Link>
                <div className="Dashboard-card">
                    {upcomingMovies.map(movie => (
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
                <Link to="/movies" className="Dashboard-link">
                    <h3 className="Dashboard-header-2">Now Playing</h3>
                </Link>
                <div className="Dashboard-card">
                    {nowPlayingMovies.map(movie => (
                        movie.poster_path && (
                            <Card key={movie.movie_id} className="Dashboard-card" style={{ width: '15rem' }}>
                                <Card.Img variant="top" src={'https://image.tmdb.org/t/p/w500' + movie.poster_path} />
                            </Card>
                        )
                    ))}
                </div>
                <br></br>
            </header>
        </div>
    );
}

export default Dashboard;