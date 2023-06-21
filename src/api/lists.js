import List from "../models/listSchema.js";
export async function createNewList(req, res) {
  if (req.method != "POST") {
    return res.send(400);
  }

  const { name } = req.body;

  const newList = new List({
    name,
    movieIds: [],
    userId: req.user.id,
  });
  newList.save();
  return res.send(200, newList);
}

export async function addMovieToList(req, res) {
  if (req.method != "POST") {
    return res.send(400);
  }

  const { listId, movieId } = req.body;

  const list = await List.findByIdAndUpdate(
    listId,
    {
      $push: { movies: movieId },
    },
    { new: true }
  );

  res.send(200, list);
}

export async function deleteMovieFromList(req, res) {
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
}

export async function deleteList(req, res) {
  if (req.method != "POST") {
    return res.send(400);
  }

  const { listId } = req.body;
  await List.findByIdAndDelete(listId);

  return res.send(200);
}

export async function getUserLists(req, res) {
  if (req.method != "GET") {
    return res.send(400);
  }

  const lists = await List.find({ userId: req.user.id });
  return res.send(200, lists);
}

export async function getList(req, res) {
  if (req.method != "GET") {
    return res.send(400);
  }

  const list = await List.findById(req.params.id);
  return res.send(200, list);
}
