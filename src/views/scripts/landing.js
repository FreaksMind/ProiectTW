import bgEffect from "./bgEffect.js";
import { login } from "./services.js";
import checkAuth from "./auth.js";

const { user } = checkAuth();

if (user) {
  window.location.href = "/search";
}

document.addEventListener("DOMContentLoaded", bgEffect);

function submitLogin() {
  const username = document.getElementById("username-input").value;
  const password = document.getElementById("password-input").value;

  login({ username, password }).then(({ token }) => {
    if (!token) {
      // TODO: show error
      return;
    }

    localStorage.setItem("token", token);
    window.location.href = "/search";
  });
}

document.getElementById("login-btn").addEventListener("click", submitLogin);
