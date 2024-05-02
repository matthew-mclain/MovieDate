import React, { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import './style/Home.css';
import './style/Dashboard.css';
import MovieDateNavbar from './Navbar';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

function Profile() {
    const { username } = useParams(); // Retrieve the username from the URL parameter
    const [profileUsername, setProfileUsername] = useState(username);
    const [movies, setMovies] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);

    const storedUsername = localStorage.getItem('username'); // Retrieve the username from localStorage
    const isCurrentUser = storedUsername === profileUsername; // Check if the current user is viewing their own profile

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    // Get user's calendar
    useEffect(() => {
        // Function to get the user's calendar
        const getCalendar = async () => {
            try {
                const response = await axios.get('http://localhost:5000/calendar', {
                    params: {
                        username: profileUsername,
                    },
                });
                setMovies(response.data.slice(0, 5));
                console.log('Success fetching user calendar:', response.data);
            } catch (error) {
                console.error('Error fetching user calendar:', error);
            }
        };

        getCalendar();
    }, [profileUsername]);

    // Follow user (add to user_friends table)
    const followUser = async () => {
        try {
            const response = await axios.post('http://localhost:5000/users/follow', {
                username: storedUsername,
                friendUsername: profileUsername,
            });
            console.log(response.data);
            setIsFollowing(true);
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    // Unfollow user (remove from user_friends table)
    const unfollowUser = async () => {
        try {
            const response = await axios.post('http://localhost:5000/users/unfollow', {
                username: storedUsername,
                friendUsername: profileUsername,
            });
            console.log(response.data);
            setIsFollowing(false);
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    // Get the user's following list
    useEffect(() => {
        const getFollowing = async () => {
            try {
                const response = await axios.get('http://localhost:5000/users/following', {
                    params: {
                        username: profileUsername,
                    },
                });
                console.log('Following:', response.data)
                setFollowing(response.data);
            } catch (error) {
                console.error('Error getting following list:', error);
            }
        }
        getFollowing();
    }, [profileUsername]);

    // Get the user's followers list
    useEffect(() => {
        const getFollowers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/users/followers', {
                    params: {
                        username: profileUsername,
                    },
                });
                console.log('Followers:', response.data)
                setFollowers(response.data);
            } catch (error) {
                console.error('Error getting followers list:', error);
            }
        }
        getFollowers();
    }, [profileUsername]);

    // Check if the current user is following the profile user
    const checkFollowingStatus = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users/is_following', {
                params: {
                    username: storedUsername,
                    friendUsername: profileUsername,
                },
            });
            console.log('Is following:', response.data);
            setIsFollowing(response.data);
        } catch (error) {
            console.error('Error checking following status:', error);
        }
    };

    // Update profileUsername state when the URL parameter changes
    useEffect(() => {
        setProfileUsername(username);
    }, [username]);

    useEffect(() => {
        if (!isCurrentUser) {
            checkFollowingStatus(); // Fetch following status whenever profileUsername or storedUsername changes
        }
    }, [profileUsername, storedUsername, isCurrentUser]);

    return (
        <div className="App">
            <MovieDateNavbar />
            <div className="container">
                <div className="d-flex align-items-center">
                    <header className="App-header">
                        <br></br>
                        <h1>{profileUsername}</h1>
                        {isCurrentUser && <Button className="App-button">Edit Profile</Button>}
                        {!isCurrentUser && (
                        <Button 
                            className="App-button"
                            onClick={isFollowing ? unfollowUser : followUser}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            style={{ 
                                backgroundColor: isFollowing && !hovered ? 'grey' : undefined,
                                borderColor: isFollowing && !hovered ? 'white' : undefined
                            }}
                            >
                            {isFollowing ? (hovered ? 'Unfollow' : 'Following') : 'Follow'}
                        </Button>
                        )}
                        <br></br>
                        <br></br>
                        <h3>Followers: {followers.length}</h3>
                        <h3>Following: {following.length}</h3>
                        <br></br>
                        <Link 
                            to={`/${profileUsername}/calendar`}
                            className="Dashboard-link">
                            <h2>Calendar</h2>
                        </Link>
                        <div className="Dashboard-card">
                            {movies.map(movie => (
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
                    </header>
                </div>
            </div>    
        </div>
    );
}

export default Profile;