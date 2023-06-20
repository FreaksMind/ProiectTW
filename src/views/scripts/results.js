import { searchMovies } from "./services.js";
import checkAuth from "./auth.js";

const { user } = checkAuth();

if (!user) {
  window.location.href = "/";
}

const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");

document.addEventListener("DOMContentLoaded", async () => {
  const currentUrl = window.location.href;
  const page_url = new URL(currentUrl);
  const params = new URLSearchParams(page_url.search);
  const query = params.get("query");

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

async function submitSearch() {
  const title = searchBar.value;
  if(title === ''){
    return;
  }
  const route = `/results?query=${encodeURIComponent(title)}`;
  window.location.href = route;
}


searchBtn.addEventListener('click', submitSearch);