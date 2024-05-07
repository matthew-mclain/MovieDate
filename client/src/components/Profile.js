import React, { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import './style/Home.css';
import './style/Dashboard.css';
import MovieDateNavbar from './Navbar';
import UserListModal from './UserListModal';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

function Profile() {
    const { username } = useParams(); // Retrieve the username from the URL parameter
    const [profileUsername, setProfileUsername] = useState(username);
    const [userExists, setUserExists] = useState(true); // Check if the user exists in the database
    const [movies, setMovies] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalUsers, setModalUsers] = useState([]);
    const [modalTitle, setModalTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const storedUsername = localStorage.getItem('username'); // Retrieve the username from localStorage
    const isCurrentUser = storedUsername === profileUsername; // Check if the current user is viewing their own profile

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    // Check if the user exists
    useEffect(() => {
        const checkUserExists = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/users/${profileUsername}`);
                console.log('User:', response.data);
            } catch (error) {
                console.error('User does not exist:', error);
                setUserExists(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkUserExists();
    }, [profileUsername]);

    // Log userExists after it has been updated
    useEffect(() => {
        console.log('User exists:', userExists);
    }, [userExists]);

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

    // Function to toggle modal and set users and title
    const toggleModal = (users, title) => {
        setShowModal(!showModal);
        setModalUsers(users);
        setModalTitle(title);
    };

    
    if (isLoading) {
        return (
            <div className="App">
                <MovieDateNavbar />
                <div className="container">
                    <header className="App-header">
                        <br></br>
                        <h1>Loading...</h1>
                    </header>
                </div>
            </div>
        );
    }

    else if (!userExists) {
        return (
            <div className="App">
                <MovieDateNavbar />
                <div className="container">
                    <header className="App-header">
                        <br></br>
                        <h1>User not found</h1>
                    </header>
                </div>
            </div>
        );
    }

    else {
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
                            <h4 onClick={() => toggleModal(followers, 'Followers')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Followers: {followers.length}</h4>
                            <h4 onClick={() => toggleModal(following, 'Following')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Following: {following.length}</h4>
                            <UserListModal show={showModal} onHide={toggleModal} users={modalUsers} title={modalTitle} />
                            <br></br>
                            <Link 
                                to={`/${profileUsername}/calendar`}
                                className="Dashboard-link">
                                {movies.length > 0 && <h2>Calendar</h2>}
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
}

export default Profile;