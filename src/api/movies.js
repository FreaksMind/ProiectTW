export async function getTrendingMovies(req, res) {
  if (req.method != "GET") {
    return res.send(400);
  }

  const api_key = process.env.TMDB_API_KEY;
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}`
  );
  const trendingMovies = await response.json();

  res.send(200, trendingMovies);
}
