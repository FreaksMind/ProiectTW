import bgEffect from "./bgEffect.js";
import checkAuth from "./auth.js";
import { register } from "./services.js";

const { user } = checkAuth();

if (user) {
  window.location.href = "/search.html";
}

document.addEventListener("DOMContentLoaded", bgEffect);

function submitRegister() {
  const username = document.getElementById("username-input").value;
  const password = document.getElementById("password-input").value;
  const confirmPassword = document.getElementById(
    "confirm-password-input"
  ).value;

  if (password != confirmPassword) {
    alert("Password and Confirm password don't match");
    return;
  }

  register({ username, password }).then(({ token, message }) => {
    if (!token) {
      alert(message);
      return;
    }

    localStorage.setItem("token", token);
    window.location.href = "/search.html";
  });
}

document.getElementById("signup-btn").addEventListener("click", submitRegister);
