import { searchMovies } from "./services.js";
import { getUrlParams } from "./utils.js";

import "./components/Spinner.js";
import "./components/NavBar.js";
import "./components/SearchBar.js";

document.addEventListener("DOMContentLoaded", async () => {
  const query = getUrlParams().get("query");

  if (!query) {
    window.location.href = "/search";
    return;
  }

  const container = document.getElementById("results");

  const spinner = document.createElement("my-spinner");

  container.appendChild(spinner);

  const data = await searchMovies(query);

  spinner.remove();

  for (const { id, poster_path, original_title } of data) {
    const el = document.createElement("div");
    el.classList.add("box");
    el.onclick = () => {
      location.href = `movie?id=${id}`;
    };

    el.innerHTML = `
      <img class="bg-img" src="https://image.tmdb.org/t/p/w300${poster_path}"/>
      <div class="movie-desc" onclick=";" style="cursor: pointer;" class="box">
        <h3 class="result-title">${original_title}</h3>
      </div>
    `;

    container.appendChild(el);
  }
});

