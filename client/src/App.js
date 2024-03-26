import logo from './logo.svg';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Button from 'react-bootstrap/Button';
import SignUp from './components/SignUp';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>MovieDate</h1>
        <p><small>Movie Planning Starts Here</small></p>
        <br></br>
        <div className="mb-2">
          <Button className="App-button" size="lg">
            Sign Up
          </Button>{' '}
          <Button className="App-button" size="lg">
            Sign In
          </Button>
        </div>
      </header>
    </div>
  );
}

export default App;
