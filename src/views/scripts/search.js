import checkAuth from "./auth.js";
import { getTrendingMovies, searchSuggestions } from "./services.js";
import { debounce } from "./utils.js";

const { user, logout } = checkAuth();

if (!user) {
  window.location.href = "/";
}

document.getElementById("logout-btn").addEventListener("click", logout);

// TODO: fix carousel end
// TODO: make carousel smaller

async function carouselEffect() {
  const items = 20;

  const container = document.getElementById("trending-wrapper");

  const data = await getTrendingMovies();

  for (let i = 0; i < items; i++) {
    const { id, poster_path } = data.results[i];

    const el = document.createElement("img");
    el.classList.add("recommendation");
    el.onclick = () => {
      location.href = `movie?id=${id}`;
    };

    el.src = `https://image.tmdb.org/t/p/w300${poster_path}`;

    container.appendChild(el);
  }
}

document.addEventListener("DOMContentLoaded", carouselEffect);

const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");
const searchSuggestionsEl = document.getElementById("search-suggestions");

async function fetchSearchSuggestions() {
  const title = searchBar.value;
  if (title.length < 3) {
    return;
  }
  const data = await searchSuggestions(title);

  searchSuggestionsEl.innerHTML = "";
  searchSuggestionsEl.style.display = "flex";

  if (data.length == 0) {
    const el = document.createElement("div");
    el.className = "suggestion no-hover";
    el.innerText = "no movies found";
    searchSuggestionsEl.appendChild(el);
    return;
  }

  for (const { id, title, release_date } of data) {
    const el = document.createElement("div");
    el.addEventListener("click", () => {
      const url = `/movie?id=${id}`;
      window.location.href = url;
    });
    el.className = "suggestion";
    let year = release_date.split("-")[0] === "" ? "" : `(${release_date.split("-")[0]})`;
    el.innerText = `${title} ${year}`;
    searchSuggestionsEl.appendChild(el);
  }
}

const debouncedSearch = debounce(fetchSearchSuggestions, 500);

async function onSearchBarFocus() {
  const data = await getTrendingMovies();
  const result = data.results.slice(0, 7);

  searchSuggestionsEl.innerHTML = "";
  searchSuggestionsEl.style.display = "flex";
  for (const { id, title, release_date } of result) {
    const el = document.createElement("div");
    el.addEventListener("click", () => {
      const url = `/movie?id=${id}`;
      window.location.href = url;
    });
    el.className = "suggestion";
    let year = release_date.split("-")[0] === "" ? "" : `(${release_date.split("-")[0]})`;
    el.innerText = `${title} ${year}`;
    searchSuggestionsEl.appendChild(el);
  }
}

function onSearchBarLostFocus(event) {
  if (
    event.explicitOriginalTarget.parentElement.classList.contains("suggestion")
  )
    return;
  searchSuggestionsEl.style.display = "none";
}

async function submitSearch() {
  const title = searchBar.value;
  if(title === ''){
    return;
  }
  const route = `/results?query=${encodeURIComponent(title)}`;
  window.location.href = route;
}

searchBar.addEventListener("input", debouncedSearch);
searchBar.addEventListener("focus", onSearchBarFocus);
searchBar.addEventListener("focusout", onSearchBarLostFocus);

searchBtn.addEventListener("click", submitSearch);
