import { getUsers, deleteUser } from "./services.js";
import { register } from "./services.js";
import "./components/Spinner.js";
import "./components/BeeButton.js";
import "./components/NavBar.js";
import "./components/Modal.js";
import jwt_decode from "../lib/jwt.js";

async function getAdminInfo() {
  const spinner = document.createElement("my-spinner");

  document.querySelector(".main-container").display = "none";
  document.body.appendChild(spinner);

  document.querySelector(".main-container").display = "block";
  spinner.remove();

  const users = await getUsers();
  const usersList = document.getElementById("users-list");
  for (let i = 0; i < users.length; i++) {
    const userDiv = document.createElement("div");
    userDiv.classList.add("user-container");

    const username = document.createElement("span");
    username.textContent = users[i].username;
    userDiv.appendChild(username);

    const deleteUserButton = document.createElement("button");
    deleteUserButton.textContent = "delete user";
    deleteUserButton.addEventListener("click", function () {
      document.getElementById("delete-modal").visible = true;

      document
        .getElementById("yes-button")
        .addEventListener("click", async () => {
          const deletedUser = await deleteUser(users[i]._id);
          if (deletedUser) {
            userDiv.remove();
          }
          document.getElementById("delete-modal").visible = false;
        });
      document
        .getElementById("no-button")
        .addEventListener("click", async () => {
          document.getElementById("delete-modal").visible = false;
        });
    });
    userDiv.appendChild(deleteUserButton);

    usersList.appendChild(userDiv);
  }
}

async function createNewUser() {
  const username = document.getElementById("username-input").value;
  const password = document.getElementById("password-input").value;
  const confirmPassword = document.getElementById(
    "confirm-password-input"
  ).value;

  if (password != confirmPassword) {
    alert("Password and Confirm password don't match");
    return;
  }

  register({ username, password }).then(async ({ token, message }) => {
    if (!token) {
      alert(message);
      return;
    } else {
      const decoded = jwt_decode(token);
      const userId = decoded.id;
      const username = decoded.username;
      console.log(userId, username);

      const userDiv = document.createElement("div");
      userDiv.classList.add("user-container");

      const usernameSpan = document.createElement("span");
      usernameSpan.textContent = username;
      userDiv.appendChild(usernameSpan);

      const deleteUserButton = document.createElement("button");
      deleteUserButton.textContent = "delete user";
      deleteUserButton.addEventListener("click", function () {
        document.getElementById("delete-modal").visible = true;

        document
          .getElementById("yes-button")
          .addEventListener("click", async () => {
            const deletedUser = await deleteUser(userId);
            if (deletedUser) {
              userDiv.remove();
            }
            document.getElementById("delete-modal").visible = false;
          });
        document
          .getElementById("no-button")
          .addEventListener("click", async () => {
            document.getElementById("delete-modal").visible = false;
          });
      });
      userDiv.appendChild(deleteUserButton);

      document.getElementById("users-list").appendChild(userDiv);

      document.getElementById("user-modal").visible = false;
    }
  });
}

function setInputsNull() {
  document.getElementById("username-input").value = "";
  document.getElementById("password-input").value = "";
  document.getElementById("confirm-password-input").value = "";
}

document.getElementById("add-user-btn").addEventListener("click", () => {
  setInputsNull();
  document.getElementById("user-modal").visible = true;
});

document.getElementById("cancel-add-btn").addEventListener("click", () => {
  setInputsNull();
  document.getElementById("user-modal").visible = false;
});

document.getElementById("");
document
  .getElementById("create-user-btn")
  .addEventListener("click", createNewUser);
document.addEventListener("DOMContentLoaded", getAdminInfo);
