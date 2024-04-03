// Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import popcorn from './icons/popcorn.svg';
import './style/Home.css';
import MovieDateNavbar from './Navbar';

function Home() {
  return (
    <div className="App">
      <MovieDateNavbar />
      <header className="App-header">
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
  );
}

export default Home;
