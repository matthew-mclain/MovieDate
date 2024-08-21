import React, { useEffect, useState} from 'react';
import MovieDateNavbar from './Navbar';
import { Card, Dropdown } from 'react-bootstrap';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ReactComponent as SortAscIcon } from './icons/asc.svg';
import { ReactComponent as SortDescIcon } from './icons/desc.svg';
import axios from 'axios';
import './style/Movies.css';

function Movies() {
    const [movies, setMovies] = useState([]);
    const [sortBy, setSortBy] = useState('popularity'); // Default sort by popularity
    const [sortOrder, setSortOrder] = useState('desc'); // Default sort order is descending
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [isFilterReady, setIsFilterReady] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Format date function
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

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
        // Deselect the other filter if it's selected
        const newSelectedFilter = selectedFilters.includes(filterOption) ? [] : [filterOption];

        // Update URL with query parameters or navigate to /movies if no filter is selected
        if (newSelectedFilter.length > 0) {
            const params = new URLSearchParams(location.search);
            params.set('filter', newSelectedFilter[0]); // Set the selected filter in the URL
            navigate(`?${params.toString()}`);
        } else {
            navigate('/movies');
        }

        setSelectedFilters(newSelectedFilter);
    };

    // Parse query parameters from the URL and apply filters if not already applied
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const filter = params.get('filter');

        if (filter) {
            setSelectedFilters([filter]);
        }
        setIsFilterReady(true);
    }, [location.search]);

    // Retrieve movies from the database
    useEffect(() => {
        // Check if the filter is ready before fetching movies
        if (isFilterReady) {
            const fetchMovies = async () => {
                try {
                    const response = await axios.get('http://backend:8000/movies/', {
                        params: {
                            sortBy,
                            sortOrder,
                            selectedFilters
                        }
                    });
                    setMovies(response.data);
                } catch (error) {
                    console.error('Error fetching movies:', error);
                }
            };

            fetchMovies();
        }
    }, [isFilterReady, sortBy, sortOrder, selectedFilters]);

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