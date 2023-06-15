import { protectedRoute, login, register } from "./auth.js";

const router = {
  "/api/auth/login": login,
  "/api/auth/register": register,
  "/api/demo": protectedRoute((req, res) => {
    res.send(200, { message: "bravo frt" });
  }),
};

export default router;
