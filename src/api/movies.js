export async function getTrendingMovies(req, res) {
  if (req.method != "GET") {
    return res.send(400);
  }

  try {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}`);
    const trendingMovies = await response.json();
    res.send(200, trendingMovies);
  } catch (err) {
    res.send(400, { error: "error fetching movies: " + err });
  }
}
