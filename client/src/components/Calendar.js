import React from 'react';
import MovieDateNavbar from './Navbar';

function Calendar() {
    return (
        <div className="App">
            <MovieDateNavbar />
            <div className="container">
                <div className="d-flex align-items-center">
                    <header className="App-header">
                        <br></br>
                        <h1>Calendar</h1>
                    </header>
                </div>
            </div>    
        </div>
    );
}

export default Calendar;