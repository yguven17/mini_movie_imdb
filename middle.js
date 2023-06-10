async function getMoviesByDirector(directorId) {
  const response = await fetch(`http://localhost:3000/moviesByDirector?directorId=${directorId}`);
  const jsonData = await response.json();
  return jsonData.results;
}

function displayMoviesByDirector() {
  const directorId = document.getElementById("directorId").value;

  getMoviesByDirector(directorId).then((movies) => {
    const ul = document.getElementById("movies-by-director");
    ul.innerHTML = ""; // Clear the previous results

    movies.forEach((movie) => {
      const li = document.createElement("li");
      li.textContent = movie.title;
      ul.appendChild(li);
    });
  });
}

async function getMoviesByActor(actorId) {
  const response = await fetch(`http://localhost:3000/moviesByActor?actorId=${actorId}`);
  const jsonData = await response.json();
  return jsonData.results;
}

function displayMoviesByActor() {
  const actorId = document.getElementById("actorId").value;

  getMoviesByActor(actorId).then((movies) => {
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
