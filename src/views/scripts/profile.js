import { getUserLists } from "./services.js";

import "./components/Spinner.js";
import "./components/NavBar.js";
import "./components/MovieList.js";

async function getProfile() {
  const spinner = document.createElement("my-spinner");

  document.querySelector(".main-container").display = "none";
  document.body.appendChild(spinner);

  document.querySelector(".main-container").display = "block";
  spinner.remove();

  const allLists = document.getElementById("lists");
  const lists = await getUserLists();

  if (!lists) {
    return;
  }

  for (const list of lists) {
    const el = document.createElement("movie-list");
    el.list = list;
    el.addEventListener("click", () => {
      window.location.href = `/list?id=${list._id}`;
    });

    allLists.appendChild(el);
  }
}

document.addEventListener("DOMContentLoaded", getProfile);
