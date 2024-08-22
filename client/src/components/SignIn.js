import React, {useState} from 'react';
import { Button } from 'react-bootstrap';
import './style/Home.css';
import MovieDateNavbar from './Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

// Access environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function SignIn() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState(''); // State variable for error message

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/users/signin`, {
                username: formData.username,
                password: formData.password
            });
            console.log(response.data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', formData.username);
            navigate('/dashboard'); // Redirect to dashboard after successful sign in
        } catch (error) {
            console.error('Sign in error:', error);
            if (error.response && error.response.status === 401) {
                setError('Invalid username or password');
            } else {
                setError('Something went wrong. Please try again later.');
            }
        }
    }

    return (
        <div className="App-start">
            <MovieDateNavbar />
            <header className="App-header-start">
                {error && <Alert variant="danger" className="App-alert">{error}</Alert>}
                <h1>Sign In</h1>
                <form className="App-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input type="text" id="username" name="username" className="form-control" placeholder="Username" value={formData.username} onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <input type="password" id="password" name="password" className="form-control" placeholder="Password" value={formData.password} onChange={handleChange}/>
                    </div>
                    <Button type="submit" className="App-button">
                        Sign In
                    </Button>
                </form>
                <p className="App-paragraph">Need an account? <a href="/signup">Sign Up</a></p>
            </header>
        </div>
    );
}

export default SignIn;