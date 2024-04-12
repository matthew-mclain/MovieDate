import React, { useEffect, useState } from 'react';
import MovieDateNavbar from './Navbar';
import { Card, Button, Dropdown } from 'react-bootstrap';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ReactComponent as SortAscIcon } from './icons/asc.svg';
import { ReactComponent as SortDescIcon } from './icons/desc.svg';
import axios from 'axios';
import './style/Movies.css';

function Movies() {
    const location = useLocation();
    const [filterOption, setFilterOption] = useState(location.state ? location.state.filterOption : null);
    const [movies, setMovies] = useState([]);
    const [sortBy, setSortBy] = useState('popularity'); // Default sort by popularity
    const [sortOrder, setSortOrder] = useState('desc'); // Default sort order is descending
    const [selectedFilters, setSelectedFilters] = useState([]);
    
    // Format date function
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Apply initial filter based on location.state.filterOption
    useEffect(() => {
        if (filterOption) {
            setSelectedFilters([filterOption]); // Set the selected filter
        }
    }, [filterOption]);

    // Retrieve movies from the database
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get('http://localhost:5000/movies/', {
                    params: {
                        sortBy,
                        sortOrder,
                        selectedFilters: filterOption ? [filterOption] : selectedFilters
                    }
                });
                setMovies(response.data);
                if (filterOption) {
                    setFilterOption(null);
                }
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
    }, [sortBy, sortOrder, selectedFilters]);

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

    // Handle filtering movies
    const handleFilter = (filterOption) => {
        let newSelectedFilters = [];
        if (selectedFilters.includes(filterOption)) {
            // If the clicked filter is already selected, deselect it
            newSelectedFilters = selectedFilters.filter(filter => filter !== filterOption);
        } else {
            // Otherwise, select the clicked filter and deselect the other one
            newSelectedFilters = [filterOption];
        }
        setSelectedFilters(newSelectedFilters);
    };

    return (
        <div className="App">
            <MovieDateNavbar />
            <div className="container">
                <div className="d-flex align-items-center">
                    <header className="App-header">
                        <br></br>
                        <h1 className="Movies-header">Movies</h1>
                        <div className="d-flex">
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
                            <div className="mx-2"></div>
                            <Dropdown>
                                <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                                    Filter
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item>
                                        <div className="d-flex align-items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedFilters.includes('upcoming')}
                                                onChange={() => handleFilter('upcoming')}
                                                onClick={(e) => e.stopPropagation()} // Stop propagation here
                                                className='mr-2'
                                            />
                                            <label className="filter-checkbox-text" onClick={() => handleFilter('upcoming')}>
                                                Upcoming
                                            </label>
                                        </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <div className="d-flex align-items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedFilters.includes('released')}
                                                onChange={() => handleFilter('released')}
                                                onClick={(e) => e.stopPropagation()} // Stop propagation here
                                                className='mr-2'
                                            />
                                            <label className="filter-checkbox-text" onClick={() => handleFilter('released')}>
                                                Released
                                            </label>
                                        </div>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
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

export default Movies;