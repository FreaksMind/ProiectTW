const template = document.createElement("template");
template.innerHTML = `
<style>

.box {
  margin: 0px auto;
  font-size: inherit;
  color: white;

  max-width: 100%;
  min-height: auto;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
}

.bg-img {
  width: 100%;
  border-radius: 10px;
  transition: 0.2s ease all;
}

.movie-desc {
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  padding-left: 15px;
  padding-bottom: 15px;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: 0.3s ease all;
  backdrop-filter: blur(3px) brightness(0.6);
  overflow: hidden;
}

.movie-desc:hover {
  opacity: 1;
}

.result-title {
  font-family: var(--rubik);
  transform: translateY(100%);
  transition: 0.2s ease all;
  padding-right: 20px;
}

.movie-desc:hover .result-title {
  transform: translateY(0%);
}

.box:hover .bg-img {
  transform: scale(1.1);
}


</style>

<div class="box">
  <img class="bg-img" alt="movie poster"/>
  <div class="movie-desc" style="cursor: pointer;" class="box">
    <h3 class="result-title"></h3>
  </div>
</div>
`;

class MovieBox extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const { id, poster_path, original_title } = this.movie;

    this.shadowRoot.querySelector(".bg-img").src = `https://image.tmdb.org/t/p/w300${poster_path}`;
    this.shadowRoot.querySelector(".result-title").innerText = original_title;
    this.addEventListener("click", () => {
      window.location.href = `/movie?id=${id}`;
    });
  }
}

customElements.define("movie-box", MovieBox);
