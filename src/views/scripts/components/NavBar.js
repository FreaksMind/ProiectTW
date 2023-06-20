import checkAuth from "../auth.js";

const template = document.createElement("template");
template.innerHTML = `
<style>
  .logout-button {
    position: fixed;
    right: 20px;
    top: 20px;
    color: white;
    background-color: transparent;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    font-family: var(--rubik);
    transition: 0.2s ease all;
    border-bottom: 1px solid black;
  }

  .logout-button:hover {
    color: var(--accent-color);
    border-color: var(--accent-color);
</style>

<button id="logout-btn" class="logout-button">logout</button>
}
`;

class NavBar extends HTMLElement {
  connectedCallback() {
    const { user, logout } = checkAuth();

    if (!user) {
      window.location.href = "/";
    }

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.shadowRoot.getElementById("logout-btn").addEventListener("click", logout);
  }
}

customElements.define("nav-bar", NavBar);
