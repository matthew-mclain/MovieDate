import React from 'react';
import { Button } from 'react-bootstrap';
import './style/Home.css';
import MovieDateNavbar from './Navbar';

function SignIn() {
    return (
        <div className="App">
            <MovieDateNavbar />
            <header className="App-header">
                <h2>Sign In</h2>
                <form className="App-form">
                    <div className="form-group">
                        <input type="text" id="username" name="username" className="form-control" placeholder="Username" />
                    </div>
                    <div className="form-group">
                        <input type="password" id="password" name="password" className="form-control" placeholder="Password" />
                    </div>
                    <Button className="App-button" size="lg">
                        Sign In
                    </Button>
                </form>
                <p className="App-paragraph">Need an account? <a href="/signup">Sign Up</a></p>
            </header>
        </div>
    );
}

export default SignIn;