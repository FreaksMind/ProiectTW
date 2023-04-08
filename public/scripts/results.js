document.addEventListener("DOMContentLoaded", async () => {
  const items = 20;

  const container = document.getElementById("results");

  const url =
    "https://api.themoviedb.org/3/discover/movie?api_key=81a9dfa33886cd2fd7f3d3dd2e1302db&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&vote_count.gte=50";

  const response = await fetch(url);
  const data = await response.json();

  for (let i = 0; i < items; i++) {
    const { poster_path, original_title } = data.results[i];

    const el = document.createElement("div");
    el.classList.add("box");
    el.onclick = () => {
      location.href = "movie.html"
    }

    el.innerHTML = `
      <img class="bg-img" src="https://image.tmdb.org/t/p/w300${poster_path}"/>
      <div class="movie-desc" onclick=";" style="cursor: pointer;" class="box">
        <h3 class="result-title">${original_title}</h3>
      </div>
    `;

    container.appendChild(el);
  }
});
