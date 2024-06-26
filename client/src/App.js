import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import popcorn from './components/icons/popcorn.svg';
import Home from './components/Home';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Movies from './components/Movies';
import Calendar from './components/Calendar';
import MovieDetail from './components/MovieDetail';
import Dates from './components/Dates';

function App() {
  useEffect(() => {
    document.title = 'MovieDate';

    // Change the favicon by setting the href of the existing link element in the head
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.href = popcorn;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/:username" element={<Profile />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/:username/calendar" element={<Calendar />} />
        <Route path="/:username/dates" element={<Dates />} />
      </Routes>
    </Router>
  );
}

export default App;
