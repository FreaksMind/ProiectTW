import { route } from "../utils.js";
import { fetchTmdb } from "./movies.js";

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
    const data = await fetchTmdb(`/person/${req.params.id}`);

    res.send(200, data);
  } catch (err) {
    res.send(400, { error: "error fetching actor: " + err });
  }
});

export const getMoviesByActorId = route({ method: "get", auth: true }, async (req, res) => {
  try {
    const data = await fetchTmdb(`/person/${req.params.id}/movie_credits`);

    data.cast = data.cast.slice(0, 20);

    res.send(200, data);
  } catch (err) {
    res.send(400, { error: "error fetching movies: " + err });
  }
});

