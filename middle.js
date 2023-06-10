async function getMoviesByDirector(director) {
    const response = await fetch(`http://localhost:3000/moviesByDirector?director=${director}`);
    const jsonData = await response.json();
    return jsonData.results;
}

function displayMoviesByDirector() {
    const director = document.getElementById("director").value;

    getMoviesByDirector(director).then((movies) => {
        const ul = document.getElementById("movies-by-director");
        ul.innerHTML = ""; // Clear the previous results

        movies.forEach((movie) => {
            const li = document.createElement("li");
            li.textContent = movie.title;
            ul.appendChild(li);
        });
    });
}

async function getMoviesByActor(actor) {
    const response = await fetch(`http://localhost:3000/moviesByActor?actor=${actor}`);
    const jsonData = await response.json();
    return jsonData.results;
}

function displayMoviesByActor() {
    const actor = document.getElementById("actor").value;

    getMoviesByActor(actor).then((movies) => {
        const ul = document.getElementById("movies-by-actor");
        ul.innerHTML = ""; // Clear the previous results

        movies.forEach((movie) => {
            const li = document.createElement("li");
            li.textContent = movie.title;
            ul.appendChild(li);
        });
    });
}

async function getMoviesReleasedAfter(date) {
    const response = await fetch(`http://localhost:3000/moviesReleasedAfter?date=${date}`);
    const jsonData = await response.json();
    return jsonData.results;
}

function displayMoviesReleasedAfter() {
    const date = document.getElementById("release-date").value;

    getMoviesReleasedAfter(date).then((movies) => {
        const ul = document.getElementById("movies-released-after");
        ul.innerHTML = ""; // Clear the previous results

        movies.forEach((movie) => {
            const li = document.createElement("li");
            li.textContent = movie.title;
            ul.appendChild(li);
        });
    });
}

async function getMoviesByGenre(genre) {
    const response = await fetch(`http://localhost:3000/moviesByGenre?genre=${genre}`);
    const jsonData = await response.json();
    return jsonData.results;
}

function displayMoviesByGenre() {
    const genre = document.getElementById("genre").value;

    getMoviesByGenre(genre).then((movies) => {
        const ul = document.getElementById("movies-by-genre");
        ul.innerHTML = ""; // Clear the previous results

        movies.forEach((movie) => {
            const li = document.createElement("li");
            li.textContent = movie.title;
            ul.appendChild(li);
        });
    });
}


async function getDirectorsWithMultipleGenres() {
  const response = await fetch("http://localhost:3000/directorsWithMultipleGenres");
  const jsonData = await response.json();
  return jsonData.results;
}

async function getActorsWithDirectorsInSameYear() {
  const response = await fetch("http://localhost:3000/actorsWithDirectorsInSameYear");
  const jsonData = await response.json();
  return jsonData.results;
}
function displayActorsWithDirectorsInSameYear() {
  getActorsWithDirectorsInSameYear().then((actors) => {
    const ul = document.getElementById("actors-with-directors-in-same-year");
    ul.innerHTML = ""; // Clear the previous results

    actors.forEach((actor) => {
      const li = document.createElement("li");
      li.textContent = actor.name;
      ul.appendChild(li);
    });
  });
}


async function getMoviesWithHigherRating() {
  const response = await fetch("http://localhost:3000/moviesWithHigherRating");
  const jsonData = await response.json();
  return jsonData.results;
}
function displayMoviesWithHigherRating() {
  getMoviesWithHigherRating().then((movies) => {
    const ul = document.getElementById("movies-with-higher-rating");
    ul.innerHTML = ""; // Clear the previous results

    movies.forEach((movie) => {
      const li = document.createElement("li");
      li.textContent = movie.name;
      ul.appendChild(li);
    });
  });
}


async function getGenresWithHighestAverageRating() {
  const response = await fetch("http://localhost:3000/genresWithHighestAverageRating");
  const jsonData = await response.json();
  return jsonData.results;
}
function displayGenresWithHighestAverageRating() {
  getGenresWithHighestAverageRating().then((genres) => {
    const ul = document.getElementById("genres-with-highest-average-rating");
    ul.innerHTML = ""; // Clear the previous results

    genres.forEach((genre) => {
      const li = document.createElement("li");
      li.textContent = genre.genre;
      ul.appendChild(li);
    });
  });
}



