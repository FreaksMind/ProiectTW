import { protectedRoute, login, register } from "./auth.js";
import { getTrendingMovies } from "./movies.js";

const router = {
  "/api/auth/login": login,
  "/api/auth/register": register,
  "/api/demo": protectedRoute((req, res) => {
    res.send(200, { message: "bravo frt" });
  }),
  "/api/movies/trending": getTrendingMovies,
  "/api/movies/:id": (req, res) => {
    res.send(200, { id: req.params.id, hello: req.params.hello });
  },
};

export default router;
