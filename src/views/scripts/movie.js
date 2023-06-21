import { addMovieToList, getListPosterPreview, getMovieById, getUserLists } from "./services.js";

import "./components/Spinner.js";
import "./components/BeeButton.js";
import "./components/NavBar.js";
import "./components/Modal.js";
import "./components/MovieList.js";

const currentUrl = window.location.href;
const page_url = new URL(currentUrl);
const params = new URLSearchParams(page_url.search);
const movieId = params.get("id");

async function setMovieDetails() {
  const spinner = document.createElement("my-spinner");

  document.querySelector(".content-container").display = "none";
  document.body.appendChild(spinner);

  const movieDetails = await getMovieById(movieId);
  spinner.remove();

  document.querySelector(".content-container").display = "block";

  spinner.remove();

  if (!movieDetails) {
    console.log("Movie not found or error occurred.");
  } else {
    document.getElementById("movie-title").textContent = movieDetails.original_title;
    document.getElementById("poster").src = `https://image.tmdb.org/t/p/w185${movieDetails.poster_path}`;
    document.getElementById("movie-name").textContent = movieDetails.original_title;

    document.getElementById("movie-rating").textContent = movieDetails.vote_average.toFixed(1);
    document.getElementById("movie-runtime").textContent = `${movieDetails.runtime} mins`;

    document.getElementById("movie-release").innerHTML = `<div class="info-text">${
      movieDetails.release_date.split("-")[0]
    }</div>`;
    document.getElementById("movie-runtime").innerHTML = `<div class="info-text">${movieDetails.runtime} minutes</div>`;

    document.getElementById("movie-restriction").innerHTML = `<div class="info-text">${
      movieDetails.adult ? "16+" : "8+"
    }</div>`;

    document.getElementById("tagline").textContent = movieDetails.tagline;
    document.getElementById("overview").textContent = movieDetails.overview;

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

    const director = movieDetails.credits.crew.find((crewMember) => crewMember.job == "Director");
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
    const productions = movieDetails.production_companies.map((production) => production.name);
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

    const trailerVideo = movieDetails.videos.results.find((video) => video.name == "Official Trailer");
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

document.querySelector("#export-btn").addEventListener("click", async () => {
  //TODO: reuse data movie
  let movieDetailsExport = await getMovieById(movieId);
  let export_data = document.createElement("a");
  export_data.style.display = "none";
  export_data.href = `data:application/json,${encodeURIComponent(JSON.stringify(movieDetailsExport))}`;
  export_data.download = `${movieDetailsExport.original_title}.json`;
  document.body.appendChild(export_data);
  export_data.click();
  document.body.removeChild(export_data);
});

async function setMovieLists() {
  const listsContainer = document.getElementById("movie-lists");

  const spinner = document.createElement("my-spinner");
  listsContainer.appendChild(spinner);

  const lists = await getUserLists();

  spinner.remove();

  for (const list of lists) {
    const el = document.createElement("movie-list");
    el.listName = list.name;
    el.listId = list._id;

    el.addEventListener("click", async () => {
      addMovieToList(list._id, movieId)
        .then(() => {
          document.getElementById("list-modal").visible = false;

          // update list fetch
        })
        .catch((err) => {
          // TODO: show error
        });
    });

    listsContainer.appendChild(el);
  }
}

document.getElementById("list-add-btn").addEventListener("click", () => {
  document.getElementById("list-modal").visible = true;
});

document.getElementById("list-cancel-btn").addEventListener("click", () => {
  document.getElementById("list-modal").visible = false;
});

document.addEventListener("DOMContentLoaded", () => {
  setMovieDetails();
  setMovieLists();
});
