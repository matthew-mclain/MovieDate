import React, { useEffect, useState } from 'react';
import MovieDateNavbar from './Navbar';
import { Card } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

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

    return (
        <div className="App">
            <MovieDateNavbar />
            <header className="App-header">
                {movie && <h2>{movie.title}</h2>} {/* Render movie title only when movie is not null */}
            </header>
        </div>
    );
}

export default MovieDetail;