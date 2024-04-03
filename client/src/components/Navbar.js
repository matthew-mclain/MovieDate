import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import popcorn from './icons/popcorn.svg';
import './style/Navbar.css';

function MovieDateNavbar() {
    return (
        <Navbar className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">
                    <img
                        alt=""
                        src={popcorn}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                    MovieDate
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default MovieDateNavbar;