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
  flex-basis: 300px;
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

<div>
<div class="box">
  <object type="image/png" class="bg-img" alt="movie-poster">
    <img class="bg-img" src="../../assets/no-poster.png" alt="movie poster"/>
  </object>
  <div class="movie-desc" style="cursor: pointer;" class="box">
    <h3 class="result-title"></h3>
  </div>
</div>
`;

class MovieBox extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const name = this.type == "actor" ? this.actor.name : this.movie.original_title;
    const url = this.type == "actor" ? `/actor?id=${this.actor.id}` : `/movie?id=${this.movie.id}`;
    const img = this.type == "actor" ? this.actor.profile_path : this.movie.poster_path;

    this.shadowRoot.querySelector(".bg-img").data = `https://image.tmdb.org/t/p/w300${img}`;
    this.shadowRoot.querySelector(".result-title").innerText = name;
    this.addEventListener("click", () => {
      window.location.href = url;
    });
  }
}

customElements.define("movie-box", MovieBox);
