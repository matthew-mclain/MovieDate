import React, { useEffect, useState } from 'react';
import MovieDateNavbar from './Navbar';
import { Card } from 'react-bootstrap';
import axios from 'axios';
import './style/Movies.css';

function Movies() {
    const [movies, setMovies] = useState([]);

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
            setMovies(response.data);
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
                <br></br>
                <h2>Movies</h2>
                <br></br>
                <div className="Movies-grid">
                    {movies.map(movie => (
                        movie.poster_path && (
                            <Card key={movie.movie_id} className="Movies-card" style={{ width: '15rem' }}>
                                <Card.Img variant="top" className="card-img" src={'https://image.tmdb.org/t/p/w500' + movie.poster_path} />
                                <Card.Body>
                                    <Card.Text className="card-text">
                                        {formatDate(movie.release_date)}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        )
                    ))}
                </div>
            </header>
        </div>
    );
}

export default Movies;