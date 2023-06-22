import { login, register } from "./auth.js";
import {
  addMovieToList,
  createNewList,
  deleteMovieFromList,
  getUserLists,
  deleteList,
  getList,
  getListPosterPreview,
} from "./lists.js";
import {
  getTrendingMovies,
  searchMovies,
  searchSuggestions,
  getMovieById,
} from "./movies.js";
import { getUsers, deleteUser } from "./users.js";

const router = {
  "/api/auth/login": login,
  "/api/auth/register": register,
  "/api/movies/trending": getTrendingMovies,
  "/api/movies/search/:title": searchMovies,
  "/api/movies/suggestions/:title": searchSuggestions,
  "/api/movies/:id": getMovieById,
  "/api/lists/new": createNewList,
  "/api/lists/delete": deleteList,
  "/api/lists/get": getUserLists,
  "/api/lists/get/:id": getList,
  "/api/lists/poster-preview/:id": getListPosterPreview,
  "/api/lists/add-movie": addMovieToList,
  "/api/lists/delete-movie": deleteMovieFromList,
  "/api/admin/users": getUsers,
  "/api/admin/delete-user": deleteUser,
};

export default router;
