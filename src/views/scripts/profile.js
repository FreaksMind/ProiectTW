import "./components/Spinner.js";
import "./components/NavBar.js";
import checkAuth from "./auth.js";
import { getUserLists } from "./services.js";

async function getProfile() {
  const spinner = document.createElement("my-spinner");

  document.querySelector(".main-container").display = "none";
  document.body.appendChild(spinner);

  document.querySelector(".main-container").display = "block";
  spinner.remove();

  const user = checkAuth().user;
  document.getElementById("username").textContent = `${user.username}`;

  const allLists = document.getElementById("lists");
  const lists = await getUserLists();
  if (lists) {
    for (let i = 0; i < lists.length; i++) {
      const list = lists[i];
      const listContainer = document.createElement("div");
      listContainer.classList.add("list-container");
      listContainer.textContent = list.name;
      allLists.appendChild(listContainer);
    }
  }
}

document.addEventListener("DOMContentLoaded", getProfile);
