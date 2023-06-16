import checkAuth from "./auth.js";
import { getTrendingMovies, searchMovies, searchSuggestions } from "./services.js";
import { debounce } from "./utils.js";

const { user, logout } = checkAuth();

if (!user) {
  window.location.href = "/";
}

document.getElementById("logout-btn").addEventListener("click", logout);

// TODO: fix carousel end

async function carouselEffect() {
  const items = 20;

  const container = document.getElementById("trending-wrapper");

  const data = await getTrendingMovies();

  for (let i = 0; i < items; i++) {
    const { poster_path } = data.results[i];

    const el = document.createElement("img");
    el.classList.add("recommendation");

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
    // TODO: fix no hover
    el.className = "suggestion no-hover";
    el.innerText = "no movies found";
    searchSuggestionsEl.appendChild(el);
    return;
  }

  for (const movie of data) {
    // TODO: add link to go to movie page
    const el = document.createElement("div");
    el.className = "suggestion";
    el.innerText = movie;
    searchSuggestionsEl.appendChild(el);
  }
}

const debouncedSearch = debounce(fetchSearchSuggestions, 1000);

function onSearchBarFocus() {
  // TODO: show trending movies as suggestions
}

function onSearchBarLostFocus() {
  searchSuggestionsEl.style.display = "none";
}

async function submitSearch() {
  const title = searchBar.value;
  const data = await searchMovies(title);

  // TODO: go to search page
  // TODO: search page: show search results based on the url parameter
  // if url is /search?query=green
  // show all movies returned by green search

  // TODO: movie page: show movie details based on url id parameter
}

searchBar.addEventListener("input", debouncedSearch);
searchBar.addEventListener("focus", onSearchBarFocus);
searchBar.addEventListener("focusout", onSearchBarLostFocus);

searchBtn.addEventListener("click", submitSearch);
