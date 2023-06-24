import { searchMovies, searchActors } from "./services.js";
import { getUrlParams } from "./utils.js";

import "./components/Spinner.js";
import "./components/NavBar.js";
import "./components/SearchBar.js";
import "./components/MovieBox.js";

document.addEventListener("DOMContentLoaded", async () => {
  const genres_map = {
    27: "horror",
    10749: "romance",
    35: "comedy",
    28: "action",
    18: "drama",
    12: "adventure",
  };

  const query = getUrlParams().get("query");
  const genres = getUrlParams().get("genres");
  const sortBy = getUrlParams().get("sortBy");
  const order = getUrlParams().get("order");
  const type = getUrlParams().get("type");

  if (!query) {
    window.location.href = "/search";
    return;
  }

  const container = document.getElementById("results");

  const spinner = document.createElement("my-spinner");

  container.appendChild(spinner);

  var data = [];
  if(type === "actor")
    data = await searchActors(query);
  else
    data = await searchMovies(query);

  spinner.remove();

  if (data.length === 0) {
    document.querySelector("#no-results").style.display = "block";
    return;
  }

  let filteredData = data;

  if(type != "movie") {

    if (genres) {
      let filter_genres = genres.split(",");

      filteredData = filteredData.filter((d) =>
        d.genre_ids.some((r) => filter_genres.includes(genres_map[r.toString()]))
      );
    }

    if (filteredData.length === 0) {
      document.querySelector("#no-results").style.display = "block";
      return;
    }

    if (sortBy === "popularity") {
      filteredData.filter((d) => d.popularity).sort((a, b) => b.popularity - a.popularity);
    } else if (sortBy === "rating") {
      filteredData.filter((d) => d.vote_average).sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortBy === "release_date") {
      filteredData
        .filter((d) => d.release_date)
        .sort((a, b) => {
          const dateA = new Date(a.release_date);
          const dateB = new Date(b.release_date);
          return dateA - dateB;
        });
    }
  }
  filteredData = filteredData.length > 0 && order === "asc" ? filteredData.reverse() : filteredData;

  if(type === "actor") {
    for (const actor of filteredData) {
      const el = document.createElement("movie-box");
      el.type = "actor";
      el.actor = actor;
      container.appendChild(el);
    }
  } else {
    for (const movie of filteredData) {
      const el = document.createElement("movie-box");
      el.type = "movie";
      el.movie = movie;
      container.appendChild(el);
    } 
  }
});
