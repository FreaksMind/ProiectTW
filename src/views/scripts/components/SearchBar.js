import { debounce, getUrlParams } from "../utils.js";
import { searchSuggestions, getTrendingMovies } from "../services.js";

const template = document.createElement("template");
template.innerHTML = `
<style>
  #search-bar {
    box-sizing: border-box;
    background-position: 10px 10px;
    background-repeat: no-repeat;
    background-image: url("./assets/beesearch.png");
    font-size: 1em;
    padding: 10px;
    background-color: black;
    border: 2px solid #303030;
    border-radius: 14px;
    outline: none;
    transition: 0.2s ease all;
    width: 100%;
    font-family: var(--inter);
    color: rgb(190, 190, 190);
  }

  #search-bar::placeholder {
    color: #999;
  }

  #search-bar:focus {
    background-color: #101010;
    color: #ffc107;
  }

  .input-wrapper {
    max-width: 95%;
    width: 750px;
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
    width: 60px;
    height: auto;
    transition: 0.3s ease all;
    cursor: pointer;
    transform: rotate(-15deg);
  }

  .search-icon:hover {
    transform: scale(1.3) rotate(-25deg);
  }

  #search-suggestions {
    position: fixed;
    z-index: 12;
    max-width: calc(95% - 60px);
    width: 680px;
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
    <input type="text" placeholder="fast and furious" id="search-bar" />
    <div id="search-btn">
      <img src="./assets/beesearch.png" alt="search-icon" class="search-icon" />
    </div>
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

    async function onSearchBarFocus() {
      if (!this.trendingMovies) {
        return;
      }
      searchSuggestionsEl.innerHTML = "";
      searchSuggestionsEl.style.display = "flex";
      for (const movie of this.trendingMovies) {
        addSuggestion(movie);
      }
    }

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
    searchBar.addEventListener("focus", onSearchBarFocus);
    searchBar.addEventListener("focusout", onSearchBarLostFocus);
    searchBar.addEventListener("keydown", (evt) => {
      if (evt.key == "Enter") {
        searchBtn.click();
      }
    });

    searchBtn.addEventListener("click", submitSearch);
  }
}

customElements.define("search-bar", SearchBar);
