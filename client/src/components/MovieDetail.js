import React, { useEffect, useState } from 'react';
import MovieDateNavbar from './Navbar';
import { Card, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './style/Movies.css';
import AddDateModal from './AddDateModal';

function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [movieInCalendar, setMovieInCalendar] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [showAddDateModal, setShowAddDateModal] = useState(false);

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
                const response = await axios.get(`http://localhost:8000/movies/${id}`);
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

            const response = await axios.post('http://localhost:8000/calendar/add', {
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

            const response = await axios.delete('http://localhost:8000/calendar/delete', {
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
                const response = await axios.get(`http://localhost:8000/calendar?username=${username}`);
                const isInCalendar = response.data.some(movie => movie.movie_id === parseInt(id));
                setMovieInCalendar(isInCalendar);
                console.log('Movie is in calendar:', isInCalendar);
            } catch (error) {
                console.error('Error checking if movie is in calendar:', error);
            }
        };

        checkMovieInCalendar();
    }, [id]);

     // Event handler to toggle modal visibility
     const toggleAddDateModal = () => {
        setShowAddDateModal(!showAddDateModal);
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
                                    <div>
                                        <Button className="App-button" onClick={toggleAddDateModal}>Plan Date</Button>
                                        <AddDateModal show={showAddDateModal} onHide={toggleAddDateModal} movieId={id} title={"Add Date"} userButtonTitle={"Add User(s)"} submitButtonTitle={"Add Date"}/>
                                    </div>
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
                        </div>
                    )}
                </header>
            </div>
        </div>
    );
}

export default MovieDetail;