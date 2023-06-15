import checkAuth from "./auth.js";
import {getTrendingMovies} from "./services.js";

const { user, logout } = checkAuth();

if (!user) {
  window.location.href = "/";
}

// TODO: fix carousel end

async function carouselEffect() {
  const items = 20;

  const container = document.getElementById("trending-wrapper");

  // const url =
    // "https://api.themoviedb.org/3/discover/movie?api_key=81a9dfa33886cd2fd7f3d3dd2e1302db&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&vote_count.gte=50";

  // const response = await fetch(url);
  // const data = await response.json();

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
