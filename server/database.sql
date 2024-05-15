CREATE DATABASE MovieDateDB;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    CONSTRAINT unique_username UNIQUE (username),
    CONSTRAINT unique_email UNIQUE (email)
);

CREATE TABLE movies (
    movie_id INTEGER PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    original_title VARCHAR(100) NOT NULL,
    original_language VARCHAR(2) NOT NULL,
    release_date DATE NOT NULL,
    genres TEXT[],
    overview TEXT,
    runtime INTEGER,
    poster_path VARCHAR(100),
    backdrop_path VARCHAR(100),
    vote_average DECIMAL,
    vote_count INTEGER,
    popularity DECIMAL
);

CREATE TABLE user_movies (
    user_movie_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    movie_id INTEGER REFERENCES movies(movie_id) ON DELETE CASCADE,
    CONSTRAINT unique_user_movies UNIQUE (user_id, movie_id)
);

CREATE TABLE user_friends (
    user_friend_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    friend_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT unique_user_friends UNIQUE (user_id, friend_id),
    CONSTRAINT no_self_friends CHECK (user_id != friend_id)
);

CREATE TABLE dates (
    date_id SERIAL PRIMARY KEY,
    movie_id INTEGER REFERENCES movies(movie_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TIME,
    theater VARCHAR(100),
    invited_users VARCHAR(100)[]
);

-- CREATE TABLE user_dates (
--     user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
--     date_id INTEGER REFERENCES dates(date_id) ON DELETE CASCADE,
--     PRIMARY KEY (user_id, date_id)
-- );

CREATE INDEX username_index ON users (username);
CREATE INDEX title_index ON movies (title);
CREATE INDEX original_title_index ON movies (original_title);
```