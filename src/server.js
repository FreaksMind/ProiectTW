import http from "http";
import mongoose from "mongoose";

import { getRouteHandler, getPathParams, servePublicFiles, serveStaticFile } from "./utils.js";
import apiRouter from "./api/router.js";

import dotenv from "dotenv";
dotenv.config();

const PORT = 5050;

const routes = {
  "/": (req, res) => {
    serveStaticFile(res, "./views/index.html", "text/html");
  },
  "/login": (req, res) => {
    serveStaticFile(res, "./views/login.html", "text/html");
  },
  "/signup": (req, res) => {
    serveStaticFile(res, "./views/signup.html", "text/html");
  },
  "/search": (req, res) => {
    serveStaticFile(res, "./views/search.html", "text/html");
  },
  "/results": (req, res) => {
    serveStaticFile(res, "./views/results.html", "text/html");
  },
  "/movie": (req, res) => {
    serveStaticFile(res, "./views/movie.html", "text/html");
  },
  ...apiRouter,
};

const server = http.createServer((req, res) => {
  const routeHandler = getRouteHandler(routes, req);

  if (routeHandler) {
    res.send = (statusCode, data = {}) => {
      res.writeHead(statusCode, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    };

    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        // TODO: handle parse errors
        const data = JSON.parse(body);
        req.body = data;

        routeHandler(req, res);
      });
    } else {
      req.params = getPathParams(routes, req);
      routeHandler(req, res);
    }
  } else {
    servePublicFiles(req, res);
  }
});

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`listening on ${PORT} ...`);
    });
  })
  .catch((err) => {
    console.log("error connecting to mongo db", err);
  });
