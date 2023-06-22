import checkAuth from "../auth.js";

import "./SearchBar.js";

const template = document.createElement("template");
template.innerHTML = `
<style>

  .wrapper {
    z-index: 100;
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    background-color: rgb(10, 10, 10);
    height: 60px;
    -webkit-box-shadow: 0px 13px 28px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 13px 28px 0px rgba(0,0,0,0.75);
    box-shadow: 0px 13px 28px 0px rgba(0,0,0,0.75);
    margin-bottom: 20px;
  }

  .container {
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1000px;
  }

  .title {
    cursor: pointer;
    color: white;
    font-size: 1.2rem;
    font-family: var(--rubik);
    font-weight: 700;
  }
  .bee-text {
    color: #ffc107;
  }

  #search-bar-container {
    width: 100%;
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .bee-icon {
    width: 40px;
    height: auto;
    display: block;
    margin-right: 10px;
    margin-bottom: 5px;
    transform: rotate(-30deg);
    transform-origin: center;
  }

  .logo:hover .bee-icon {
    animation: juicySpin 1.5s ease-in-out;
  }

  @keyframes juicySpin {
    0% {
      transform: scale(1) rotate(-30deg);
    }
    50% {
      transform: scale(1.6) rotate(45deg);
    }
    100% {
      transform: scale(1) rotate(1440deg);
    }
  }

  #account-btn {
    color: white;
    background-color: transparent;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    font-family: var(--rubik);
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(140, 140, 140);
    gap: 5px;
    border-radius: 10px;
    transition: 0.1s ease;
    padding: 5px 10px;
    text-decoration: none;
  }

#account-btn:hover {
  background-color: rgb(30, 30, 30);
}

</style>

<div class="wrapper">
  <div class="container">
    <div onclick="window.location = '/search'" class="logo">
      <div>
        <img src="./assets/beesearch.png" alt="search-icon" class="bee-icon" />
      </div>
      <p class="title">sta<span class="bee-text">bee</span>stics</p>
    </div>
    <div id="search-bar-container"></div>
    <div>
      <a id="account-btn" href="/profile">
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" id="account" viewBox="0 0 48 48"><path fill="rgb(70, 70, 70)"  d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 6c3.31 0 6 2.69 6 6 0 3.32-2.69 6-6 6s-6-2.68-6-6c0-3.31 2.69-6 6-6zm0 28.4c-5.01 0-9.41-2.56-12-6.44.05-3.97 8.01-6.16 12-6.16s11.94 2.19 12 6.16c-2.59 3.88-6.99 6.44-12 6.44z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
        <span id="username-label"></span>
      </a>
    </div>
  </div>
<div/>
`;

class NavBar extends HTMLElement {
  get searchbar() {
    return this.hasAttribute("searchbar");
  }

  set searchbar(value) {
    if (value) {
      this.setAttribute("searchbar", "");
    } else {
      this.removeAttribute("searchbar");
    }
  }

  static get observedAttributes() {
    return ["searchbar"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "searchbar" && this.shadowRoot) {
      if (newValue === null) {
        this.shadowRoot.querySelector(".wrapper").classList.remove("searchbar");
      } else {
        this.shadowRoot.querySelector(".wrapper").classList.add("searchbar");
      }
    }
  }

  connectedCallback() {
    const { user } = checkAuth();

    if (!user) {
      window.location.href = "/";
    }

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // this.shadowRoot.getElementById("logout-btn").addEventListener("click", logout);

    this.shadowRoot.getElementById("username-label").innerText = user.username;

    if (!this.searchbar) {
      return;
    }

    // add searchbar

    this.shadowRoot.getElementById("search-bar-container").appendChild(document.createElement("search-bar"));
  }
}

customElements.define("nav-bar", NavBar);
