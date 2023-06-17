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
    document.getElementById("actors").textContent = movieDetails.actors;
    document.getElementById("director").textContent = movieDetails.director;
    const productionCompanies = movieDetails.production_companies
      .map((company) => company.name)
      .join(", ");
    document.getElementById("production").textContent = productionCompanies;

    const container = document.getElementById("related-movies");

    movieDetails.relatedMovies.forEach((movie) => {
      const { id, title, poster_path } = movie;

      if (poster_path != null) {
        const el = document.createElement("div");
        el.classList.add("related-movie");
        el.onclick = () => {
          location.href = `movie?id=${id}`;
        };

        el.innerHTML = `<img class="related-img" src="https://image.tmdb.org/t/p/w300${poster_path}"/>`;

        container.appendChild(el);
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", updateMovieDetails);
