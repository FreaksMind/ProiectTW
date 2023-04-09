document.addEventListener("DOMContentLoaded", async () => {
  const items = 10;

  const container = document.getElementById("bg-wrapper");

  const url =
    "https://api.themoviedb.org/3/discover/movie?api_key=81a9dfa33886cd2fd7f3d3dd2e1302db&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&vote_count.gte=50";

  const response = await fetch(url);
  const data = await response.json();

  const maxSpeed = 1;

  for (let i = 0; i < items; i++) {
    const { poster_path } = data.results[i];

    const el = document.createElement("img");
    el.dataset.x = Math.floor(Math.random() * window.innerWidth);
    el.dataset.y = Math.floor(Math.random() * window.innerHeight);
    el.dataset.vx = -maxSpeed + Math.random() * maxSpeed * 2;
    el.dataset.vy = -maxSpeed + Math.random() * maxSpeed * 2;
    el.classList.add("bg-img");
    el.src = `https://image.tmdb.org/t/p/w300${poster_path}`;

    container.appendChild(el);
  }

  const imgs = document.getElementsByClassName("bg-img");

  function animate() {
    window.requestAnimationFrame(() => animate());

    for (const el of Array.from(imgs)) {
      el.dataset.x = +el.dataset.x + +el.dataset.vx;
      el.dataset.y = +el.dataset.y + +el.dataset.vy;

      el.style.left = el.dataset.x + "px";
      el.style.top = el.dataset.y + "px";

      const rect = el.getBoundingClientRect();

      if (+el.dataset.x > window.innerWidth) {
        el.dataset.x = -rect.width;
      }
      if (+el.dataset.x < -rect.width) {
        el.dataset.x = window.innerWidth;
      }
      if (+el.dataset.y > window.innerHeight) {
        el.dataset.y = -rect.height;
      }
      if (+el.dataset.y < -rect.height) {
        el.dataset.y = window.innerHeight + rect.height;
      }
    }
  }

  animate();
});
