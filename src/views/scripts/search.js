import { getTrendingMovies } from "./services.js";

import "./components/NavBar.js";
import "./components/SearchBar.js";

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
