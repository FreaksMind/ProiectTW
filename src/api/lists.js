import List from "../models/listSchema.js";
import { route } from "../utils.js";

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

  const list = await List.findByIdAndUpdate(
    listId,
    {
      $push: { movies: movieId },
    },
    { new: true }
  );

  res.send(200, list);
});

export const deleteMovieFromList = route({ method: "post", auth: true }, async (req, res) => {
  if (req.method != "POST") {
    return res.send(400);
  }

  const { listId, movieId } = req.body;

  const list = await List.findByIdAndUpdate(
    listId,
    {
      $pull: { movies: movieId },
    },
    { new: true }
  );

  res.send(200, list);
});

// TODO: handle errors

export const deleteList = route({ method: "post", auth: true }, async (req, res) => {
  const { listId } = req.body;
  await List.findByIdAndDelete(listId);

  return res.send(200);
});

export const getUserLists = route({ method: "get", auth: true }, async (req, res) => {
  const lists = await List.find({ userId: req.user.id });
  return res.send(200, lists);
});

export const getList = route({ method: "get", auth: true }, async (req, res) => {
  const list = await List.findById(req.params.id);
  return res.send(200, list);
});
