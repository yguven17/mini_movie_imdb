const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
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
// complex queries

function getDirectorsWithMultipleGenres(callback) {
  const query = `
    SELECT D.name
    FROM DIRECTOR D
    JOIN MOVIE M ON D.director_id = M.director_id
    JOIN GENRE_MOVIES GM ON M.film_id = GM.film_id
    GROUP BY D.director_id
    HAVING COUNT(DISTINCT GM.genre) >= 3;
  `;

  pool.query(query, (error, results) => {
    if (error) throw error;
    callback(results);
  });
}
function getActorsWithDirectorsInSameYear(callback) {
  const query = `
    SELECT A.name
    FROM ACTOR A
    JOIN PLAYS_IN_MOVIES PIM ON A.actor_id = PIM.actor_id
    JOIN MOVIE M ON PIM.film_id = M.film_id
    JOIN DIRECTOR D1 ON M.director_id = D1.director_id
    JOIN DIRECTOR D2 ON M.director_id <> D2.director_id
    WHERE YEAR(D1.birth_date) = YEAR(D2.birth_date)
    GROUP BY A.actor_id
    HAVING COUNT(DISTINCT M.director_id) >= 2;
  `;

  pool.query(query, (error, results) => {
    if (error) throw error;
    callback(results);
  });
}
function getMoviesWithHigherRating(callback) {
  const query = `
    SELECT name
    FROM MOVIE
    WHERE rating > (SELECT AVG(rating) FROM MOVIE);
  `;

  pool.query(query, (error, results) => {
    if (error) throw error;
    callback(results);
  });
}

function getGenresWithHighestAverageRating(callback) {
  const query = `
    SELECT GM.genre
    FROM GENRE_MOVIES GM
    JOIN MOVIE M ON GM.film_id = M.film_id
    WHERE M.release_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
    GROUP BY GM.genre
    HAVING AVG(M.rating) = (
      SELECT MAX(avg_rating)
      FROM (
        SELECT AVG(M.rating) AS avg_rating
        FROM GENRE_MOVIES GM
        JOIN MOVIE M ON GM.film_id = M.film_id
        WHERE M.release_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
        GROUP BY GM.genre
      ) AS avg_ratings
    );
  `;

  pool.query(query, (error, results) => {
    if (error) throw error;
    callback(results);
  });
}







// linking
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/moviesByDirector", (req, res) => {
    const director = req.query.director;
    getMoviesByDirector(director, (results) => {
        res.send({movies: results});
    });
});

app.get("/moviesByActor", (req, res) => {
    const actor = req.query.actor;
    getMoviesByActor(actor, (results) => {
        res.send({movies: results});
    });
});

app.get("/moviesReleasedAfter", (req, res) => {
    const date = req.query.date;
    getMoviesReleasedAfter(date, (results) => {
        res.send({movies: results});
    });
});

app.get("/moviesByGenre", (req, res) => {
    const genre = req.query.genre;
    getMoviesByGenre(genre, (results) => {
        res.send({movies: results});
    });
});

app.get("/directorsWithMultipleGenres", (req, res) => {
  getDirectorsWithMultipleGenres((results) => {
    res.send({ directors: results });
  });
});

app.get("/actorsWithDirectorsInSameYear", (req, res) => {
  getActorsWithDirectorsInSameYear((results) => {
    res.send({ actors: results });
  });
});

app.get("/moviesWithHigherRating", (req, res) => {
  getMoviesWithHigherRating((results) => {
    res.send({ movies: results });
  });
});

app.get("/genresWithHighestAverageRating", (req, res) => {
  getGenresWithHighestAverageRating((results) => {
    res.send({ genres: results });
  });
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
