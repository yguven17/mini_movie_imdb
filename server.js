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

function getMoviesByDirector(director, callback) {
  pool.query(
    "SELECT * FROM MOVIE m INNER JOIN DIRECTOR d ON m.director_id = d.director_id WHERE d.name LIKE ?",
    [`%${director}%`],
    (error, results) => {
      if (error) throw error;
      callback(results);
    }
  );
}



function getMoviesByActor(actorName, callback) {
  pool.query(
    "SELECT m.* FROM MOVIE m INNER JOIN PLAYS_IN_MOVIES pim ON m.film_id = pim.film_id INNER JOIN ACTOR a ON pim.actor_id = a.actor_id WHERE a.name LIKE ?",
    [`%${actorName}%`],
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
  const director = req.query.director;
  getMoviesByDirector(director, (results) => {
    res.send({ movies: results });
  });
});

app.get("/moviesByActor", (req, res) => {
  const actor = req.query.actor;
  getMoviesByActor(actor, (results) => {
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
