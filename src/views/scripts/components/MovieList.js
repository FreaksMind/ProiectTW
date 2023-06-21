import { getListPosterPreview } from "../services.js";

const template = document.createElement("template");
template.innerHTML = `
<style>
  .list {
    padding: 10px;
    border: 2px solid rgb(30, 30, 30);
    border-radius: 10px;
    font-size: 1rem;
    cursor: pointer;
    transition: 0.1s ease;
  }

  .list:hover {
    border-color: var(--accent-color);
  }

  .poster-preview {
    margin-top: 5px;
    display: flex;
  }

  .poster {
    display: block;
    max-height: 65px;
    border-radius: 7px;
    box-shadow: 12px 0px 10px -2px #000000;
  }

  .poster:not(:first-child) {
     margin-left: -10px;
  }
</style>

<div class="list">
   <div class="title"></div>
   <div class="poster-preview"></div>
</div>
`;

class MovieList extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.shadowRoot.querySelector(".title").innerText = this.listName;

    getListPosterPreview(this.listId).then((posters) => {
      this.shadowRoot.querySelector(".poster-preview").innerHTML += posters
        .map(
          (poster, index) =>
            `<img class="poster" src=${poster} alt="movie poster" style="z-index: ${posters.length - index}" />`
        )
        .join("");
    });
  }
}

customElements.define("movie-list", MovieList);
