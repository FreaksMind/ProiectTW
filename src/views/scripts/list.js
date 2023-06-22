import { getList, getMovieById } from "./services.js";

import "./components/Spinner.js";
import "./components/BeeButton.js";
import "./components/NavBar.js";
import "./components/Modal.js";
import "./components/MovieBox.js";

const params = new URLSearchParams(new URL(window.location.href).search);
const listId = params.get("id");

async function fetchList() {
  const list = await getList(listId);

  document.getElementById("list-title").innerText = list.name;
  document.getElementById("list-length").innerText = list.movies.length + " movies";

  const movies = await Promise.all(list.movies.map((movie) => getMovieById(movie)));

  const container = document.getElementById("movies-container");

  for (const movie of movies) {
    const el = document.createElement("movie-box");
    el.movie = movie;
    container.appendChild(el);
  }

  return movies;
}

function addChart(element, chartData, movies) {
  const ctx = document.getElementById(element).getContext("2d");

  const datasets = chartData.map((data) => {
    const values = movies.map((movie) => movie[data.dataKey]);
    return {
      label: data.label,
      data: values,
    };
  });

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: movies.map((movie) => movie.title),
      datasets: datasets,
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchList().then((movies) => {
    addChart(
      "budget-chart",
      [
        { label: "Budget", dataKey: "budget" },
        { label: "Revenue", dataKey: "revenue" },
      ],
      movies
    );

    addChart("popularity-chart", [{ label: "Popularity", dataKey: "popularity" }], movies);

    addChart("rating-chart", [{ label: "Rating", dataKey: "vote_average" }], movies);
  });
});
