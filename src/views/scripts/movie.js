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
    document.getElementById("movie-rating").textContent =
      movieDetails.vote_average.toFixed(1);
    document.getElementById("movie-release").textContent =
      movieDetails.release_date;
    document.getElementById(
      "movie-runtime"
    ).textContent = `${movieDetails.runtime} mins`;

    document.getElementById("movie-restriction").textContent =
      movieDetails.adult ? "16+" : "8+";
    document.getElementById("overview").textContent = movieDetails.overview;

    const genres = movieDetails.genres.map((genre) => genre.name).join(", ");
    document.getElementById("genres").textContent = genres;
    document.getElementById("actors").textContent = movieDetails.credits.cast
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5)
      .map((actor) => actor.name)
      .join(", ");
    document.getElementById("director").textContent =
      movieDetails.credits.crew.find(
        (crewMember) => crewMember.job == "Director"
      ).name;
    document.getElementById("production").textContent =
      movieDetails.production_companies
        .map((company) => company.name)
        .join(", ");

    const trailerContainer = document.getElementById("trailer-container");

    const trailerKey = movieDetails.videos.results.find(
      (video) => video.name == "Official Trailer"
    ).key;
    trailerContainer.innerHTML = `
      <iframe
        class = "trailer-frame"
        src="https://www.youtube.com/embed/${trailerKey}"
        title="Official trailer"
        frameborder="0"
        allowfullscreen
      ></iframe>`;

    const moviesContainer = document.getElementById("related-movies");

    movieDetails.similar.results.forEach((movie) => {
      const { id, poster_path } = movie;

      if (poster_path != null) {
        const el = document.createElement("div");
        el.classList.add("related-movie");
        el.onclick = () => {
          location.href = `movie?id=${id}`;
        };

        el.innerHTML = `<img class="related-img" src="https://image.tmdb.org/t/p/w300${poster_path}"/>`;

        moviesContainer.appendChild(el);
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", updateMovieDetails);
