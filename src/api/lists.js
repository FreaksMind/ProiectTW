import List from "../models/listSchema.js";
import { route } from "../utils.js";
import { fetchTmdb } from "./movies.js";

export const createNewList = route({ method: "post", auth: true }, async (req, res) => {
  const { name } = req.body;

  const newList = new List({
    name,
    movieIds: [],
    userId: req.user.id,
  });
  newList.save();
  return res.send(200, newList);
});

export const addMovieToList = route({ method: "post", auth: true }, async (req, res) => {
  const { listId, movieId } = req.body;

  const list = await List.findOneAndUpdate(
    { _id: listId, userId: req.user.id },
    {
      $addToSet: { movies: movieId },
    },
    { new: true }
  );
  if (list) {
    res.send(200, list);
  } else {
    res.send(400, "List not found");
  }
});

export const deleteMovieFromList = route({ method: "post", auth: true }, async (req, res) => {
  if (req.method != "POST") {
    return res.send(400);
  }

  const { listId, movieId } = req.body;

  const list = await List.findOneAndUpdate(
    { _id: listId, userId: req.user.id },
    {
      $pull: { movies: movieId },
    },
    { new: true }
  );

  if (list) {
    res.send(200, list);
  } else {
    res.send(400, "List don't exist");
  }
});

// TODO: handle errors
// TODO: dont let other users access your list
// TODO: dont allow same movie in the list twice

export const deleteList = route({ method: "post", auth: true }, async (req, res) => {
  const { listId } = req.body;

  const list = await List.findOneAndDelete({
    _id: listId,
    userId: req.user.id,
  });

  if (list) {
    return res.send(200);
  } else {
    return res.send(400, "Not your list");
  }
});

export const getUserLists = route({ method: "get", auth: true }, async (req, res) => {
  const lists = await List.find({ userId: req.user.id }).sort({ updatedAt: -1 });
  return res.send(200, lists);
});

export const getList = route({ method: "get", auth: true }, async (req, res) => {
  const list = await List.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });
  if (list) {
    return res.send(200, list);
  } else {
    return res.send(400, "List not found");
  }
});

export const getListPosterPreview = route({ method: "get", auth: true }, async (req, res) => {
  const list = await List.findById(req.params.id);

  const posters = await Promise.all(
    list.movies.slice(0, 5).map(async (movieId) => {
      const { poster_path } = await fetchTmdb(`/movie/${movieId}`);
      return `https://image.tmdb.org/t/p/w300${poster_path}`;
    })
  );

  res.send(200, posters);
});
