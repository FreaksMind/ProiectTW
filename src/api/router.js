import { login, register, checkToken } from "./auth.js";
import {
  addMovieToList,
  createNewList,
  deleteMovieFromList,
  getUserLists,
  deleteList,
  getList,
  getListPosterPreview,
} from "./lists.js";
import { getTrendingMovies, searchMovies, searchSuggestions, getMovieById } from "./movies.js";
import { searchActors, getActorById, getMoviesByActorId } from "./actors.js";

import { getUsers, deleteUser } from "./users.js";

const router = {
  "/api/auth/login": login,
  "/api/auth/register": register,
  "/api/auth/check-token": checkToken,
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
  "/api/actors/search/:name": searchActors,
  "/api/actors/:id": getActorById,
  "/api/actors/movies/:id": getMoviesByActorId,
};

export default router;
