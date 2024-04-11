import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import './style/Home.css';
import MovieDateNavbar from './Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

function SignUp() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [signupSuccess, setSignupSuccess] = useState(false); // State variable for signup success

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/users/signup', {
                email: formData.email,
                username: formData.username,
                password: formData.password
            });
            console.log(response.data);
            setSignupSuccess(true);
            setTimeout(() => navigate('/signin'), 2000); // Redirect to signin page after successful signup
        } catch (error) {
            console.error('Signup error:', error);
        }
    };
 
    return (
        <div className="App-start">
            <MovieDateNavbar />
            <header className="App-header-start">
                {signupSuccess && <Alert variant="success" className="App-alert">{'Sign up successful! Redirecting to sign in page...'}</Alert>}
                <h1>Sign Up</h1>
                <form className="App-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input type="email" id="email" name="email" className="form-control" placeholder="Email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <input type="text" id="username" name="username" className="form-control" placeholder="Username" value={formData.username} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <input type="password" id="password" name="password" className="form-control" placeholder="Password" value={formData.password} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <input type="password" id="confirmPassword" name="confirmPassword" className="form-control" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
                    </div>
                    <Button type="submit" className="App-button">
                        Sign Up
                    </Button>
                </form>
                <p className="App-paragraph">Already have an account? <a href="/signin">Sign In</a></p>
            </header>
        </div>
    );
}

export default SignUp;