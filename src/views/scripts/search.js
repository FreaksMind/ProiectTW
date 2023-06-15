import checkAuth from "./auth.js";
import { getTrendingMovies } from "./services.js";

const { user, logout } = checkAuth();

if (!user) {
  window.location.href = "/";
}

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
document.getElementById("logout-btn").addEventListener("click", logout);
