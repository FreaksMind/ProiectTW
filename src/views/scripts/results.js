import { searchMovies } from "./services.js";
import { getUrlParams } from "./utils.js";

import "./components/NavBar.js";
import "./components/SearchBar.js";

document.addEventListener("DOMContentLoaded", async () => {
  const query = getUrlParams().get("query");

  const items = 20;

  const container = document.getElementById("results");

  const data = await searchMovies(query);

  //TODO FOREACH
  for (let i = 0; i < items; i++) {
    const { id, poster_path, original_title } = data[i];

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

