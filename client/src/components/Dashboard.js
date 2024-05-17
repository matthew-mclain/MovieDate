import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import './style/Home.css';
import './style/Dashboard.css';
import MovieDateNavbar from './Navbar';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Dashboard() {
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
            const response = await axios.get('http://localhost:8000/movies/upcoming');
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
            const response = await axios.get('http://localhost:8000/movies/now_playing');
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
            <div className="container">
                <div className="d-flex align-items-center">
                    <header className="App-header">
                        <br></br>
                        <h1>Welcome back, {username} </h1>
                        <br></br>
                        <Link 
                            to={"/movies?filter=upcoming"}
                            state={{ filterOption: 'upcoming' }}
                            className="Dashboard-link">
                            <h2>Upcoming</h2>
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
                        <Link 
                            to={"/movies?filter=released"}
                            state={{ filterOption: 'released' }}
                            className="Dashboard-link">
                            <h2>Now Playing</h2>
                        </Link>
                        <div className="Dashboard-card">
                            {nowPlayingMovies.map(movie => (
                                movie.poster_path && (
                                    <Card key={movie.movie_id} className="Dashboard-card" style={{ width: '15rem' }}>
                                        <Link to={`/movies/${movie.movie_id}`}>
                                            <Card.Img variant="top" src={'https://image.tmdb.org/t/p/w500' + movie.poster_path} />
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

export default Dashboard;