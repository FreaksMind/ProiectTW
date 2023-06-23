
import { route } from "../utils.js";

export async function fetchTmdb(query) {
  const tmdbUrl = "https://api.themoviedb.org/3";
  const apiKey = process.env.TMDB_API_KEY;

  const liaison = query.indexOf("?") != -1 ? "&" : "?";
  const url = `${tmdbUrl}${query}${liaison}api_key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();
  return data;
}


export const searchActors = route({ method: "get", auth: true }, async (req, res) => {
  const { name } = req.params;

  try {
    const data = await fetchTmdb(`/search/person?query=${name}`);
    res.send(200, data.results);
  } catch (err) {
    res.send(400, { error: "error searching actors: " + err });
  }
});


export const getActorById = route({ method: "get", auth: true }, async (req, res) => {
  try {
    const data = await fetchTmdb(
      `/person/${req.params.id}`
    );

    res.send(200, data);
  } catch (err) {
    res.send(400, { error: "error fetching actor: " + err });
  }
});

export const getMoviesByActorId = route({ method: "get", auth: true }, async (req, res) => {
  try {
    const data = await fetchTmdb(
      `/person/${req.params.id}/movie_credits`
    );

    res.send(200, data);
  } catch (err) {
    res.send(400, { error: "error fetching movies: " + err });
  }
});