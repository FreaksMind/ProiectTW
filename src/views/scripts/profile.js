import checkAuth from "./auth.js";
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
  if (lists) {
    for (let i = 0; i < lists.length; i++) {
      const list = lists[i];

      const el = document.createElement("movie-list");
      el.listName = list.name;
      el.listId = list._id;

      allLists.appendChild(el);
    }
  }
}

document.addEventListener("DOMContentLoaded", getProfile);
