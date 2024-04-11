import React, { useEffect, useState } from 'react';
import MovieDateNavbar from './Navbar';
import { Card, Button, Dropdown } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { ReactComponent as SortAscIcon } from './icons/asc.svg';
import { ReactComponent as SortDescIcon } from './icons/desc.svg';
import axios from 'axios';
import './style/Movies.css';

function Movies() {
    const [movies, setMovies] = useState([]);
    const [sortBy, setSortBy] = useState('popularity'); // Default sort by popularity
    const [sortOrder, setSortOrder] = useState('desc'); // Default sort order is descending

    // Format date function
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Retrieve movies from the database
    useEffect(() => {
        const fetchMovies = async () => {
          try {
            const response = await axios.get('http://localhost:5000/movies/', {
                params: {
                    sortBy,
                    sortOrder,
                }
            });
            setMovies(response.data);
          } catch (error) {
            console.error('Error fetching movies:', error);
          }
        };
    
        fetchMovies();
    }, [sortBy, sortOrder]);

    // Handle sorting movies
    const handleSort = (sortOption) => {
        if (sortOption === sortBy) {
            // If the same sort option is clicked again, toggle between ascending and descending order
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // If a different sort option is selected, default to descending order for popularity, otherwise default to ascending order
            setSortBy(sortOption);
            setSortOrder(sortOption === 'popularity' ? 'desc' : 'asc');
        }
    };

    return (
        <div className="App">
            <MovieDateNavbar />
            <header className="App-header">
                <br></br>
                <h2>Movies</h2>
                <div>
                <Dropdown>
                    <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                        Sort
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleSort('popularity')}>
                            Popularity {sortBy === 'popularity' && sortOrder === 'asc' && <SortAscIcon />}
                            {sortBy === 'popularity' && sortOrder === 'desc' && <SortDescIcon />}
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSort('release_date')}>
                            Release Date {sortBy === 'release_date' && sortOrder === 'asc' && <SortAscIcon />}
                            {sortBy === 'release_date' && sortOrder === 'desc' && <SortDescIcon />}
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSort('title')}>
                            Title {sortBy === 'title' && sortOrder === 'asc' && <SortAscIcon />}
                            {sortBy === 'title' && sortOrder === 'desc' && <SortDescIcon />}
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                </div>
                <br></br>
                <div className="Movies-grid">
                    {movies.map(movie => (
                        movie.poster_path && (
                            <Card key={movie.movie_id} className="Movies-card" style={{ width: '15rem' }}>
                                <Link to={`/movies/${movie.movie_id}`}>
                                    <Card.Img variant="top" className="card-img" src={'https://image.tmdb.org/t/p/w500' + movie.poster_path} />
                                </Link>
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