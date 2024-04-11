// Home.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import popcorn from './icons/popcorn.svg';
import './style/Home.css';
import MovieDateNavbar from './Navbar';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is signed in by looking for the token in localStorage
        const isAuthenticated = !!localStorage.getItem('token');

        // If the user is signed in, redirect to the dashboard
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [navigate]);

  return (
    <div className="App">
      <MovieDateNavbar />
      <header className="App-header-start">
        <img src={popcorn} className="App-logo" alt="logo" />
        <h1>MovieDate</h1>
        <p><small>Movie Planning Starts Here</small></p>
        <br />
        <div>
          <Link to="/signup">
            <Button className="App-button" size="lg">
              Sign Up
            </Button>
          </Link>{' '}
        </div>
      </header>
    </div>
  )
}

export default Home;
