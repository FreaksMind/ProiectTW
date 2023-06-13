import http from "http";
import mongoose from "mongoose";

import { servePublicFiles, serveStaticFile } from "./handlers.js";

const PORT = 5050;

const routes = {
  "/": (req, res) => {
    serveStaticFile(res, "./views/index.html", "text/html")
  },
  "/login": (req, res) => {
    serveStaticFile(res, "./views/login.html", "text/html")
  }
};

const server = http.createServer((req, res) => {
  const routeHandler = routes[req.url];
  if (routeHandler) {
    routeHandler(req, res);
  } else {
    servePublicFiles(req, res);
  }
});

mongoose
  .connect("mongodb+srv://freaks:freaks@cluster0.hcbachu.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("server error", err);
  });

