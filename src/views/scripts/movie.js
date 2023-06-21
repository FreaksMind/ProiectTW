import { getMovieById } from "./services.js";
import checkAuth from "./auth.js";

const { user } = checkAuth();

if (!user) {
  window.location.href = "/";
}

const currentUrl = window.location.href;
const page_url = new URL(currentUrl);
const params = new URLSearchParams(page_url.search);
const id = params.get("id");

async function updateMovieDetails() {
  const movieDetails = await getMovieById(id);
  if (!movieDetails) {
    console.log("Movie not found or error occurred.");
  } else {
    document.getElementById("movie-title").textContent =
      movieDetails.original_title;
    document.getElementById(
      "poster"
    ).src = `https://image.tmdb.org/t/p/w185${movieDetails.poster_path}`;
    document.getElementById("movie-name").textContent =
      movieDetails.original_title;
    if (movieDetails.vote_average) {
      document.getElementById("movie-rating").textContent =
        movieDetails.vote_average.toFixed(1);
    } else {
      document.getElementById("movie-rating").textContent = "-";
    }
    document.getElementById("movie-release").textContent =
      movieDetails.release_date;
    document.getElementById(
      "movie-runtime"
    ).textContent = `${movieDetails.runtime} mins`;

    document.getElementById("movie-restriction").textContent =
      movieDetails.adult ? "16+" : "8+";
    if (movieDetails.overview) {
      document.getElementById("overview").textContent = movieDetails.overview;
    } else {
      document.getElementById("overview").style.display = "none";
    }

    const genresContainer = document.getElementById("genres");
    const genres = movieDetails.genres.map((genre) => genre.name);
    if (genres.length == 0) {
      const blankDiv = document.createElement("div");
      blankDiv.classList.add("info-text");
      blankDiv.textContent = "-";
      genresContainer.appendChild(blankDiv);
    } else {
      genres.forEach((genre) => {
        const genreDiv = document.createElement("div");
        genreDiv.classList.add("info-text");
        genreDiv.textContent = genre;
        genresContainer.appendChild(genreDiv);
      });
    }

    const actors = movieDetails.credits.cast
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5)
      .map((actor) => actor.name);
    const actorsContainer = document.getElementById("actors");
    if (actors.length == 0) {
      const blankDiv = document.createElement("div");
      blankDiv.classList.add("info-text");
      blankDiv.textContent = "-";
      actorsContainer.appendChild(blankDiv);
    } else {
      actors.forEach((actor) => {
        const actorDiv = document.createElement("div");
        actorDiv.classList.add("info-text");
        actorDiv.textContent = actor;
        actorsContainer.appendChild(actorDiv);
      });
    }

    const director = movieDetails.credits.crew.find(
      (crewMember) => crewMember.job == "Director"
    );
    const directorContainer = document.getElementById("director");
    if (director) {
      const directorDiv = document.createElement("div");
      directorDiv.classList.add("info-text");
      directorDiv.textContent = director.name;
      directorContainer.appendChild(directorDiv);
    } else {
      const blankDiv = document.createElement("div");
      blankDiv.classList.add("info-text");
      blankDiv.textContent = "-";
      directorContainer.appendChild(blankDiv);
    }

    const productionContainer = document.getElementById("production");
    const productions = movieDetails.production_companies.map(
      (production) => production.name
    );
    if (productions.length == 0) {
      const blankDiv = document.createElement("div");
      blankDiv.classList.add("info-text");
      blankDiv.textContent = "-";
      productionContainer.appendChild(blankDiv);
    } else {
      productions.forEach((production) => {
        const prodDiv = document.createElement("div");
        prodDiv.classList.add("info-text");
        prodDiv.textContent = production;
        productionContainer.appendChild(prodDiv);
      });
    }

    const trailerVideo = movieDetails.videos.results.find(
      (video) => video.name == "Official Trailer"
    );
    const trailerDiv = document.getElementById("trailer");
    if (trailerVideo) {
      const trailerKey = trailerVideo.key;

      const h3 = document.createElement("h3");
      h3.textContent = "Official Trailer";
      trailerDiv.appendChild(h3);

      const trailerContainer = document.createElement("div");
      trailerContainer.classList.add("trailer-container");
      trailerContainer.innerHTML = `
      <iframe
        class = "trailer-frame"
        src="https://www.youtube.com/embed/${trailerKey}"
        title="Official trailer"
        frameborder="0"
        allowfullscreen
      ></iframe>`;

      trailerDiv.appendChild(trailerContainer);
    } else {
      trailerDiv.style.display = "none";
    }

    const relatedMovies = document.getElementById("related-movies");
    if (movieDetails.similar.results) {
      const h3 = document.createElement("h3");
      h3.textContent = "Related Movies";
      relatedMovies.appendChild(h3);

      const moviesContainer = document.createElement("div");
      moviesContainer.classList.add("related-movies-gallery");
      movieDetails.similar.results.forEach((movie) => {
        const { id, poster_path } = movie;

        if (poster_path != null) {
          const el = document.createElement("div");
          el.classList.add("related-movie");
          el.onclick = () => {
            location.href = `movie?id=${id}`;
          };

          el.innerHTML = `<img class="related-movies-poster" src="https://image.tmdb.org/t/p/w300${poster_path}"/>`;

          moviesContainer.appendChild(el);
        }
      });
      relatedMovies.appendChild(moviesContainer);
    } else {
      relatedMovies.style.display = "none";
    }
  }
}

document.addEventListener("DOMContentLoaded", updateMovieDetails);
