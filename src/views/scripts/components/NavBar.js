import checkAuth from "../auth.js";

import "./SearchBar.js";

const template = document.createElement("template");
template.innerHTML = `
<style>
  .logout-button {
    color: white;
    background-color: transparent;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    font-family: var(--rubik);
  }

  .logout-button:hover {
    color: var(--accent-color);
    text-decoration: underline;
  }

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
       <button id="logout-btn" class="logout-button">logout</button>
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
    const { user, logout } = checkAuth();

    if (!user) {
      window.location.href = "/";
    }

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.shadowRoot.getElementById("logout-btn").addEventListener("click", logout);

    if (!this.searchbar) {
      return;
    }

    // add searchbar

    this.shadowRoot.getElementById("search-bar-container").appendChild(document.createElement("search-bar"));
  }
}

customElements.define("nav-bar", NavBar);
