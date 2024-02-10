CREATE DATABASE MovieDateDB;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    release_date DATE NOT NULL,
    genres STRING[] NOT NULL,
    overview TEXT NOT NULL,
    runtime INTEGER NOT NULL,
    status VARCHAR(100) NOT NULL,
    poster_path VARCHAR(100) NOT NULL,
    backdrop_path VARCHAR(100) NOT NULL,
    vote_average DECIMAL NOT NULL,
    vote_count INTEGER NOT NULL,
    popularity DECIMAL NOT NULL
);

CREATE TABLE user_movies (
    user_movie_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    movie_id INTEGER REFERENCES movies(movie_id)
);

CREATE TABLE theatres (
    theatre_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(100) NOT NULL
);

CREATE TABLE showtimes (
    showtime_id SERIAL PRIMARY KEY,
    movie_id INTEGER REFERENCES movies(movie_id),
    theatre_id INTEGER REFERENCES theatres(theatre_id),
    showtime TIMESTAMP NOT NULL
);

CREATE TABLE dates (
    date_id SERIAL PRIMARY KEY,
    user_id INTEGER[] REFERENCES users(user_id),
    movie_id INTEGER REFERENCES movies(movie_id),
    theatre_id INTEGER REFERENCES theatres(theatre_id),
    date_date DATE NOT NULL,
    showtime_id INTEGER REFERENCES showtimes(showtime_id)
);
```