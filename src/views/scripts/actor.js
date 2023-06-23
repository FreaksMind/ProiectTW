import { addMovieToList, createList, getActorById, getMovieById, getUserLists, getMoviesByActorId} from "./services.js";

import "./components/Spinner.js";
import "./components/BeeButton.js";
import "./components/NavBar.js";
import "./components/Modal.js";
import "./components/MovieList.js";
import "./components/MovieBox.js";

const currentUrl = window.location.href;
const page_url = new URL(currentUrl);
const params = new URLSearchParams(page_url.search);
const actorId = params.get("id");

async function setMovieDetails() {
  const spinner = document.createElement("my-spinner");

  document.querySelector(".content-container").display = "none";
  document.body.appendChild(spinner);

  const movieDetails = await getActorById(actorId);
  //TODO: fix this ca i cam buguita
  if (movieDetails.success === false) {
    window.location.href = "/error";
  } else {
    const data = await getMoviesByActorId(actorId);
    spinner.remove();

    document.querySelector(".content-container").display = "block";

    spinner.remove();

    document.getElementById("movie-title").textContent = movieDetails.name;
    document.getElementById("poster").src = `https://image.tmdb.org/t/p/w185${movieDetails.profile_path}`;
    document.getElementById("movie-name").textContent = movieDetails.name;

    document.getElementById("movie-rating").textContent = movieDetails.popularity.toFixed(1);

    document.getElementById("movie-release").innerHTML = `<div class="info-text">${
      movieDetails.birthday
    }</div>`;
    document.getElementById("movie-runtime").innerHTML = `<div class="info-text">${movieDetails.gender === 2 ? "male" : "female"}</div>`;

    document.getElementById("overview").textContent = movieDetails.biography;

    const relatedMovies = document.getElementById("movies");
    console.log(data.cast);
    if (data.cast) {
       const h3 = document.createElement("h3");
       h3.textContent = "Plays in:";
      data.cast.slice(0,8).forEach((movie) => {
        const { id, poster_path } = movie;
        if (poster_path != null) {
          const el = document.createElement("movie-box");
          el.type = "movie";
          el.movie = movie;
          relatedMovies.appendChild(el);
        }
      });
    } else {
      relatedMovies.style.display = "none";
    }
  } 
}

document.querySelector("#export-btn").addEventListener("click", async () => {
  //TODO: reuse data movie
  let actorDetailsExport = await getActorById(actorId);
  let export_data = document.createElement("a");
  export_data.style.display = "none";
  export_data.href = `data:application/json,${encodeURIComponent(JSON.stringify(actorDetailsExport))}`;
  export_data.download = `${actorDetailsExport.name}.json`;
  document.body.appendChild(export_data);
  export_data.click();
  document.body.removeChild(export_data);
});

document.addEventListener("DOMContentLoaded", () => setMovieDetails());

