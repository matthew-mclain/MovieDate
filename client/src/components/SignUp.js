import React from 'react';
import { Button } from 'react-bootstrap';
import './style/Home.css';
import MovieDateNavbar from './Navbar';

function SignUp() {
    return (
        <div className="App">
            <MovieDateNavbar />
            <header className="App-header">
                <h2>Sign Up</h2>
                <form className="App-form">
                    <div className="form-group">
                        <input type="email" id="email" name="email" className="form-control" placeholder="Email" />
                    </div>
                    <div className="form-group">
                        <input type="text" id="username" name="username" className="form-control" placeholder="Username" />
                    </div>
                    <div className="form-group">
                        <input type="password" id="password" name="password" className="form-control" placeholder="Password" />
                    </div>
                    <div className="form-group">
                        <input type="password" id="confirmPassword" name="confirmPassword" className="form-control" placeholder="Confirm Password" />
                    </div>
                    <Button className="App-button" size="lg">
                        Sign Up
                    </Button>
                </form>
                <p className="App-paragraph">Already have an account? <a href="/signin">Sign In</a></p>
            </header>
        </div>
    );
}

export default SignUp;