import React, { useEffect, useState } from 'react';
import MovieDateNavbar from './Navbar';
import { Card, Button } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './style/Movies.css';

function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    // Format date function
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Retrieve movie details from the database
    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/movies/${id}`);
                setMovie(response.data);
            } catch (error) {
                console.error('Error fetching movie:', error);
            }
        };
    
        fetchMovie();
    }, [id]);

    // Add movie to calendar
    const addToCalendar = async () => {
        try {
            // Get username from localStorage
            const username = localStorage.getItem('username');
            
            const response = await axios.post('http://localhost:5000/calendar/add', {
                username: username,
                movieId: movie.id,
            });
            console.log(response.data);
            alert('Movie added to calendar!');
        } catch (error) {
            console.error('Error adding movie to calendar:', error);
        }
    };

    return (
        <div className="App">
            <MovieDateNavbar />
            <div className="container">
                <header className="App-header">
                    <br />
                    {movie && (
                        <div className="movie-details">
                            <Card key={movie.movie_id} className="Movies-card" style={{ width: '15rem' }}>
                                {movie.poster_path ? (
                                    <Card.Img variant="top" className="card-img" src={'https://image.tmdb.org/t/p/w500' + movie.poster_path} />
                                ) : (
                                    <Card.Img variant="top" className="card-img" src={'https://via.placeholder.com/446x669.png?text=Poster+Not+Available'} />
                                )}
                                <Card.Body>
                                    <div className="text-center">
                                        <Button className="App-button" onClick={addToCalendar}>Add to My Calendar</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                            <div className="details">
                                <h1>{movie.title}</h1>
                                <div>
                                    <h4>Release Date</h4>
                                    <i><h5>{formatDate(movie.release_date)}</h5></i>
                                </div>
                                <div>
                                    <h4>Genres</h4>
                                    <i><h5>{movie.genres.map(genre => genre.name).join(', ')}</h5></i>
                                </div>
                                <div>
                                    <h4>Overview</h4>
                                    <i><h5>{movie.overview}</h5></i>
                                </div>
                            </div>
                        </div>
                    )}
                </header>
            </div>
        </div>
    );
}

export default MovieDetail;