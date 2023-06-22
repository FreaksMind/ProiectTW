import { debounce, getUrlParams } from "../utils.js";
import { searchSuggestions, getTrendingMovies } from "../services.js";

const template = document.createElement("template");
template.innerHTML = `
<style>
  #search-bar {
    display: block;
    box-sizing: border-box;
    background-position: 10px 10px;
    background-repeat: no-repeat;
    background-image: url("./assets/beesearch.png");
    font-size: 1em;
    padding: 7px 0px 7px 36px;
    background-color: black;
    border: 2px solid #303030;
    border-radius: 14px;
    outline: none;
    transition: 0.2s ease all;
    width: 100%;
    font-family: var(--inter);
    color: rgb(190, 190, 190);
    background: transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='rgb(150, 150, 150)' class='bi bi-search' viewBox='0 0 50 50'%3E%3Cpath d='M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z'%3E%3C/path%3E%3C/svg%3E") no-repeat 10px center;
  }

  #search-bar::placeholder {
    color: #999;
  }

  #search-bar:focus {
    background-color: #101010;
    color: white;
  }

  .input-wrapper {
    margin-left: auto;
    margin-right: auto;
    max-width: 600px;
    width: 100%;
  }

  .search-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    position: relative;
  }

  .search-icon {
    margin-left: 5px;
    width: 50px;
    height: auto;
    transition: 0.3s ease all;
    cursor: pointer;
    transform: rotate(-15deg);
  }

  .search-icon:hover {
    transform: scale(1.3) rotate(-25deg);
  }

  #search-suggestions {
    margin-top: 10px;
    position: fixed;
    z-index: 12;
    width: 100%;
    max-width: 580px;
    padding: 10px 10px;

    color: rgb(190, 190, 190);

    background-color: black;
    border: 2px solid #303030;
    border-radius: 14px;

    display: none;
    flex-direction: column;
    gap: 5px;
  }

  .suggestion {
    max-width: 600px;
    padding: 5px;
    transition: 0.15s ease all;
    border-radius: 6px;
  }

  .suggestion:not(.no-hover):hover {
    cursor: pointer;
    background-color: rgb(10, 10, 10);
    color: white;
  }
</style>

<div class="input-wrapper">
  <div class="search-wrapper">
    <input type="text" placeholder="find movie ..." id="search-bar" />
  </div>

  <div id="search-suggestions" />
</div>
`;

class SearchBar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    getTrendingMovies().then((data) => {
      this.trendingMovies = data.results.slice(0, 7);
    });

    const searchBar = this.shadowRoot.getElementById("search-bar");
    const searchBtn = this.shadowRoot.getElementById("search-btn");
    const searchSuggestionsEl = this.shadowRoot.getElementById("search-suggestions");

    const pathname = window.location.href.split("?")[0];

    if (pathname.includes("results")) {
      const query = getUrlParams().get("query");
      if (query) {
        searchBar.value = decodeURIComponent(query);
      }
    }

    function addSuggestion({ id, title, release_date }) {
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

    async function fetchSearchSuggestions() {
      searchSuggestionsEl.innerHTML = "";
      searchSuggestionsEl.style.display = "none";

      const searchBarValue = searchBar.value;

      if (searchBarValue.length < 3) {
        return;
      }

      const data = await searchSuggestions(searchBarValue);

      searchSuggestionsEl.style.display = "flex";

      if (data.length == 0) {
        const el = document.createElement("div");
        el.className = "suggestion no-hover";
        el.innerText = "no movies found";
        searchSuggestionsEl.appendChild(el);
        return;
      }

      for (const movie of data) {
        addSuggestion(movie);
      }
    }

    const debouncedSearch = debounce(fetchSearchSuggestions, 500);

    function onSearchBarLostFocus(event) {
      if (event.explicitOriginalTarget.parentElement.classList.contains("suggestion")) return;
      searchSuggestionsEl.style.display = "none";
    }

    async function submitSearch() {
      const title = searchBar.value;
      if (title === "") {
        return;
      }
      const route = `/results?query=${encodeURIComponent(title)}`;
      window.location.href = route;
    }

    searchBar.addEventListener("input", debouncedSearch);
    searchBar.addEventListener("focusout", onSearchBarLostFocus);
    searchBar.addEventListener("keydown", (evt) => {
      if (evt.key == "Enter") {
        submitSearch();
      }
    });
  }
}

customElements.define("search-bar", SearchBar);
