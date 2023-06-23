import { deleteList, getList, getMovieById } from "./services.js";

import "./components/Spinner.js";
import "./components/BeeButton.js";
import "./components/NavBar.js";
import "./components/Modal.js";
import "./components/MovieBox.js";

const params = new URLSearchParams(new URL(window.location.href).search);
const listId = params.get("id");

const deleteModal = document.getElementById("delete-modal");
const exportModal = document.getElementById("export-modal");

async function fetchList() {
  const list = await getList(listId);

  document.querySelectorAll(".list-title").forEach((el) => {
    el.innerText = list.name;
  });
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

function addChart(title, chartData, movies, parent = "#stats-container") {
  const el = document.createElement("div");
  const statId = title.split(" ").join() + "-stat";
  el.innerHTML = `
    <div class="stat-title">
      <h2>${title}</h2>
      <button class="export-btn">export</button>
    </div>
    <canvas id="${statId}"></canvas>
  `;
  el.classList.add("stat");
  document.querySelector(parent).appendChild(el);

  const datasets = chartData.map((data) => {
    const values = movies.map((movie) => movie[data.dataKey]);
    return {
      label: data.label,
      data: values,
    };
  });

  const canvas = document.getElementById(statId);
  const ctx = canvas.getContext("2d");

  const chart = new Chart(ctx, {
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

  el.querySelector(".export-btn").addEventListener("click", () => {
    exportModal.visible = true;

    const csvBtn = document.getElementById("export-csv-btn");
    const svgBtn = document.getElementById("export-svg-btn");
    const webpBtn = document.getElementById("export-webp-btn");

    csvBtn.addEventListener(
      "click",
      () => {
        downloadCSV({
          filename: `${title}.csv`,
          chart,
        });

        exportModal.visible = false;
      },
      { once: true }
    );

    webpBtn.addEventListener(
      "click",
      () => {
        const link = document.createElement("a");

        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          link.href = url;
          link.download = `${title}.webp`;
          link.click();

          URL.revokeObjectURL(url);
        }, "image/webp");

        exportModal.visible = false;
      },
      { once: true }
    );
  });
}

document.getElementById("delete-btn").addEventListener("click", () => {
  deleteModal.visible = true;
});

document.getElementById("cancel-delete-btn").addEventListener("click", () => {
  deleteModal.visible = false;
});

document.getElementById("cancel-export-btn").addEventListener("click", () => {
  exportModal.visible = false;
});

document.getElementById("confirm-delete-btn").addEventListener("click", () => {
  deleteList(listId)
    .then(() => {
      window.location.href = "/profile";
    })
    .catch((err) => {
      alert("erorr deleting list", err);
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const spinner = document.createElement("my-spinner");
  document.body.appendChild(spinner);
  document.querySelector(".container").style.display = "none";

  fetchList().then((movies) => {
    spinner.remove();
    document.querySelector(".container").style.display = "block";

    addChart(
      "Budget vs Revenue",
      [
        { label: "Budget", dataKey: "budget" },
        { label: "Revenue", dataKey: "revenue" },
      ],
      movies
    );

    const doubleStatContainer = document.createElement("div");
    doubleStatContainer.classList.add("double-stat");
    document.querySelector("#stats-container").appendChild(doubleStatContainer);

    addChart("Popularity", [{ label: "Popularity", dataKey: "popularity" }], movies, ".double-stat");

    addChart("Rating", [{ label: "Rating", dataKey: "vote_average" }], movies, ".double-stat");
  });
});

function convertChartDataToCSV(args) {
  let result, columnDelimiter, lineDelimiter, labels, data;

  data = args.data.data || null;
  if (data == null || !data.length) {
    return null;
  }

  labels = args.labels || null;
  if (labels == null || !labels.length) {
    return null;
  }

  columnDelimiter = args.columnDelimiter || ",";
  lineDelimiter = args.lineDelimiter || "\n";

  result = args.data.label.toString();

  for (let i = 0; i < data.length; i++) {
    result += columnDelimiter;
    result += data[i];
  }
  result += lineDelimiter;

  return result;
}

function downloadCSV(args) {
  let data, filename, link;
  let csv = "";

  const chart = args.chart;
  const dataLabels = chart.config._config.data.labels;

  csv += dataLabels.join(", ") + "\n";

  for (var i = 0; i < chart.data.datasets.length; i++) {
    csv += convertChartDataToCSV({
      data: chart.data.datasets[i],
      labels: dataLabels,
    });
  }
  if (csv == null) return;

  filename = args.filename || "chart-data.csv";
  if (!csv.match(/^data:text\/csv/i)) {
    csv = "data:text/csv;charset=utf-8," + csv;
  }

  // not sure if anything below this comment works
  data = encodeURI(csv);
  link = document.createElement("a");
  link.setAttribute("href", data);
  link.setAttribute("download", filename);
  document.body.appendChild(link); // Required for FF
  link.click();
  document.body.removeChild(link);
}
