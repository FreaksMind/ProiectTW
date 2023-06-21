import { protectedRoute, login, register } from "./auth.js";
import {
  addMovieToList,
  createNewList,
  deleteMovieFromList,
  getUserLists,
  deleteList,
  getList,
} from "./lists.js";
import {
  getTrendingMovies,
  searchMovies,
  searchSuggestions,
  getMovieById,
} from "./movies.js";

const router = {
  "/api/auth/login": login,
  "/api/auth/register": register,
  "/api/demo": protectedRoute((req, res) => {
    res.send(200, { message: "bravo frt" });
  }),
  "/api/movies/trending": protectedRoute(getTrendingMovies),
  "/api/movies/search/:title": protectedRoute(searchMovies),
  "/api/movies/suggestions/:title": protectedRoute(searchSuggestions),
  "/api/movies/:id": protectedRoute(getMovieById),
  "/api/lists/new": protectedRoute(createNewList),
  "/api/lists/delete": protectedRoute(deleteList),
  "/api/lists/get": protectedRoute(getUserLists),
  "/api/lists/get/:id": protectedRoute(getList),
  "/api/lists/movie/add": protectedRoute(addMovieToList),
  "/api/lists/movie/delete": protectedRoute(deleteMovieFromList),
};

export default router;
