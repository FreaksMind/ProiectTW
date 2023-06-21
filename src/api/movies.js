async function fetchTmdb(query) {
  const tmdbUrl = "https://api.themoviedb.org/3";
  const apiKey = process.env.TMDB_API_KEY;

  const liaison = query.indexOf("?") != -1 ? "&" : "?";
  const url = `${tmdbUrl}${query}${liaison}api_key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();
  return data;
}

export async function getTrendingMovies(req, res) {
  if (req.method != "GET") {
    return res.send(400);
  }

  try {
    const data = await fetchTmdb(`/discover/movie`);
    res.send(200, data);
  } catch (err) {
    res.send(400, { error: "error fetching movies: " + err });
  }
}

export async function searchMovies(req, res) {
  if (req.method != "GET") {
    return res.send(400);
  }

  const { title } = req.params;

  try {
    const data = await fetchTmdb(`/search/movie?query=${title}`);
    console.log(data);
    res.send(200, data.results);
  } catch (err) {
    res.send(400, { error: "error searching movies: " + err });
  }
}

export async function searchSuggestions(req, res) {
  if (req.method != "GET") {
    return res.send(400);
  }

  const { title } = req.params;

  try {
    const data = await fetchTmdb(`/search/movie?query=${title}`);

    const result = data.results.slice(0, 7).map(({ id, title, release_date }) => ({ id, title, release_date }));

    res.send(200, result);
  } catch (err) {
    res.send(400, { error: "error searching movies: " + err });
  }
}

export async function getMovieById(req, res) {
  if (req.method != "GET") {
    return res.send(400);
  }

  try {
    const data = await fetchTmdb(
      `/movie/${req.params.id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits,similar,videos`
    );

    res.send(200, data);
  } catch (err) {
    res.send(400, { error: "error fetching movie: " + err });
  }
}
