import { getMovieById } from "./services.js";
import checkAuth from "./auth.js";

const { user } = checkAuth();

if (!user) {
  window.location.href = "/";
}

const currentUrl = window.location.href;
const page_url = new URL(currentUrl);
const params = new URLSearchParams(page_url.search);
const id = params.get('id');


async function updateMovieDetails() {
  const movieDetails = await getMovieById(id);
  console.log(movieDetails);
  if (!movieDetails) {
    console.log("Movie not found or error occurred.");
  } else {
    console.log(movieDetails.poster_path);
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

    let genresString = "";
    movieDetails.genres.forEach((genre) => {
      genresString += genre.name + ", ";
    });
    document.getElementById("genres").textContent = genresString;
  }
}

document.addEventListener("DOMContentLoaded", updateMovieDetails);
