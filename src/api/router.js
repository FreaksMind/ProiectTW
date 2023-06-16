import { protectedRoute, login, register } from "./auth.js";
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
  // TODO: make this route protected
  "/api/movies/trending": getTrendingMovies,
  "/api/movies/search/:title": protectedRoute(searchMovies),
  "/api/movies/suggestions/:title": protectedRoute(searchSuggestions),
  "/api/movies/:id": getMovieById,
};

export default router;
