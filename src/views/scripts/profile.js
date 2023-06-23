import checkAuth from "./auth.js";
import { getUserLists } from "./services.js";

import "./components/Spinner.js";
import "./components/NavBar.js";
import "./components/MovieList.js";

const { logout } = checkAuth();

async function getProfile() {
  const spinner = document.createElement("my-spinner");

  document.body.appendChild(spinner);
  document.querySelector(".main-container").display = "none";

  const allLists = document.getElementById("lists");
  const lists = await getUserLists();

  document.querySelector(".main-container").display = "block";
  spinner.remove();

  if (!lists) {
    return;
  }

  if (lists.length > 0) {
    document.getElementById("no-lists").remove();
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

document.getElementById("logout-btn").addEventListener("click", logout);
document.addEventListener("DOMContentLoaded", getProfile);
