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
    border: none;
    font-size: 1rem;
    cursor: pointer;
    font-family: var(--rubik);
  }

  .logout-button:hover {
    color: var(--accent-color);
    text-decoration: underline;
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
