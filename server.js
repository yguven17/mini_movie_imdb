const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "mini_movie_imdb",
});

pool.query("SELECT * FROM movie", (error, data) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log("Connection made to the database");
});

function getMoviesByDirector(directorId, callback) {
  pool.query(
    "SELECT * FROM MOVIE WHERE director_id = ?",
    [directorId],
    (error, results) => {
      if (error) throw error;
      callback(results);
    }
  );
}

function getMoviesByActor(actorId, callback) {
  pool.query(
    "SELECT * FROM MOVIE m INNER JOIN PLAYS_IN_MOVIES pim ON m.film_id = pim.film_id WHERE pim.actor_id = ?",
    [actorId],
    (error, results) => {
      if (error) throw error;
      callback(results);
    }
  );
}

function getMoviesReleasedAfter(date, callback) {
  pool.query(
    "SELECT * FROM MOVIE WHERE release_date > ?",
    [date],
    (error, results) => {
      if (error) throw error;
      callback(results);
    }
  );
}

function getMoviesByGenre(genre, callback) {
  pool.query(
    "SELECT * FROM MOVIE m INNER JOIN GENRE_MOVIES gm ON m.film_id = gm.film_id WHERE gm.genre = ?",
    [genre],
    (error, results) => {
      if (error) throw error;
      callback(results);
    }
  );
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/moviesByDirector", (req, res) => {
  const directorId = req.query.directorId;
  getMoviesByDirector(directorId, (results) => {
    res.send({ movies: results });
  });
});

app.get("/moviesByActor", (req, res) => {
  const actorId = req.query.actorId;
  getMoviesByActor(actorId, (results) => {
    res.send({ movies: results });
  });
});

app.get("/moviesReleasedAfter", (req, res) => {
  const date = req.query.date;
  getMoviesReleasedAfter(date, (results) => {
    res.send({ movies: results });
  });
});

app.get("/moviesByGenre", (req, res) => {
  const genre = req.query.genre;
  getMoviesByGenre(genre, (results) => {
    res.send({ movies: results });
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
