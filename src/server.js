import http from "http";
import mongoose from "mongoose";

import { getRouteHandler, getPathParams, servePublicFiles, serveStaticFile } from "./utils.js";
import apiRouter from "./api/router.js";

import dotenv from "dotenv";
dotenv.config();

const PORT = 5050;

function serveHtml(file) {
  return (req, res) => {
    serveStaticFile(res, `./views/${file}`, "text/html");
  };
}

const routes = {
  "/": serveHtml("index.html"),
  "/login": serveHtml("login.html"),
  "/signup": serveHtml("signup.html"),
  "/search": serveHtml("search.html"),
  "/results": serveHtml("results.html"),
  "/movie": serveHtml("movie.html"),
  "/profile": serveHtml("profile.html"),
  "/list": serveHtml("list.html"),
  "/admin": serveHtml("admin.html"),
  "/actor": serveHtml("actor.html"),
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
        try {
          const data = JSON.parse(body);
          req.body = data;

          routeHandler(req, res);
        } catch (err) {
          console.log("error parsing post body", err);
        }
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
