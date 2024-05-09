import React, { useEffect, useState } from 'react';
import MovieDateNavbar from './Navbar';
import { Card, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './style/Movies.css';

function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [movieInCalendar, setMovieInCalendar] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showtimesData, setShowtimesData] = useState(null);

    // Format date function
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
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
                movieId: movie.movie_id,
            });
            console.log(response.data);
            setMovieInCalendar(true);
        } catch (error) {
            console.error('Error adding movie to calendar:', error);
        }
    };

    // Delete movie from calendar
    const deleteFromCalendar = async () => {
        try {
            // Get username from localStorage
            const username = localStorage.getItem('username');

            const response = await axios.delete('http://localhost:5000/calendar/delete', {
                data: {
                    username: username,
                    movieId: movie.movie_id,
                }
            });
            console.log(response.data);
            setMovieInCalendar(false);
        } catch (error) {
            console.error('Error deleting movie from calendar:', error);
        }
    };

    // Check if movie is in calendar
    useEffect(() => {
        const checkMovieInCalendar = async () => {
            try {
                const username = localStorage.getItem('username');
                const response = await axios.get(`http://localhost:5000/calendar?username=${username}`);
                const isInCalendar = response.data.some(movie => movie.movie_id === parseInt(id));
                setMovieInCalendar(isInCalendar);
                console.log('Movie is in calendar:', isInCalendar);
            } catch (error) {
                console.error('Error checking if movie is in calendar:', error);
            }
        };

        checkMovieInCalendar();
    }, [id]);

    // Handle date change
    const handleDateChange = (date) => {
        setSelectedDate(date);
    }

    // Function to fetch showtimes for the selected date
    const fetchShowtimes = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/showtimes/search`, {
                params: {
                    title: movie.title,
                    releaseDate: movie.release_date,
                    desiredDate: selectedDate.toISOString().split('T')[0],
                }
            });
            console.log('Showtimes:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching showtimes:', error);
        }
    }

    // Fetch showtimes when the selected date changes
    useEffect(() => {
        const fetchData = async () => {
            const showtimesData = await fetchShowtimes();
            setShowtimesData(showtimesData); // Pass the response data to renderShowtimes
        };
        fetchData();
    }, [selectedDate]);

    // Render showtimes dynamically based on the selected date
    const renderShowtimes = () => {
        if (!showtimesData) {
            return <h3>No showtimes available</h3>;
        }
        return (
            <div>
                {showtimesData && showtimesData.cinemas.map(cinema => (
                    <div key={cinema.cinema_id}>
                        <h3>Showtimes:</h3>
                        <h4>{cinema.cinema_name} ({cinema.distance.toFixed(2)} miles away)</h4>
                        <div className="showtimes-container">
                            {cinema.showings.Standard.times.map((time, index) => (
                                <span key={index} className="showtime">{time.start_time}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
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
                                    <Button 
                                        className="App-button" 
                                        onClick={movieInCalendar ? deleteFromCalendar : addToCalendar}
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                        style={{ 
                                            backgroundColor: movieInCalendar && !hovered ? 'grey' : undefined,
                                            borderColor: movieInCalendar && !hovered ? 'white' : undefined
                                        }}
                                    >
                                        {movieInCalendar ? (hovered ? 'Remove From Calendar' : 'In Calendar') : 'Add to Calendar'}
                                    </Button>
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
                                    <i><h5>{movie.genres.join(', ')}</h5></i>
                                </div>
                                <div>
                                    <h4>Overview</h4>
                                    <i><h5>{movie.overview}</h5></i>
                                </div>
                            </div>
                            <div>
                                <h3>Select Date</h3>
                                <DatePicker selected={selectedDate} onChange={handleDateChange} className='date-picker'/>
                                <br></br>
                                <br></br>
                                {renderShowtimes()}
                            </div>
                        </div>
                    )}
                </header>
            </div>
        </div>
    );
}

export default MovieDetail;