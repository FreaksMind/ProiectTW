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

  .title-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #list-length {
    color: rgb(140, 140, 140);
  }
</style>

<div class="list">
   <div class="title-container">
      <span id="title"></span>
      <span id="list-length"></span>
   </div>
   <div class="poster-preview"></div>
</div>
`;

class MovieList extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.shadowRoot.querySelector("#title").innerText = this.list.name;
    this.shadowRoot.querySelector("#list-length").innerText = this.list.movies.length + " movies";

    getListPosterPreview(this.list._id).then((posters) => {
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
