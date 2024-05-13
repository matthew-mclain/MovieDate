# MovieDate
MovieDate is a comprehensive movie planning application designed to simplfy the process of keeping track of upcoming movies you want to watch, and planning movie outings with friends.

## Features

### Browse / Search for Upcoming Movies
Easily search for upcoming movies and browse through a vast collection of titles with their movie posters. Users can explore detailed information about each movie, including release date, genres, and synopsis.

### Add Movies to Personal Movie Release Calendar
Keep track of upcoming releases you wish to see by adding them to your personalized movie release calendar. This feature ensures that you never miss a movie premiere again and allows you to plan your movie-watching schedule in advance.

### Follow Other Users and Schedule Movie Dates
Connect with friends and fellow movie buffs by following other users on MovieDate. Users can view each other's calendars and schedule movie dates with their friends by creating an event and adding friends to the date.


## Usage

### What You Need:
   - Node.js and npm installed on your machine
   - API key for TMDB

### Installation:
   - Clone this repository: <code>git clone https://github.com/matthew-mclain/MovieDate</code>
   - Navigate to the project directory: <code>cd MovieDate</code>
   - Install dependencies: <code>npm install</code>
   - Obtain API key for TMDB here: https://developer.themoviedb.org/reference/intro/getting-started
   - Create a .env file in the root directory of the project: <code>touch .env</code>
   - Inside the .env file, add the following information:<br>
       <code>TMDB_BASE_URL=https://api.themoviedb.org/3</code><br>
       <code>TMDB_API_KEY={your_tmdb_api_key}</code><br>
       <code>TMDB_ACCESS_TOKEN={your_tmdb_access_token}</code><br>

### Starting the Server
  - Navigate to the server directory: <code>cd server</code>
  - Start the server: node index.js

### Starting the Client
  - Open a new terminal window
  - Navigate to the client directory: <code>cd client</code>
  - Start the client: <code>npm start</code>